(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var CACHE_NAME = 'vidi-static-cache';
var LOG = false;

var urlsToCache = ['/app/alexshumilov/public/favicon.ico', '/app/index.html', 'https://gc2.io/apps/widgets/gc2table/js/gc2table.js'];

var urlSubstitution = [{
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
    requested: 'https://gc2.io/apps/widgets/gc2table/js/gc2table.js',
    local: '/js/gc2/gc2table.js'
}];

self.addEventListener('install', function (event) {
    if (LOG) console.log('Service worker was installed, caching specified resources');
    event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
        cache.addAll(urlsToCache).then(function () {
            if (LOG) console.log('All resources have been fetched and cached.');
        }).catch(function (error) {
            console.log(error);
        });
    }));
});

self.addEventListener('activate', function (event) {
    if (LOG) console.log('Service worker is ready to handle fetches now');
});

self.addEventListener('fetch', function (event) {
    if (LOG) console.log('Reacting to fetch event');
    var cleanedRequestURL = event.request.url;
    if (event.request.url.indexOf('_=') !== -1) {
        var cleanedRequestURL = event.request.url.split("?")[0];
        if (LOG) console.log('URL was cleaned up: ' + cleanedRequestURL + ' (' + event.request.url + ')');
    }

    urlSubstitution.map(function (item) {
        if (item.requested.indexOf(cleanedRequestURL) === 0 || cleanedRequestURL.indexOf(item.requested) === 0) {
            if (LOG) console.log('Requested the ' + cleanedRequestURL + ' but fetching the ' + item.local);
            cleanedRequestURL = item.local;
        }
    });

    event.respondWith(caches.match(cleanedRequestURL).then(function (response) {
        if (!response) {
            if (LOG) console.log('Not in cache ' + event.request.url);
            return caches.open(CACHE_NAME).then(function (cache) {
                var noCORSRequest = new Request(cleanedRequestURL);
                return fetch(noCORSRequest).then(function (response) {
                    return cache.put(cleanedRequestURL, response.clone()).then(function () {
                        return response;
                    });
                });
            });
        } else {
            if (LOG) console.log('In cache ' + event.request.url);
            return response;
        }
    }));
});

function fetchAndCache(request) {
    if (LOG) console.log('Before fetching', request);
    fetch(request).then(function (response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }

        return caches.open(CACHE_NAME).then(function (cache) {
            cache.put(request.url, response.clone());
            return response;
        });
    }).catch(function (error) {
        console.log('- Request failed:', error);
    });
}

},{}]},{},[1]);
