/**
 * Testing APIBridge and Queue classes
 */

const { expect } = require("chai");

const PAGE_URL = `https://vidi.alexshumilov.ru/app/aleksandrshumilov/public/#osm/13/39.2963/-6.8335/`;

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

describe("API Bridge and Queue", () => {
    describe("(general tests)", () => {
        it("should constantly check for connection status and keep Force offline mode selector updated", async () => {
            const page = await browser.newPage();
            await page.goto(PAGE_URL, { waitUntil: 'networkidle2' });
            await page.evaluate('navigator.serviceWorker.ready');
            await page.click(`[href="#layer-content"]`);

            const onlineBadgeClassAttribute = await page.$eval('.js-app-is-online-badge', e => e.getAttribute('class'));
            const offlineBadgeClassAttribute = await page.$eval('.js-app-is-offline-badge', e => e.getAttribute('class'));
            expect(onlineBadgeClassAttribute.indexOf('hidden') === -1).to.be.true;
            expect(offlineBadgeClassAttribute.indexOf('hidden') !== -1).to.be.true;

            let forceOfflineModeIndicator;
            forceOfflineModeIndicator = await page.evaluate(`$('.js-toggle-offline-mode').is(':checked')`);
            expect(forceOfflineModeIndicator).to.be.true;

            await page.evaluate(`$('.js-toggle-offline-mode').parent().find('.toggle').trigger('click')`);

            forceOfflineModeIndicator = await page.evaluate(`$('.js-toggle-offline-mode').is(':checked')`);
            expect(forceOfflineModeIndicator).to.be.false;

            /*
            // @todo Enable logging in separate function
            page.on("console", msg => {
                console.log("PAGE LOG:", msg.text());
                if (['log', 'info', 'debug'].indexOf(msg.type()) === -1) {
                    console.log("ARGS:", msg.args());
                }
            });

            await page.screenshot({ path: 'test.png' });
            */

            // @todo Check the indicator change when app goes offline
            /*
            await page._client.send('Network.enable');
            await page._client.on('Network.requestWillBeSent', event => {
                console.log('Network.requestWillBeSent', event.requestId, event.request.url);
            });
            await page._client.on('Network.loadingFinished', event => {
                console.log('Network.loadingFinished', event.requestId);
            });

            await page._client.send('Network.emulateNetworkConditions', {
                offline: true,
                latency: 100,
                downloadThroughput: 0,
                uploadThroughput: 0
            });

            await page.evaluate(`$.getJSON('https://jsonplaceholder.typicode.com/posts/1', function() {
                console.log("success");
            }).done(function() {
                console.log("second success" );
            }).fail(function() {
                console.log("error");
            }).always(function() {
                console.log("complete");
            });`);

            await timeout(10000);
            */
        });
    });

    describe('(layer tree)', () => {
        it('should load layers from page URL', async () => {
            const page = await browser.newPage();
            await page.goto(`${PAGE_URL}v:public.test,public.test_poly`, { waitUntil: 'networkidle2' });
            await page.click(`[href="#layer-content"]`);

            await page.evaluate(`$('[href="#collapseVGVzdCBncm91cA"]').trigger('click')`);

            await timeout(4000);
            await page.screenshot({ path: 'test.png' });

            expect(await page.evaluate(`$('[data-gc2-id="public.test"]').is(':checked')`)).to.be.true;
            expect(await page.evaluate(`$('[data-gc2-id="public.test_line"]').is(':checked')`)).to.be.false;
            expect(await page.evaluate(`$('[data-gc2-id="public.test_poly"]').is(':checked')`)).to.be.true;
        });

        it('should load vector and tile layers', async () => {
            const page = await browser.newPage();
            await page.goto(PAGE_URL, { waitUntil: 'networkidle2' });
            await page.click(`[href="#layer-content"]`);
            await page._client.send('Network.enable');

            let apiWasRequested = false;
            await page._client.on('Network.requestWillBeSent', event => {
                if (event.request.url.indexOf(`/api/legend/aleksandrshumilov?l=v:public.test&db=aleksandrshumilov`) !== -1) {
                    apiWasRequested = true;
                }
            });
            await page.evaluate(`$('[data-gc2-layer-key="public.test.the_geom"]').find('.js-layer-type-selector-vector').trigger('click')`);
            expect(apiWasRequested).to.be.true;

            let tilesWereRequested = false;
            await page._client.on('Network.requestWillBeSent', event => {
                if (event.request.url.indexOf(`mapcache/aleksandrshumilov/tms/1.0.0/public.test`) !== -1) {
                    tilesWereRequested = true;
                }
            });
            await page.evaluate(`$('[data-gc2-layer-key="public.test.the_geom"]').find('.js-layer-type-selector-tile').trigger('click')`);
            expect(tilesWereRequested).to.be.true;
        });

        it('should load vector layers', async () => {
            const page = await browser.newPage();
            await page.goto(PAGE_URL, { waitUntil: 'networkidle2' });
            await page.click(`[href="#layer-content"]`);
            await page._client.send('Network.enable');

            let apiWasRequested = false;
            await page._client.on('Network.requestWillBeSent', event => {
                if (event.request.url.indexOf(`/api/legend/aleksandrshumilov?l=v:public.test_line&db=aleksandrshumilov`) !== -1) {
                    apiWasRequested = true;
                }
            });
            await page.evaluate(`$('[data-gc2-layer-key="public.test_line.the_geom"]').find('.js-layer-type-selector-vector').trigger('click')`);
            expect(apiWasRequested).to.be.true;
        });

        it('should load tile layers', async () => {
            const page = await browser.newPage();
            await page.goto(PAGE_URL, { waitUntil: 'networkidle2' });
            await page.click(`[href="#layer-content"]`);
            await page._client.send('Network.enable');

            let tilesWereRequested = false;
            await page._client.on('Network.requestWillBeSent', event => {
                if (event.request.url.indexOf(`mapcache/aleksandrshumilov/tms/1.0.0/public.test_poly`) !== -1) {
                    tilesWereRequested = true;
                }
            });
            await page.evaluate(`$('[data-gc2-layer-key="public.test_poly.the_geom"]').find('.check').trigger('click')`);
            expect(tilesWereRequested).to.be.true;
        });
    });

    describe('(online mode)', () => {
        it('should add features', async () => {});
        it('should update features', async () => {});
        it('should delete features', async () => {});
    });

    describe('should store unsuccessfull requests in internal queue', () => {});
    describe('should transform feature requests responses when offline', () => {});
    describe('should react to Force offline mode setting', () => {});
    describe('should dispatch feature requests in correct order', () => {});
    describe('should cleanup requests depending on their order', () => {});
});
