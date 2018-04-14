const CACHE_NAME = 'vidi-static-cache';
const API_ROUTES_START = 'api';
const LOG = false;

/**
 * ServiceWorker. Caches all requests, some requests are processed in specific way:
 * 1. API calls are always performed, the cached response is retured only if the app is offline or 
 * there is a API-related problem;
 * 2. Files with {extensionsIgnoredForCaching} are not cached, unless it is forced externally.
 */

/**
 * 
 */
let ignoredExtensionsRegExps = [];

/**
 *
 */
let forceIgnoredExtensionsCaching = false;

let urlsToCache = [
    '/index.html',
    '/js/lib/leaflet/images/marker-icon.png',
    '/js/lib/leaflet/images/marker-shadow.png',
    '/js/lib/Leaflet.awesome-markers/images/markers-soft.png',
    '/js/lib/Leaflet.awesome-markers/images/markers-shadow.png',
    'https://netdna.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css',
    'https://netdna.bootstrapcdn.com/font-awesome/4.5.0/fonts/fontawesome-webfont.woff2?v=4.5.0',
    'https://cdn.polyfill.io/v2/polyfill.min.js?features=Element.prototype.classList,WeakMap,MutationObserver,URL,Array.from',
    'https://maps.google.com/maps/api/js?v=3&libraries=places&key=AIzaSyCjTXR2Tmg_Ok7u4S5dl6_Rgy3br_BQfPQ',
    '/js/google-maps/common.js',
    '/js/google-maps/util.js',
    '/js/google-maps/controls.js',
    '/js/google-maps/places_impl.js',
    '/js/google-maps/stats.js',
    '/js/lib/momentjs/moment-with-locales.js',
    '/js/lib/Leaflet.awesome-markers/leaflet.awesome-markers.js',
    '/js/lib/es5-shim/es5-shim.js',
    '/js/lib/d3/d3.js',
    '/js/lib/bootstrap-table/bootstrap-table.js',
    '/js/lib/bootstrap-table/extensions/export/bootstrap-table-export.min.js',
    '/js/lib/bootstrap-table/extensions/filter-control/bootstrap-table-filter-control.min.js',
    '/js/lib/bootstrap-table/bootstrap-table-locale-all.min.js',
    '/js/lib/bootstrap-colorpicker/img/bootstrap-colorpicker/hue.png',
    '/js/lib/bootstrap-colorpicker/img/bootstrap-colorpicker/alpha.png',
    '/js/lib/bootstrap-colorpicker/img/bootstrap-colorpicker/saturation.png',
    '/js/lib/leaflet-measure/images/check.png',
    '/js/lib/leaflet-measure/images/cancel.png',
    '/js/lib/leaflet-measure/images/start.png',
    '/js/lib/leaflet/images/layers.png',
    '/fonts/roboto-v18-latin-italic.ttf',
    '/icons/MaterialIcons-Regular.ttf',
    '/fonts/roboto-v18-latin-regular.ttf',
    '/fonts/roboto-v18-latin-500.ttf',
    '/fonts/roboto-v18-latin-italic.woff',
    '/icons/MaterialIcons-Regular.woff',
    '/fonts/roboto-v18-latin-regular.woff',
    '/fonts/roboto-v18-latin-500.woff',
    '/fonts/roboto-v18-latin-italic.woff2',
    '/icons/MaterialIcons-Regular.woff2',
    '/fonts/roboto-v18-latin-regular.woff2',
    '/fonts/roboto-v18-latin-500.woff2',
    '/js/lib/tableExport.jquery.plugin/tableExport.js',
    '/js/lib/typeahead.js/typeahead.jquery.js',
    '/js/lib/backbone/backbone.js',
    '/js/lib/raphael/raphael.min.js',
    '/js/lib/underscore/underscore.js',
    '/js/lib/jrespond/jRespond.js',
    '/js/lib/mustache.js/mustache.js',
    '/js/lib/jquery/jquery.js',
    '/js/lib/q-cluster/src/clustering.js',
    '/js/lib/Leaflet.GridLayer.GoogleMutant/Leaflet.GoogleMutant.js',
    '/js/lib/leaflet-plugins/Bing.js',
    '/js/lib/leaflet-plugins/Yandex.js',
    '/js/lib/Leaflet.utfgrid/leaflet.utfgrid.js',
    '/js/lib/Leaflet.extra-markers/leaflet.extra-markers.css',
    '/js/lib/Leaflet.extra-markers/leaflet.extra-markers.js',
    '/js/lib/leaflet-measure/leaflet-measure.min.js',
    '/js/lib/leaflet-draw/leaflet.draw.js',
    '/js/lib/es6-shim/es6-shim.js',
    '/js/lib/q-cluster/src/utils.js',
    '/js/lib/bootstrap-table/bootstrap-table-locale-all.js',
    '/js/lib/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
    '/js/lib/bootstrap-colorpicker/css/bootstrap-colorpicker.css',
    '/css/jasny-bootstrap.min.css',
    '/js/lib/bootstrap/dist/css/bootstrap.css',
    '/js/lib/bootstrap-select/bootstrap-select.css',
    '/js/lib/bootstrap-select/bootstrap-select.js',
    '/js/lib/bootstrap-material-datetimepicker/bootstrap-material-datetimepicker.js',
    '/js/lib/bootstrap-material-datetimepicker/bootstrap-material-datetimepicker.css',
    '/js/lib/bootstrap-material-design/dist/js/material.js',
    '/js/lib/bootstrap-material-design/dist/css/bootstrap-material-design.css',
    '/js/lib/bootstrap-material-design/dist/css/ripples.css',
    '/js/lib/bootstrap-material-design/dist/js/ripples.js',
    '/js/lib/hogan.js/hogan-3.0.2.js',
    '/js/lib/bootstrap-table/bootstrap-table.css',
    '/js/lib/bootstrap/dist/css/bootstrap.min.css',
    '/js/lib/q-cluster/css/q-cluster.css',
    '/js/lib/snackbarjs/snackbar.min.css',
    '/js/lib/leaflet-measure/leaflet-measure.css',
    '/js/lib/leaflet-measure-path/leaflet-measure-path.css',
    '/js/lib/Leaflet.awesome-markers/leaflet.awesome-markers.css',
    '/js/lib/leaflet-draw/leaflet.draw.css',
    '/js/lib/leaflet.locatecontrol/L.Control.Locate.css',
    '/js/lib/leaflet.locatecontrol/L.Control.Locate.js',
    '/js/lib/leaflet.toolbar/leaflet.toolbar.css',
    '/js/lib/leaflet.toolbar/leaflet.toolbar.js',
    '/js/lib/leaflet/leaflet.css',
    '/js/lib/leaflet-measure/leaflet-measure.js',
    '/js/lib/leaflet-measure-path/leaflet-measure-path.js',
    '/js/lib/leaflet.editable/Leaflet.Editable.js',
    '/js/lib/leaflet-draw/leaflet.draw-src.js',
    '/js/lib/Path.Drag.js/src/Path.Drag.js',
    '/js/lib/leaflet/leaflet-src.js',
    '/js/lib/leaflet-measure/images/rulers.png',
    '/js/lib/localforage/localforage.js',
    '/js/templates.js',
    '/js/vidi.js',
    '/locale',
    '/api/config/vidi.json',
    '/fonts/fonts.css',
    '/icons/material-icons.css',
    '/js/leaflet-easybutton/easy-button.css',
    '/css/styles.css',
    '/fonts/roboto-v18-latin-300.woff2',
    '/js/point-clusterer.js',
    '/js/leaflet-easybutton/easy-button.js',
    '/js/proj4js-combined.js',
    '/js/gc2/gc2table.js',
    '/js/gc2/geocloud.js',
    '/js/jasny-bootstrap.js',
    '/js/point-clusterer.js',
    '/js/bundle.js',
    '/css/styles.css',
    '/css/jasny-bootstrap.css',
];

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
    requested: 'https://maps.google.com/maps-api-v3/api/js/31/8b/common.js',
    local: '/js/google-maps/common.js'
}, {
    requested: 'https://maps.google.com/maps-api-v3/api/js/31/8b/util.js',
    local: '/js/google-maps/util.js'
}, {
    requested: 'https://maps.google.com/maps-api-v3/api/js/31/8b/controls.js',
    local: '/js/google-maps/controls.js'
}, {
    requested: 'https://maps.google.com/maps-api-v3/api/js/31/8b/places_impl.js',
    local: '/js/google-maps/places_impl.js'
}, {
    requested: 'https://maps.google.com/maps-api-v3/api/js/31/8b/stats.js',
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
        if (LOG) console.log(`URL was cleaned up: ${cleanedRequestURL} (${URL})`);
    }

    urlSubstitution.map(item => {
        if (item.regExp) {
            let re = new RegExp(item.requested);
            if (re.test(URL)) {
                if (LOG) console.log(`Requested the ${cleanedRequestURL} but fetching the ${item.local} (regular expression)`);
                cleanedRequestURL = item.local;
            }
        } else if (item.requested.indexOf(cleanedRequestURL) === 0 || cleanedRequestURL.indexOf(item.requested) === 0) {
            if (LOG) console.log(`Requested the ${cleanedRequestURL} but fetching the ${item.local} (normal string rule)`);
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
            clonedRequest.formData().then((formdata) => {
                let payload = '';
                for (var p of formdata) {
                    payload += p.toString();
                }

                cleanedRequestURL += '/' + btoa(payload);

                resolve(cleanedRequestURL);
            });
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
    if (LOG) console.log('Service worker is being installed, caching specified resources');

    extensionsIgnoredForCaching.map(item => {
        let localRegExp = new RegExp(`.${item}$`, 'i');
        ignoredExtensionsRegExps.push(localRegExp);
    });

    event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
        let urlsToCacheAliased = urlsToCache;        
        for (let i = 0; i < urlsToCacheAliased.length; i++) {
            urlsToCacheAliased[i] = normalizeTheURL(urlsToCacheAliased[i]);
        }

        cache.addAll(urlsToCacheAliased).then(() => {
            if (LOG) console.log('All resources have been fetched and cached.');
        }).catch(error => {
            console.log(error);
        });
    }).catch(error => {
        console.log(error);
    }));
    
});

/**
 * "activate" event handler
 */
self.addEventListener('activate', event => {
    if (LOG) console.log('Service worker is ready to handle fetches now');

    event.waitUntil(self.clients.claim());
});
 

/**
 * "message" event handler
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.force) {
        if (LOG) console.log('Forcing caching of files with ignored extensions');
        forceIgnoredExtensionsCaching = true;
    } else {
        if (LOG) console.log('Not forcing caching of files with ignored extensions');
        forceIgnoredExtensionsCaching = false;
    }
});


/**
 * "fetch" event handler
 */
self.addEventListener('fetch', (event) => {
    if (LOG) console.log(`Reacting to fetch event ${event.request.url}`, event.request);

    /**
     * Wrapper for API calls - the API responses should be as relevant as possible.
     * 
     * @param {*} event Fetch event
     * @param {*} cachedResponse Already cached response
     * 
     * @return {Promise}
     */
    const queryAPI = (cleanedRequestURL, event, cachedResponse) => {
        if (LOG) console.log('API call detected', cleanedRequestURL);
        if (cleanedRequestURL.indexOf('/api/feature') !== -1) {
            return fetch(event.request);
        
        //} else if (cleanedRequestURL.indexOf('/api/sql') !== -1) {

        } else {
            let result = new Promise((resolve, reject) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    return fetch(event.request).then(apiResponse => {
                        if (LOG) console.log('API request was performed despite the existence of cached request');
                        // Caching the API request in case if app will go offline aftewards
                        return cache.put(cleanedRequestURL, apiResponse.clone()).then(() => {
                            resolve(apiResponse);
                        }).catch(error => {
                            throw new Error('Unable to put the response in cache');
                            reject();
                        });
                    }).catch(error => {
                        if (LOG) console.log('API request failed, using the cached response');
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

    event.respondWith(normalizeTheURLForFetch(event).then(cleanedRequestURL => {
        return caches.match(cleanedRequestURL).then((response) => {
            if (response) {
                // The request was found in cache
                let apiCallDetectionRegExp = new RegExp(self.registration.scope + API_ROUTES_START);
                // API requests should not use the probably stalled cached copy if it is possible
                if (apiCallDetectionRegExp.test(cleanedRequestURL)) {
                    return queryAPI(cleanedRequestURL, event, response);
                } else {
                    if (LOG) console.log(`In cache ${event.request.url}`);
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
                    if (requestHasToBeCached) {
                        if (LOG) console.log(`Caching ${requestToMake.url}`);
                        return caches.open(CACHE_NAME).then((cache) => {
                            return fetch(requestToMake).then(response => {
                                return cache.put(requestToMake.url, response.clone()).then(() => {
                                    return response;
                                });
                            });
                        });
                    } else {
                        return fetch(requestToMake);
                    }
                }
            }
        });
    }));
});
