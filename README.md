# What is Vidi?
Vidi is a modern take on web GIS. It is the front-end for [GC2](https://github.com/mapcentia/geocloud2)

Vidi is part of the [OSGeo Community Project GC2/Vidi](https://www.osgeo.org/projects/gc2-vidi/)

<img title="GC2 is a OSGeo Community Project" src="https://github.com/OSGeo/osgeo/blob/master/incubation/community/OSGeo_community.png" alt="drawing" width="200"/>

## What does Vidi?
Out-of-the-box Vidi is a web-GIS application with a lot of basic functionality. It is also a framework for building web-based applications. 

## What is the goal for Vidi?
The Vidi project aims to make it easy for organizations to use open source software for building geo-spatial applications.

## Vidi enables you to 
- Display GC2 layers as either non-tiled, tiled or vector.
- Query data using geometry and buffers.
- Add drawings with measurements, styles and labels.
- Print scaled PDF maps based on Mustache templates.
- Filter vector layers. An arbitrary number of filter expressions can be applied. 
- View table of vector layers. See the attributes and link to the geometry on the map.
- Customize the looks by adding your own Mustache templates.
- Use side-by-side swipe base layers. Swipe between two base layers.
- Save, restore and share projects. A project comprises the extent of the map, which background map is visible and which layers are turned on, which filters are applied as well as your drawings.  
- Select layers in Vidi and start Kepler.gl with them. Kepler.gl is embedded in Vidi.
- Write your own modules with an extension mechanism. 1)
- Use Vidi as a Progressive Web App (PWA).
    - Start Vidi without network.
    - Caches vector layers in browser, so they can be used without network.
    - Partial caches tiled baselayers in browser for use without network.
    - Edits data without network. Transactions are queue and submitted when online again.

1) Vidi is written in Node.js and uses Browserify for the front-end. I.e. that both front- and back-end extensions are written in javascript with CommonJS Modules, which means that you need a minimum of skill sets to expand and customize Vidi.

![Standard Vidi](https://i.imgur.com/QbmByqV.png "Vidi looks good!")

## How to try Vidi
Head over to gc2.mapcentia.com, create a PostGIS database and start uploading data. Then start Vidi from the dashboard.

Or just try it [here](https://map.gc2.io/app/demo_c/public)

## How to install Vidi
Install both [GC2 and Vidi](https://github.com/mapcentia/geocloud2#how-to-install-gc2-and-vidi)

---

## Testing ![alt text](https://api.travis-ci.org/sashuk/vidi.svg?branch=develop "Current build status")

The `test` folder contains

- unit tests (`tests/unit`)
- puppeteer tests (`tests/puppeteer`, [https://github.com/GoogleChrome/puppeteer](https://github.com/GoogleChrome/puppeteer))
- API tests (`tests/api`)

In order to carry out the front-end testing the staging server was deployed at (`tests/helpers.js@8`). Whenever code changes are pushed to the Github, the `push` hook calls the `POST http://vidi.alexshumilov.ru:8082/deploy` URL and the application is built (`git pull && grunt`). So, when puppeteer tests are launched, the staging server is already updated.

## Documentation

The documentation in the `docs` folder is built using [https://www.sphinx-doc.org/en/master/](sphinx)). The documentation is regularly built and accessible on https://vidi.readthedocs.io/

Getting started with the documentation is easy - all you need is python:
* Start by installing the required packages with `pip install -r .\docs\requirements.txt`
* Then run the autobuild using a command like: `sphinx-autobuild docs docs/_build/html`
