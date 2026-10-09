## Builds

https://travis-ci.org/sashuk/vidi

## Running the tests

`npm test` runs three suites. They expect a local Vidi on `http://127.0.0.1:3000` (`node index.js`) backed by a GC2 that has the test database:

- `test/unit` – Mocha unit tests, no server needed.
- `test/api` – HTTP tests against Vidi's API. They log in as `mydb`/`hawk2000` and use the `mydb` database. The static PNG test filters `public.planer` on `gid`.
- `test/puppeteer` – smoke tests in headless Chromium against the current UI (`smoke.test.js`). They use a layer in the `public` schema (`public.punkt` by default). The single-tile screenshot test is skipped when no base layer has `type: "wms"` and `singleTile: true` in `config/config.js`.

Settings (environment variables):

- `VIDI_TEST_URL` – Vidi base URL, default `http://127.0.0.1:3000`.
- `VIDI_TEST_DATABASE` – database for the puppeteer tests, default `mydb`.
- `VIDI_TEST_LAYER` – layer key for the puppeteer tests, default `public.punkt`.

The old puppeteer suite is kept in `test/puppeteer-legacy` (`npm run test_legacy`). It was written for the 2019–2020 UI and the `aleksandrshumilov` database on `vidi.swarm.gc2.io`, and does not pass against the current UI.

## Testing

Right now there are no available tools for testing the offline mode with service workers (not supported by Puppeteer as well https://github.com/GoogleChrome/puppeteer/issues/2469), so some tests need to be implemented when it will become available.

Following options do not work:
- using `page.setOfflineMode(true)`
- using the DevTools protocol, the `Network.emulateNetworkConditions({ offline: true })`
- using the DevTools protocol, the `Network.requestServedFromCache()`
- intercepting responses and checking if they were served from cache

When offline application mode becomes available, following cases has to be processed:
- how layer offline mode controls react to changes in application availability
- how application loads assets in offline mode
- editor detecting the offline mode state

## Sample configurations

Some test cases require custom Vidi configuration files that are typically located in `/public/api/config`. Examples of these files can be found in `./config` folder.

## Testing environment

The regression is tested using the TravisCI (https://travis-ci.org/sashuk/vidi). Most of the tests are using a Puppeteer to request the Vidi installations and perform specific actions (testing of the entire application stack from Vidi frontend, then Vidi backend, the GC2 API / WMS / etc.). Regression tests expect following deployments (configurations for these deployments are located in the `./test/config/regression`, the list of URLs is located `./test/helpers.js`, the configuration for Nginx reverse proxy is in the `./test/config/regression/nginx_config/nginx.conf`):
- the regular Vidi installation with SSL enabled
- the regular Vidi installation with SSL disabled
- the embed module enabled Vidi installation
- the latest Vidi codebase installation

The `vidi.alexshumilov.ru` domain should be replaced with the domain of the new deployment everywhere. The Github hook for `develop` branch should be used to update and rebuild the regression deployments. The SSL for regression deployment should be enabled via Nginx (using Let's Encrypt, for example).