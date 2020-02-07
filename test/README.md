## Builds

https://travis-ci.org/sashuk/vidi

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