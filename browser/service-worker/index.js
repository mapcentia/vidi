/*
* @author     Alexander Shumilov
* @copyright  2013-2018 MapCentia ApS
* @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
*/

const CACHE_NAME = 'vidi-static-cache';
const API_ROUTES_START = 'api';
const LOG = false;
const LOG_FETCH_EVENTS = false;
const LOG_OFFLINE_MODE_EVENTS = false;

const CONFIG = require('../../config/config.js');


/**
 * Browser detection
 */
const {detect} = require('detect-browser');
const browser = detect();

const localforage = require('localforage');

/**
 * ServiceWorker. Caches all requests, some requests are processed in specific way:
 * 1. API calls are always performed, the cached response is retured only if the app is offline or
 * there is a API-related problem;
 * 2. Files with {extensionsIgnoredForCaching} are not cached, unless it is forced externally using
 * the 'message' event.
 *
 * Update mechanism. There should be an API method that returns the current application version. If it differs
 * from the previous one that is stored in localforage, then user should be notified about the update. If
 * user agrees to the update, then the current service worker is unregistered, cache wiped out and page
 * is reloaded (as well as all assets). This way the application update will not be dependent on the
 * actual service worker file change. The update will be centralized and performed by setting the different
 * app version in the configuration file.
 */

/**
 *
 */
let ignoredExtensionsRegExps = [];

/**
 *
 */
let forceIgnoredExtensionsCaching = false;

const urlsToCache = require(`urls-to-cache`);
const base64url = require("base64url");

const urlSubstitution = [{
    requested: 'https://netdna.bootstrapcdn.com/font-awesome/4.5.0/fonts/fontawesome-webfont.ttf?v=4.5.0',
    local: '/fonts/fontawesome-webfont.ttf'
}, {
    requested: 'https://themes.googleusercontent.com/static/fonts/opensans/v8/cJZKeOuBrn4kERxqtaUH3bO3LdcAZYWl9Si6vvxL-qU.woff',
    local: '/fonts/cJZKeOuBrn4kERxqtaUH3bO3LdcAZYWl9Si6vvxL-qU.woff'
}, {
    requested: 'https://netdna.bootstrapcdn.com/font-awesome/4.5.0/fonts/fontawesome-webfont.woff?v=4.5.0',
    local: '/fonts/fontawesome-webfont.woff'
}, {
    requested: 'https://netdna.bootstrapcdn.com/font-awesome/4.5.0/fonts/fontawesome-webfont.woff2?v=4.5.0',
    local: '/fonts/fontawesome-webfont.woff2'
}, {
    requested: '/app/alexshumilov/public/favicon.ico',
    local: '/favicon.ico'
}, {
    requested: 'https://rsdemo.alexshumilov.ru/app/alexshumilov/public/favicon.ico',
    local: '/favicon.ico'
}, {
    requested: 'https://gc2.io/apps/widgets/gc2table/js/gc2table.js',
    local: '/js/gc2/gc2table.js'
}, {
    requested: 'https://js-agent.newrelic.com/nr-1071.min.js',
    local: '/js/nr-1071.min.js'
}, {
    regExp: true,
    requested: '/[\\w]*/[\\w]*/[\\w]*/#',
    local: '/index.html'
}, {
    regExp: true,
    requested: '/js/lib/leaflet/images/marker-icon.png',
    local: '/js/lib/leaflet/images/marker-icon.png'
}, {
    regExp: true,
    requested: '/js/lib/leaflet/images/marker-shadow.png',
    local: '/js/lib/leaflet/images/marker-shadow.png'
}];

let extensionsIgnoredForCaching = ['JPEG', 'jpeg', 'jpg', 'PNG', 'TIFF', 'BMP'];

let urlsIgnoredForCaching = [{
    regExp: true,
    requested: '/api/sql/nocache/'
}, {
    regExp: true,
    requested: 'bam.nr-data.net'
}, {
    regExp: true,
    requested: 'https://gc2.io/api'
}, {
    regExp: true,
    requested: '/version.json'
}, {
    regExp: true,
    requested: 'geocloud.envirogissolutions.co.za/api'
}, {
    regExp: true,
    requested: 'geofyn.mapcentia.com/api'
}, {
    regExp: true,
    requested: 'https://rm.mapcentia.com/api'
}, {
    regExp: true,
    requested: 'google'
}, {
    regExp: true,
    requested: '/api/sql'
}, {
    regExp: true,
    requested: '/api/feature'
}, {
    regExp: true,
    requested: '/api/elasticsearch'
}, {
    regExp: true,
    requested: '/wms/'
}, {
    regExp: true,
    requested: '/api/print/'
}, {
    regExp: true,
    requested: '/api/v2'
}, {
    regExp: true,
    requested: '/mapcache/'
}];

if (typeof CONFIG.urlsIgnoredForCaching === "object") {
    urlsIgnoredForCaching = urlsIgnoredForCaching.concat(CONFIG.urlsIgnoredForCaching);
}

/**
 * Broadcasting service messages to clients, mostly used for debugging and validation
 */
const sendMessageToClients = (data) => {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({msg: data});
        });
    });
};

/**
 * Storing key-value pairs in memory
 */
class Keeper {
    constructor(cacheKey, inputParameterCheckFunction) {
        this._cacheKey = cacheKey;
        this._inputParameterCheckFunction = inputParameterCheckFunction;
    }

    batchSet(records) {
        return new Promise((resolve, reject) => {
            localforage.setItem(this._cacheKey, records).then(() => {
                //this.get(key).then(storedValue => {
                resolve();
                //});
            }).catch(error => {
                console.error(`localforage failed to perform operation`, error);
                reject();
            });
        });
    }

    set(key, value) {
        this._inputParameterCheckFunction(key, value);
        let initialCreated = value.created;
        return new Promise((resolve, reject) => {
            localforage.getItem(this._cacheKey).then(storedValue => {
                if (!storedValue) storedValue = {};
                let valueCopy = JSON.parse(JSON.stringify(storedValue));
                valueCopy[key] = JSON.parse(JSON.stringify(value));
                localforage.setItem(this._cacheKey, valueCopy).then(() => {
                    // Checking if value was really saved first time
                    this.get(key).then(storedValue => {
                        if (!storedValue.created || (storedValue.created && storedValue.created === initialCreated)) {
                            resolve();
                        } else {
                            let timeout = 300;
                            console.error(`Value was not really saved in localforage (${storedValue.created} vs ${initialCreated}), trying again in ${timeout} ms`, JSON.stringify(value));
                            setTimeout(() => {
                                localforage.setItem(this._cacheKey, valueCopy).then(() => {
                                    // Checking if value was really saved second time
                                    this.get(key).then(storedValue => {
                                        if (storedValue.created !== initialCreated) {
                                            resolve();
                                        } else {
                                            console.error(`Still unable to save the value`);
                                            resolve(); // We still resolve, because otherwise we ge a net:ERR_FAILED in browser
                                        }
                                    });
                                });
                            }, timeout);
                        }
                    });
                }).catch(error => {
                    console.error(`localforage failed to perform operation`, error);
                    resolve(); // We still resolve, because otherwise we ge a net:ERR_FAILED in browser
                });
            }).catch(error => {
                console.error(`localforage failed to perform operation`, error);
                resolve(); // We still resolve, because otherwise we ge a net:ERR_FAILED in browser
            });
        });
    }

    get(key) {
        this._inputParameterCheckFunction(key);
        return new Promise((resolve, reject) => {
            localforage.getItem(this._cacheKey).then(storedValue => {
                if (!storedValue) storedValue = {};
                if (key in storedValue) {
                    resolve(storedValue[key]);
                } else {
                    resolve(false);
                }
            }).catch(error => {
                console.error(`localforage failed to perform operation`, error);
                reject();
            });
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            localforage.getItem(this._cacheKey).then(storedValue => {
                if (!storedValue) storedValue = {};
                resolve(storedValue);
            }).catch(error => {
                console.error(`localforage failed to perform operation`, error);
                reject();
            });
        });
    }
}

/**
 * Key-value store for keeping extracted POST data for the specific URL
 */
let URLToPostDataKeeper = new Keeper(`VIDI_URL_TO_POST_DATA_KEY`, (key) => {
    if (!key || key.indexOf(`api/sql`) === -1) {
        throw new Error(`Invalid URL ${key}`);
    }
});

/**
 * Key-value store for keeping offline mode settings the specific layer key
 */
let cacheSettingsKeeper = new Keeper(`VIDI_CACHE_SETTINGS_KEY`, (key, value) => {
    if (!key || key.split(`.`).length !== 2) {
        throw new Error(`Invalid layer key ${key}`);
    }

    if (value) {
        if (!(`offlineMode` in value) || !(`layerKey` in value) || !(`bbox` in value) || !(`cleanedRequestURL` in value)) {
            throw new Error(`Invalid value ${JSON.stringify(value)}`);
        }
    }
});


/**
 * Cleaning up and substituting with local URLs provided address
 *
 * @param {String} URL
 *
 * @return {String}
 */
const normalizeTheURL = (URL) => {
    let cleanedRequestURL = URL;
    if (URL.indexOf('_=') !== -1) {
        cleanedRequestURL = URL.split("?")[0];

        if (LOG) console.log(`Service worker: URL was cleaned up: ${cleanedRequestURL} (${URL})`);
    }

    urlSubstitution.map(item => {
        if (item.regExp) {
            let re = new RegExp(item.requested);
            if (re.test(URL)) {

                if (LOG) console.log(`Service worker: Requested the ${cleanedRequestURL} but fetching the ${item.local} (regular expression)`);

                cleanedRequestURL = item.local;
            }
        } else if (item.requested.indexOf(cleanedRequestURL) === 0 || cleanedRequestURL.indexOf(item.requested) === 0) {

            if (LOG) console.log(`Service worker: Requested the ${cleanedRequestURL} but fetching the ${item.local} (normal string rule)`);

            cleanedRequestURL = item.local;
        }
    });

    return cleanedRequestURL;
};


/**
 * Cleaning up and substituting with local URLs provided address
 *
 * @param {FetchEvent} event
 *
 * @return {Promise}
 */
const normalizeTheURLForFetch = (event) => {
    let _URL = event.request.url;
    let result = new Promise((resolve, reject) => {
        let cleanedRequestURL = normalizeTheURL(_URL);
        if (event && event.request.url.indexOf('/api/sql') !== -1) {
            let clonedRequest = event.request.clone();

            /**
             * Proceeds with requests after request data is extracted depending on the request type. The actual
             * function is not depending on the request type.
             *
             * @param {String} method            Original request method
             * @param {Object} mappedObject      Contains extracted data from either the POST or GET parameters
             * @param {String} cleanedRequestURL Update request URL
             *
             * @returns {void}
             */
            const proceedWithRequestData = (method, mappedObject, cleanedRequestURL) => {
                if (`q` in mappedObject) {
                    URLToPostDataKeeper.get(cleanedRequestURL).then(record => {
                        // Request is performed first time and has to be saved in cached vector layers keeper
                        if (record) {
                            resolve(cleanedRequestURL);
                        } else {
                            let decodedQuery = false;
                            record = {};
                            if (`q` in mappedObject && mappedObject.q) {
                                if (method === `POST`) {
                                    let cleanedString = mappedObject.q.replace(/%3D/g, '');
                                    decodedQuery = base64url.decode(cleanedString);
                                } else if (method === `GET`) {
                                    decodedQuery = mappedObject.q;
                                } else {
                                    console.error(`Unable to decode query`);
                                    reject();
                                }
                            } else {
                                console.error(`Unable to extract the query from api/sql request`);
                                reject();
                            }

                            let matches = decodedQuery.match(/\s+\w*\.\w*\s*/);

                            //
                            if (matches === null) {
                                resolve(cleanedRequestURL);
                            }

                            if (matches.length === 1) {
                                let tableName = matches[0].trim().split(`.`);

                                record.layerKey = (tableName[0] + `.` + tableName[1]);
                                record.cleanedRequestURL = cleanedRequestURL;
                                record.bbox = false;
                                if (decodedQuery.indexOf(`ST_Intersects`) !== -1 && decodedQuery.indexOf(`ST_Transform`) && decodedQuery.indexOf(`ST_MakeEnvelope`)) {
                                    let bboxCoordinates = decodedQuery.substring((decodedQuery.indexOf(`(`, decodedQuery.indexOf(`ST_MakeEnvelope`)) + 1), decodedQuery.indexOf(`)`, decodedQuery.indexOf(`ST_MakeEnvelope`))).split(`,`).map(a => a.trim());
                                    if (bboxCoordinates.length === 5) {
                                        record.bbox = {
                                            north: parseFloat(bboxCoordinates[3]),
                                            east: parseFloat(bboxCoordinates[2]),
                                            south: parseFloat(bboxCoordinates[1]),
                                            west: parseFloat(bboxCoordinates[0])
                                        };
                                    }
                                }
                            } else {
                                console.error(`Unable to detect the layer key`);
                                reject();
                            }

                            if (`custom_data` in mappedObject && mappedObject.custom_data && mappedObject.custom_data !== `null`) {
                                let parsedCustomData = false;
                                try {
                                    parsedCustomData = JSON.parse(mappedObject.custom_data)
                                } catch (e) {
                                }
                                if (`virtual_layer` in parsedCustomData && parsedCustomData.virtual_layer) {
                                    record.layerKey = parsedCustomData.virtual_layer;
                                    if (LOG_OFFLINE_MODE_EVENTS) console.log(`Request was treated as a virtual one (layerKey ${record.layerKey})`);
                                }
                            }

                            URLToPostDataKeeper.set(cleanedRequestURL, record).then(() => {
                                resolve(cleanedRequestURL);
                            }).catch((e) => {
                                reject(e);
                            });
                        }
                    }).catch((e) => {
                        reject(e);
                    });
                } else {
                    resolve(cleanedRequestURL);
                }
            };

            /**
             * GET requests are processed same way for all browsers
             */
            const processGETRequest = (clonedRequest) => {
                let mappedObject = {};
                let url = new URL(clonedRequest.url)
                let searchParams = new URLSearchParams(url.search);
                let urlVars = {};
                for (let p of searchParams) {
                    urlVars[p[0]] = p[1];
                }
                console.log("GET in SW", urlVars);
                if (`q` in urlVars && urlVars.q) {
                    mappedObject.q = urlVars.q;
                }
                proceedWithRequestData(clonedRequest.method, mappedObject, cleanedRequestURL);
            };

            if (browser.name === 'edge') {
                if (clonedRequest.method === `POST`) {
                    clonedRequest.text().then(data => {
                        let mappedObject = {};
                        let splitDecodeData = data.split(`&`);
                        if (splitDecodeData.length > 0) {
                            splitDecodeData.map(item => {
                                if (item.indexOf(`=`) !== -1) {
                                    let splitParameter = item.split(`=`);
                                    if (splitParameter.length === 2) {
                                        mappedObject[splitParameter[0]] = splitParameter[1];
                                    }
                                }
                            });
                        }

                        cleanedRequestURL += '/' + btoa(data);
                        proceedWithRequestData(clonedRequest.method, mappedObject, cleanedRequestURL);

                        return;
                    }).catch(error => {
                        console.error(`Unable to read POST data`);
                        reject();
                    });
                } else if (clonedRequest.method === `GET`) {
                    processGETRequest(clonedRequest);
                } else {
                    console.error(`Invalid request type`);
                    reject();
                }
            } else if (browser.name === 'safari' || browser.name === 'ios') {
                if (clonedRequest.method === `POST`) {
                    let rawResult = ``;
                    let data = false;
                    let reader = clonedRequest.body.getReader();
                    reader.read().then(function processText({done, value}) {
                        if (done) {
                            const DecodeUInt8arr = (uint8array) => {
                                return new TextDecoder("utf-8").decode(uint8array);
                            };

                            let mappedObject = {};
                            let decodedData = DecodeUInt8arr(data);
                            let splitDecodeData = decodedData.split(`&`);
                            if (splitDecodeData.length > 0) {
                                splitDecodeData.map(item => {
                                    if (item.indexOf(`=`) !== -1) {
                                        let splitParameter = item.split(`=`);
                                        if (splitParameter.length === 2) {
                                            mappedObject[splitParameter[0]] = splitParameter[1];
                                        }
                                    }
                                });
                            }

                            cleanedRequestURL += '/' + btoa(rawResult);
                            proceedWithRequestData(clonedRequest.method, mappedObject, cleanedRequestURL);

                            return;
                        }

                        data = value;
                        rawResult += value;

                        return reader.read().then(processText);
                    });
                } else if (clonedRequest.method === `GET`) {
                    processGETRequest(clonedRequest);
                } else {
                    console.error(`Invalid request type`);
                    reject();
                }
            } else {
                if (clonedRequest.method === `POST`) {
                    clonedRequest.formData().then(formdata => {
                        let mappedObject = {};
                        let payload = '';
                        for (var p of formdata) {
                            let splitParameter = p.toString().split(',');
                            if (splitParameter.length === 2) {
                                mappedObject[splitParameter[0]] = splitParameter[1];
                            }

                            payload += p.toString();
                        }

                        cleanedRequestURL += '/' + btoa(payload);

                        proceedWithRequestData(clonedRequest.method, mappedObject, cleanedRequestURL);
                    }).catch(() => {
                        console.error(`Unable to get the formData() for request`);
                        reject();
                    });
                } else if (clonedRequest.method === `GET`) {
                    processGETRequest(clonedRequest);
                } else {
                    console.error(`Invalid request type`);
                    reject();
                }
            }
        } else {
            resolve(cleanedRequestURL);
        }
    });
    return result;
};


/**
 * "install" event handler
 */
self.addEventListener('install', event => {
    if (LOG) console.log('Service worker: is being installed, caching specified resources');

    extensionsIgnoredForCaching.map(item => {
        let localRegExp = new RegExp(`${item}[\?]?`, 'i');
        ignoredExtensionsRegExps.push(localRegExp);
    });

    event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
        let urlsToCacheAliased = urlsToCache;
        for (let i = 0; i < urlsToCacheAliased.length; i++) {
            urlsToCacheAliased[i] = normalizeTheURL(urlsToCacheAliased[i]);
        }

        let cachingRequests = [];
        urlsToCacheAliased.map(item => {
            let result = new Promise((resolve, reject) => {
                cache.add(item).then(() => {
                    resolve();
                }).catch(error => {
                    console.log('Service worker: failed to fetch during install', item, error);
                    reject();
                });
            });

            cachingRequests.push(result);
        });

        let result = new Promise((resolve, reject) => {
            Promise.all(cachingRequests).then(() => {
                if (LOG) console.log('Service worker: all resources have been fetched and cached');
                resolve();
            }).catch(error => {
                if (LOG) console.warn('Service worker: failed to load initial resources');
                reject();
            });
        });

        return self.skipWaiting();
    }).catch(error => {
        console.log(error);
    }));
});

/**
 * "activate" event handler
 */
self.addEventListener('activate', event => {

    if (LOG) console.log('Service worker: service worker is ready to handle fetches');

    event.waitUntil(clients.claim());
});


/**
 * "message" event handler
 */
self.addEventListener('message', (event) => {
    if (event.data === "claimMe") {
        if (LOG) console.log('Service worker: clients claimed after a hard refresh');
        caches.delete("vidi-static-cache").then(() => {
            self.clients.claim();
            console.log('Service worker: vidi-static-cache deleted');
        });
    } else if (`force` in event.data) {
        if (event.data && event.data.force) {

            if (LOG) console.log('Service worker: forcing caching of files with ignored extensions');

            forceIgnoredExtensionsCaching = true;
        } else {

            if (LOG) console.log('Service worker: not forcing caching of files with ignored extensions');

            forceIgnoredExtensionsCaching = false;
        }
    } else if (`action` in event.data) {
        const reportFailure = (error) => {
            if (error) console.error(error);
            event.ports[0].postMessage(false);
        };

        if (event.data.action === `addUrlIgnoredForCaching` && `payload` in event.data) {

            if (LOG) console.log('Service worker: adding url that should not be cached', event.data);

            if (event.data.payload && event.data.payload.length > 0) {
                urlsIgnoredForCaching.push({
                    regExp: true,
                    requested: event.data.payload
                });
            } else {
                throw new Error(`Invalid URL format`);
            }
        } else if (event.data.action === `getListOfCachedRequests`) {
            /**
             * { action: "getListOfCachedRequests" }
             *
             *
             * @returns {Array} of cached layer names
             */

            let layers = [];

            cacheSettingsKeeper.getAll().then(records => {
                for (let key in records) {
                    layers.push({
                        layerKey: records[key].layerKey,
                        bbox: records[key].bbox,
                        offlineMode: records[key].offlineMode
                    });
                }

                event.ports[0].postMessage(layers);
            });
        } else if (event.data.action === `disableOfflineModeForAll`) {
            cacheSettingsKeeper.getAll().then(records => {
                let recordsCopy = JSON.parse(JSON.stringify(records));
                for (let key in recordsCopy) {
                    recordsCopy[key].offlineMode = false;
                }

                cacheSettingsKeeper.batchSet(recordsCopy).then(() => {
                    event.ports[0].postMessage(true);
                }).catch(reportFailure);
            });
        } else if ((event.data.action === `batchSetOfflineModeForLayers`) && `payload` in event.data) {
            if (event.data.payload) {
                cacheSettingsKeeper.getAll().then(records => {
                    let recordsCopy = JSON.parse(JSON.stringify(records));
                    let offlineModeSettings = JSON.parse(JSON.stringify(event.data.payload));
                    for (let key in recordsCopy) {
                        for (let layerKey in offlineModeSettings) {
                            if (key === layerKey) {
                                recordsCopy[key].offlineMode = offlineModeSettings[layerKey];
                            }
                        }
                    }

                    cacheSettingsKeeper.batchSet(recordsCopy).then(() => {
                        event.ports[0].postMessage(true);
                    }).catch(reportFailure);
                });
            } else {
                throw new Error(`Invalid parameters for batchEnableOfflineModeForLayers`);
            }
        } else if ((event.data.action === `enableOfflineModeForLayer` || event.data.action === `disableOfflineModeForLayer`) && `payload` in event.data) {
            if (event.data.payload && `layerKey` in event.data.payload && event.data.payload.layerKey) {
                cacheSettingsKeeper.getAll().then(records => {
                    let messageWasSent = false;
                    for (let key in records) {
                        if (records[key].layerKey === event.data.payload.layerKey) {
                            if (event.data.action === `enableOfflineModeForLayer`) {
                                records[key].offlineMode = true;
                            } else if (event.data.action === `disableOfflineModeForLayer`) {
                                records[key].offlineMode = false;
                            }

                            let currentTime = new Date();
                            records[key].created = currentTime.getTime();
                            messageWasSent = true;
                            cacheSettingsKeeper.set(key, records[key]).then(() => {
                                event.ports[0].postMessage(true);
                            }).catch(reportFailure);
                        }
                    }

                    if (messageWasSent === false) {
                        reportFailure(`${event.data.payload.layerKey} was not found in cache settings`);
                    }
                });
            } else {
                throw new Error(`Invalid payload for ${event.data.action} action`);
            }
        } else {
            throw new Error(`Unrecognized action`);
        }
    }
});


/**
 * "fetch" event handler
 */
self.addEventListener('fetch', (event) => {
    if (LOG_FETCH_EVENTS) console.log(`Reacting to fetch event ${event.request.url}`);

    /**
     * Wrapper for API calls - the API responses should be as relevant as possible.
     *
     * @param {*} event Fetch event
     * @param {*} cachedResponse Already cached response
     *
     * @return {Promise}
     */
    const queryAPI = (cleanedRequestURL, event, cachedResponse) => {

        if (LOG_FETCH_EVENTS) console.log('Service worker: API call detected', cleanedRequestURL);

        if (cleanedRequestURL.indexOf('/api/feature') !== -1) {
            return fetch(event.request);
        } else {
            let result = new Promise((resolve, reject) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    if (cleanedRequestURL.indexOf('/api/sql') > -1) {

                        /**
                         * Looks for correct response for the request considering following factors:
                         * - the requested vector layer can be set online of offline
                         * - the requested layer can be dynamic or static
                         * - if the layer is dynamic and request with the bounding box that contains the requested one already
                         * exists, then the cached response for the containing request can be returned is layer is set to be
                         * offline
                         * - every real request made to the server should be recorded/updated in cacheSettingsKeeper for
                         * specific layer key
                         *
                         * @returns {Promise} That resolves to the response or false if request should be really be made
                         */
                        const getSuitableResponseForVectorLayerRequest = (cleanedRequestURL, requestData) => {

                            if (LOG_OFFLINE_MODE_EVENTS) console.log(`Getting suitable response for vector layer request`, cleanedRequestURL);

                            return new Promise((resolve, reject) => {
                                cacheSettingsKeeper.get(requestData.layerKey).then(cacheSettings => {
                                    if (!requestData) throw new Error(`Unable to find the POST data for request ${cleanedRequestURL}`);
                                    cacheSettingsKeeper.getAll().then(records => {
                                        if (requestData.bbox) {
                                            // Dynamic query

                                            if (LOG_OFFLINE_MODE_EVENTS) console.log(`${requestData.layerKey} request has bbox:`, requestData.bbox);

                                            if (cacheSettings && cacheSettings.offlineMode) {
                                                // Offline mode is enabled for layer

                                                if (LOG_OFFLINE_MODE_EVENTS) console.log(`${requestData.layerKey} offline mode is enabled`);

                                                if (cacheSettings.bbox) {
                                                    // Previous request to vector layer was dynamic

                                                    if (LOG_OFFLINE_MODE_EVENTS) console.log(`Previous request to vector layer was dynamic, bbox:`, cacheSettings.bbox);

                                                    let responseForPreviousQueryCanBeUsed = false;
                                                    if (requestData.bbox.north === cacheSettings.bbox.north && requestData.bbox.east === cacheSettings.bbox.east &&
                                                        requestData.bbox.south === cacheSettings.bbox.south && requestData.bbox.west === cacheSettings.bbox.west) {
                                                        // Exactly the same bounding box
                                                        responseForPreviousQueryCanBeUsed = true;
                                                    } else if (requestData.bbox.north <= cacheSettings.bbox.north && requestData.bbox.east <= cacheSettings.bbox.east &&
                                                        requestData.bbox.south >= cacheSettings.bbox.south && requestData.bbox.west >= cacheSettings.bbox.west) {
                                                        // Requested bounding box is inside of the already requested bounding box
                                                        responseForPreviousQueryCanBeUsed = true;
                                                    }

                                                    if (LOG_OFFLINE_MODE_EVENTS) console.log(`Response for previous request can be used`, responseForPreviousQueryCanBeUsed);

                                                    if (responseForPreviousQueryCanBeUsed) {
                                                        // Previous request to vector layer was dynamic
                                                        caches.match(cacheSettings.cleanedRequestURL).then(response => {

                                                            if (LOG_OFFLINE_MODE_EVENTS) console.log(`Previous request response`, response);

                                                            sendMessageToClients(`RESPONSE_CACHED_DUE_TO_OFFLINE_MODE_SETTINGS`);

                                                            resolve({
                                                                response,
                                                                requestData
                                                            });
                                                        });
                                                    } else {
                                                        resolve({
                                                            response: false,
                                                            requestData
                                                        });
                                                    }
                                                } else {
                                                    // Previous request to vector layer was static

                                                    if (LOG_OFFLINE_MODE_EVENTS) console.log(`Previous request to vector layer was static`);

                                                    resolve({
                                                        response: false,
                                                        requestData
                                                    });
                                                }
                                            } else {
                                                // Offline mode is disabled for layer

                                                if (LOG_OFFLINE_MODE_EVENTS) console.log(`${requestData.layerKey} offline mode is disabled`);

                                                resolve({
                                                    response: false,
                                                    requestData
                                                });
                                            }
                                        } else {
                                            // Static query

                                            if (LOG_OFFLINE_MODE_EVENTS) console.log(`Static query`);

                                            if (cacheSettings && cacheSettings.offlineMode) {
                                                // Offline mode is enabled for layer

                                                if (LOG_OFFLINE_MODE_EVENTS) console.log(`Offline mode is enabled for layer`);

                                                if (cachedResponse) {
                                                    sendMessageToClients(`RESPONSE_CACHED_DUE_TO_OFFLINE_MODE_SETTINGS`);

                                                    resolve({
                                                        response: cachedResponse,
                                                        requestData
                                                    });
                                                } else {
                                                    resolve({
                                                        response: false,
                                                        requestData
                                                    });
                                                }
                                            } else {
                                                // Offline mode is disabled for layer

                                                if (LOG_OFFLINE_MODE_EVENTS) console.log(`Offline mode is disabled for layer`);

                                                resolve({
                                                    response: false,
                                                    requestData
                                                });
                                            }
                                        }


                                    });


                                }).catch(() => {
                                    console.error(`Unable to get cache settings for ${requestData.layerKey}`);
                                    resolve({
                                        response: false,
                                        requestData
                                    });
                                });
                            });
                        };

                        return URLToPostDataKeeper.get(cleanedRequestURL).then(requestData => {
                            if (requestData && `layerKey` in requestData && requestData.layerKey) {
                                // This is the vector layer request
                                return getSuitableResponseForVectorLayerRequest(cleanedRequestURL, requestData).then(result => {
                                    if (LOG_OFFLINE_MODE_EVENTS) console.log(`getSuitableResponseForVectorLayerRequest result:`, result);

                                    if (result && result.response) {
                                        resolve(result.response);
                                    } else {
                                        return fetch(event.request).then(apiResponse => {

                                            if (LOG_FETCH_EVENTS) console.log('Service worker: API request was performed');
                                            if (LOG_OFFLINE_MODE_EVENTS) console.log(`Layer vector was requested, storing response in cache and updating the cache settings`);

                                            if (result.requestData) {
                                                return cacheSettingsKeeper.get(result.requestData.layerKey).then(data => {
                                                    if (!data) data = {offlineMode: false};

                                                    if (LOG_OFFLINE_MODE_EVENTS) console.log(`Getting existing cache settings`, data);

                                                    let currentTime = new Date();
                                                    let newData = {};
                                                    newData.layerKey = result.requestData.layerKey;
                                                    newData.cleanedRequestURL = cleanedRequestURL;
                                                    newData.bbox = result.requestData.bbox;
                                                    newData.offlineMode = data.offlineMode;
                                                    newData.created = currentTime.getTime();

                                                    if (LOG_OFFLINE_MODE_EVENTS) console.log(`Storing cache settings`, newData);

                                                    // Storing the cache settings for vector layer
                                                    return cacheSettingsKeeper.set(result.requestData.layerKey, newData).then(() => {
                                                        // Caching the vector layer request
                                                        return cache.put(cleanedRequestURL, apiResponse.clone()).then(() => {
                                                            resolve(apiResponse);
                                                        }).catch(() => {
                                                            throw new Error('Unable to put the response in cache');
                                                        });
                                                    });
                                                });
                                            } else {
                                                throw new Error(`Unable to get the request POST data`);
                                            }
                                        }).catch(() => {

                                            if (LOG_FETCH_EVENTS) console.log('Service worker: API request failed, using the cached response');

                                            resolve(cachedResponse);
                                        });
                                    }
                                });
                            } else {
                                // Regular API request
                                return fetch(event.request).then(apiResponse => {
                                    resolve(apiResponse);
                                });
                            }
                        }).catch(error => {
                            console.error(`Unable to get POST data for ${cleanedRequestURL}`, error);
                            reject();
                        });
                    } else {
                        // Regular API request, always trying to perform it
                        return fetch(event.request).then(apiResponse => {

                            if (LOG_FETCH_EVENTS) console.log('Service worker: API request was performed despite the existence of cached request');

                            // Caching the API request in case if app will go offline aftewards
                            return cache.put(cleanedRequestURL, apiResponse.clone()).then(() => {
                                resolve(apiResponse);
                            }).catch(() => {
                                throw new Error('Unable to put the response in cache');
                            })
                        }).catch(() => {

                            if (LOG_FETCH_EVENTS) console.log('Service worker: API request failed, using the previously cached response');

                            // @todo Check if cachedResponse could be null

                            resolve(cachedResponse);
                        });
                    }
                }).catch(error => {
                    console.error(error);
                    throw new Error('Unable to open cache');
                });
            });

            return result;
        }
    };

    let requestShouldBeBypassed = false;
    urlsIgnoredForCaching.map(item => {
        if (item.regExp) {
            let regExp = new RegExp(item.requested);
            if (regExp.test(event.request.url)) {
                requestShouldBeBypassed = true;
                return false;
            }
        } else if (event.request.url === item.requested) {
            requestShouldBeBypassed = true;
            return false;
        }
    });

    if (requestShouldBeBypassed) {
        if (LOG_FETCH_EVENTS) console.log(`Service worker: bypassing the ${event.request.url} request`);
        //return fetch(event.request);
    } else {
        if (LOG_FETCH_EVENTS) console.log(`Service worker: not bypassing the ${event.request.url} request`);

        event.respondWith(normalizeTheURLForFetch(event).then(cleanedRequestURL => {
            let detectNoSlashPathRegExp = /\/app\/[\w]+\/[\w]+$/;
            if (cleanedRequestURL.match(detectNoSlashPathRegExp) && cleanedRequestURL.match(detectNoSlashPathRegExp).length === 1) {
                cleanedRequestURL = cleanedRequestURL + `/`;
            }

            return caches.match(cleanedRequestURL).then((response) => {
                if (response) {
                    if (LOG_FETCH_EVENTS) console.log(`Service worker: request ${event.request.url} was found in cache`);

                    let apiCallDetectionRegExp = new RegExp(self.registration.scope + API_ROUTES_START);
                    // API requests should not use the probably stalled cached copy if it is possible
                    if (apiCallDetectionRegExp.test(cleanedRequestURL)) {
                        return queryAPI(cleanedRequestURL, event, response);
                    } else {
                        if (LOG_FETCH_EVENTS) console.log(`Service worker: in cache ${event.request.url}`);
                        return response;
                    }
                } else {
                    if (LOG_FETCH_EVENTS) console.log(`Service worker: request ${event.request.url} was not found in cache`);

                    let apiCallDetectionRegExp = new RegExp(self.registration.scope + API_ROUTES_START);
                    // API requests should not use the probably stalled cached copy if it is possible
                    if (apiCallDetectionRegExp.test(cleanedRequestURL)) {
                        return queryAPI(cleanedRequestURL, event, response);
                    } else {
                        // Checking if the request is eligible for caching 
                        let requestHasToBeCached = true;
                        if (forceIgnoredExtensionsCaching === false) {
                            ignoredExtensionsRegExps.map(item => {
                                if (item.test(cleanedRequestURL)) {
                                    requestHasToBeCached = false;
                                    return false;
                                }
                            });
                        }

                        let requestToMake = new Request(cleanedRequestURL);
                        if (cleanedRequestURL.indexOf('/connection-check.ico') !== -1) {
                            var result = new Promise((resolve, reject) => {
                                fetch(requestToMake).then(() => {
                                    let dummyResponse = new Response(null, {statusText: 'ONLINE'});
                                    resolve(dummyResponse);
                                }).catch(() => {
                                    let dummyResponse = new Response(null, {statusText: 'OFFLINE'});
                                    resolve(dummyResponse);
                                });
                            });

                            return result;
                        } else if (requestHasToBeCached) {

                            if (LOG_FETCH_EVENTS) console.log(`Service worker: caching ${requestToMake.url}`);

                            return caches.open(CACHE_NAME).then((cache) => {
                                return fetch(requestToMake).then(response => {
                                    return cache.put(requestToMake.url, response.clone()).then(() => {
                                        return response;
                                    });
                                }).catch(error => {
                                    console.warn(`Service worker: unable the fetch ${requestToMake.url}`);
                                });
                            });
                        } else {
                            return fetch(requestToMake);
                        }
                    }
                }
            });
        }).catch((err) => {
            console.log(err)
        }));
    }
});
