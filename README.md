# vidi
Vidi (View) is a new map viewer for GC2 and CartoDB.

[Install instructions](https://github.com/mapcentia/vidi/wiki/Install-Vidi)

---

# Testing ![alt text](https://api.travis-ci.org/sashuk/vidi.svg?branch=develop "Current build status")

The `test` folder contains

- unit tests (`tests/unit`)
- puppeteer tests (`tests/puppeteer`, [https://github.com/GoogleChrome/puppeteer](https://github.com/GoogleChrome/puppeteer))
- API tests (`tests/api`)

In order to carry out the front-end testing the staging server was deployed at (`tests/helpers.js@8`). Whenever code changes are pushed to the Github, the `push` hook calls the `POST http://vidi.alexshumilov.ru:8082/deploy` URL and the application is built (`git pull && grunt`). So, when puppeteer tests are launched, the staging server is already updated.