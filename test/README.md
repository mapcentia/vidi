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


## Cases to implement

Puppeteer:
- how service worker returns the cached response depending on offline mode settings
- toggle dynamic mode of requesting vector layers
- test Disable button in filters and validate input in filters
- test the overlap mode for base layers