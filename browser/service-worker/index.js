const CACHE_NAME = 'vidi-static-cache';
const API_ROUTES_START = 'api';
const LOG = false;
const LOG_FETCH_EVENTS = false;

/**
 * Browser detection
 */
const { detect } = require('detect-browser');
const browser = detect();

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

let urlsToCache = require(`urls-to-cache`);

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
    requested: 'https://maps.google.com/maps/api/js',
    local: '/js/google-maps/index.js'
}, {
    regExp: true,
    requested: 'https://maps.google.com/maps-api-v3/api/js/[\\w/]*/common.js',
    local: '/js/google-maps/common.js'
}, {
    regExp: true,
    requested: 'https://maps.google.com/maps-api-v3/api/js/[\\w/]*/util.js',
    local: '/js/google-maps/util.js'
}, {
    regExp: true,
    requested: 'https://maps.google.com/maps-api-v3/api/js/[\\w/]*/controls.js',
    local: '/js/google-maps/controls.js'
}, {
    regExp: true,
    requested: 'https://maps.google.com/maps-api-v3/api/js/[\\w/]*/places_impl.js',
    local: '/js/google-maps/places_impl.js'
}, {
    regExp: true,
    requested: 'https://maps.google.com/maps-api-v3/api/js/[\\w/]*/stats.js',
    local: '/js/google-maps/stats.js'
}, {
    requested: 'https://maps.googleapis.com/maps/api/js/AuthenticationService',
    local: '/js/google-maps/stats.js'
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

let extensionsIgnoredForCaching = ['JPEG', 'PNG', 'TIFF', 'BMP'];

let urlsIgnoredForCaching = [{
    regExp: true,
    requested: 'bam.nr-data.net'
}, {
    regExp: true,
    requested: 'gc2.io/api'   
}];

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
    let URL = event.request.url;
    let result = new Promise((resolve, reject) => {
        let cleanedRequestURL = normalizeTheURL(URL);
        if (event && event.request.method === 'POST' && event.request.url.indexOf('/api/sql') !== -1) {
            let clonedRequest = event.request.clone();
            if (browser.name === 'safari' || browser.name === 'ios') {
                let rawResult = "";
                let reader = clonedRequest.body.getReader();
                reader.read().then(function processText({ done, value }) {
                    if (done) {
                        cleanedRequestURL += '/' + btoa(rawResult);
                        resolve(cleanedRequestURL);
                        return;
                    }
    
                    rawResult += value;
                    return reader.read().then(processText);
                });
            } else {
                clonedRequest.formData().then((formdata) => {
                    let payload = '';
                    for (var p of formdata) {
                        payload += p.toString();
                    }
    
                    cleanedRequestURL += '/' + btoa(payload);
    
                    resolve(cleanedRequestURL);
                });
            }
        } else {
            resolve(cleanedRequestURL);
        }
    });

    return result;
}


/**
 * "install" event handler
 */
self.addEventListener('install', event => {
    if (LOG) console.log('Service worker: is being installed, caching specified resources');

    extensionsIgnoredForCaching.map(item => {
        let localRegExp = new RegExp(`.${item}[\?]?`, 'i');
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
    if (`force` in event.data) {
        if (event.data && event.data.force) {

            if (LOG) console.log('Service worker: forcing caching of files with ignored extensions');

            forceIgnoredExtensionsCaching = true;
        } else {

            if (LOG) console.log('Service worker: not forcing caching of files with ignored extensions');

            forceIgnoredExtensionsCaching = false;
        }
    } else if (`action` in event.data && `payload` in event.data) {
        if  (event.data.action === `addUrlIgnoredForCaching`) {

            if (LOG) console.log('Service worker: adding url that should not be cached', event.data);

            if (event.data.payload && event.data.payload.length > 0) {
                urlsIgnoredForCaching.push({
                    regExp: true,
                    requested: event.data.payload
                });
            } else {
                throw new Error(`Invalid URL format`);
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
                    return fetch(event.request).then(apiResponse => {
                        if (LOG_FETCH_EVENTS) console.log('Service worker: API request was performed despite the existence of cached request');
                        // Caching the API request in case if app will go offline aftewards
                        return cache.put(cleanedRequestURL, apiResponse.clone()).then(() => {
                            resolve(apiResponse);
                        }).catch(error => {
                            throw new Error('Unable to put the response in cache');
                            reject();
                        });
                    }).catch(error => {
                        if (LOG_FETCH_EVENTS) console.log('Service worker: API request failed, using the cached response');
                        resolve(cachedResponse);
                    });
                }).catch(error => {
                    throw new Error('Unable to open cache');
                    reject();
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

        return false;
        //return fetch(event.request);
    } else {
        event.respondWith(normalizeTheURLForFetch(event).then(cleanedRequestURL => {
            let detectNoSlashPathRegExp = /\/app\/[\w]+\/[\w]+$/;
            if (cleanedRequestURL.match(detectNoSlashPathRegExp) && cleanedRequestURL.match(detectNoSlashPathRegExp).length === 1) {
                cleanedRequestURL = cleanedRequestURL + `/`;
            }

            return caches.match(cleanedRequestURL).then((response) => {
                if (response) {
                    // The request was found in cache
                    let apiCallDetectionRegExp = new RegExp(self.registration.scope + API_ROUTES_START);
                    // API requests should not use the probably stalled cached copy if it is possible
                    if (apiCallDetectionRegExp.test(cleanedRequestURL)) {
                        return queryAPI(cleanedRequestURL, event, response);
                    } else {
                        if (LOG_FETCH_EVENTS) console.log(`Service worker: in cache ${event.request.url}`);
                        return response;
                    }
                } else {
                    // The request was not found in cache

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
                                    let dummyResponse = new Response(null, { statusText: 'ONLINE' });
                                    resolve(dummyResponse);
                                }).catch(() => {
                                    let dummyResponse = new Response(null, { statusText: 'OFFLINE' });
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
        }));
    }
});