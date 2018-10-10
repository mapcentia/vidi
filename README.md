# vidi
Vidi (View) is a new map viewer for GC2.

[Install instructions](https://github.com/mapcentia/vidi/wiki/Install-Vidi)

---

# Testing ![alt text](https://api.travis-ci.org/sashuk/vidi.svg?branch=develop "Current build status")

The `test` folder contains

- unit tests (`tests/unit`)
- puppeteer tests (`tests/puppeteer`, [https://github.com/GoogleChrome/puppeteer](https://github.com/GoogleChrome/puppeteer))
- API tests (`tests/api`)

In order to carry out the front-end testing the staging server was deployed at (`tests/helpers.js@8`). Whenever code changes are pushed to the Github, the `push` hook calls the `POST http://vidi.alexshumilov.ru:8082/deploy` URL and the application is built (`git pull && grunt`). So, when puppeteer tests are launched, the staging server is already updated.

## Ignoring certain URLs in Service Worker

The Vidi service worker now accepts the URL regexp that will allow certain URLs to be ignored. Please consider the demo script that first tells service worker to ignore all URLs that have `jsonplaceholder.typicode` in it and then it actually requests the https://jsonplaceholder.typicode.com/todos/1 URL - the request is performed without service worker.

```javascript
/**
 * Talking to the service worker in test purposes
 */
setTimeout(() => {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            action: `addUrlIgnoredForCaching`,
            payload: `jsonplaceholder.typicode`
        });

        setTimeout(() => {
            fetch('https://jsonplaceholder.typicode.com/todos/1').then(() => {}).then(() => {});
        }, 3000);
    } else {
        throw new Error(`Unable to invoke the service worker controller`);
    }
}, 3000);
```