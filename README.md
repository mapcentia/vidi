# What is MapCentia Vidi
Vidi is a modern take on web GIS. It is the front-end for [GC2](https://github.com/mapcentia/geocloud2)

## What does Vidi?
Out-of-the-box Vidi is a web-GIS application with a lot of basic functionality. It is also a framework for building web-based applications. 

## What is the goal for Vidi?
The Vidi project aims to make it easy for organizations to use open source software for building geo-spatial applications.

## Key features of Vidi
- Ready to use front-end for GC2.
- Handles non-tiled, tiled and vector layers.
- Advanced query of data using geometry and buffers.
- Drawing tools. Add measurements, styles and labels.
- Scaled PDF print based on Mustache template.
- Vector layers can be filtered. An arbitrary number of filter expressions can be applied. 
- Table view of vector layers. See the attributes and link to the geometry on the map.
- Customize how the looks by adding your own Mustache templates.
- Vidi is a Progressive Web App (PWA).
    - Vidi starts without network. And always starts quick.
    - Vector layers are cached, so they can be used without network.
    - A change in source code will generated a new version hash, which will trigger the Service Workers to re-install the application.
    - Base layers can be partial caches in browser for use without network.
    - Editor. Both tile and vector layers can be edited. Edits can be done without network.
- Side-by-side base layers. Swipe between two base layers.
- Save, restore and share projects. A project comprises the extent of the map, which background map is visible and which layers are turned on, which filters are applied as well as your drawings. You can share a project by sharing a URL. If you are not logged in, projects will be linked to the browser you are using. Otherwise, they will be stored under your user login. It is possible to transfer projects from browser to login.  
- Kepler.gl module. Select layers in Vidi and start Kepler.gl with them. Kepler.gl is embedded in Vidi.
- Extension mechanism. Write your own modules 1)

1) Vidi is written in Node.js and uses Browserify for the front-end. I.e. that both front- and back-end extensions are written in javascript with CommonJS Modules, which means that you need a minimum of skill sets to expand and customize Vidi.

![Standard Vidi](https://i.imgur.com/K1wBfc1.jpg "Vidi looks good!")

## How to try Vidi
Head over to gc2.mapcentia.com, create a PostGIS database and start uploading data. Then start Vidi from the dashboard.

Or just try it [here](Head over to gc2.mapcentia.com, create a PostGIS database and start uploading data.)

## How to install Vidi

[Install instructions](https://github.com/mapcentia/vidi/wiki/Install-Vidi)

---

## Testing ![alt text](https://api.travis-ci.org/sashuk/vidi.svg?branch=develop "Current build status")

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