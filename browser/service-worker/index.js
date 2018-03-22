var CACHE_NAME = 'static-cache';
var urlsToCache = [
    '/app/alexshumilov/public/favicon.ico',
    '/app/index.html',
    'https://gc2.io/apps/widgets/gc2table/js/gc2table.js',
];

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
}];

self.addEventListener('install', function(event) {
    console.log('Service worker was installed, caching specified resources');
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
        cache.addAll(urlsToCache).then(() => {
           console.log('All resources have been fetched and cached.');
        }).catch(error => {
            console.log(error);
        });
    }));
});

self.addEventListener('activate', event => {
    console.log('Service worker now ready to handle fetches');
});
 
self.addEventListener('fetch', function(event) {
    //console.log('Reacting to fetch event', event);
    var cleanedRequestURL = event.request.url;
    if (event.request.url.indexOf('_=') !== -1) {
        var cleanedRequestURL = event.request.url.split("?")[0];
        console.log(`URL was cleaned up: ${cleanedRequestURL} (${event.request.url})`);
    }

    urlSubstitution.map(item => {
        if (item.requested.indexOf(cleanedRequestURL) === 0) {
            console.log(`Requested the ${cleanedRequestURL} but fetching the ${item.local}`);
            cleanedRequestURL = item.local;
        }
    });

    event.respondWith(caches.match(cleanedRequestURL).then(function(response) {
        if (!response) {
            console.log(`Not in cache ${event.request.url}`);
            return caches.open(CACHE_NAME).then(function(cache) {
                const noCORSRequest = new Request(cleanedRequestURL, { mode: 'no-cors' });
                return fetch(noCORSRequest).then(response => {
                    return cache.put(cleanedRequestURL, response.clone()).then(() => {
                        return response;
                    });
                });
            });
        } else {
            console.log(`In cache ${event.request.url}`);
            return response;
        }
    }));
});
  
function fetchAndCache(request) {
    console.log(`Before fetching`, request);
    fetch(request).then(function(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      
      return caches.open(CACHE_NAME).then(function(cache) {
        cache.put(request.url, response.clone());
        return response;
      });
    }).catch((error) => {
      console.log('- Request failed:', error);
    });
}
