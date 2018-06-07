/**
 * Testing APIBridge and Queue classes
 */

const { expect } = require("chai");
const helpers = require("./helpers");

const PAGE_URL = `https://vidi.alexshumilov.ru/app/aleksandrshumilov/public/#osm/13/39.2963/-6.8335/`;

const PAGE_LOAD_TIMEOUT = 10000;
const EMULATED_SCREEN = {
    viewport: {
	width: 1920,
        height: 1080
    },
    userAgent: 'Puppeteer'
};

describe("Application", () => {
    it("should constantly check for connection status and keep Force offline mode selector updated", async () => {
        const page = await browser.newPage();
        await page.goto(PAGE_URL);
        await helpers.sleep(PAGE_LOAD_TIMEOUT);

        expect(await page.evaluate(`$('.js-app-is-online-badge').hasClass('hidden');`)).to.be.false;
        expect(await page.evaluate(`$('.js-app-is-offline-badge').hasClass('hidden');`)).to.be.true;

        let forceOfflineModeIndicator;
        forceOfflineModeIndicator = await page.evaluate(`$('.js-toggle-offline-mode').is(':checked')`);
        expect(forceOfflineModeIndicator).to.be.false;

        await page.evaluate(`$('.js-toggle-offline-mode').parent().find('.toggle').trigger('click')`);

        forceOfflineModeIndicator = await page.evaluate(`$('.js-toggle-offline-mode').is(':checked')`);
        expect(forceOfflineModeIndicator).to.be.true;

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

describe('Layer tree', () => {
    it('should load layers from page URL', async () => {
        const page = await browser.newPage();
        await page.goto(`${PAGE_URL}v:public.test,public.test_poly`);
        await helpers.sleep(PAGE_LOAD_TIMEOUT);

        await page.click(`#burger-btn`);
        await page.evaluate(`$('[href="#collapseVGVzdCBncm91cA"]').trigger('click')`);

        expect(await page.evaluate(`$('[data-gc2-id="public.test"]').is(':checked')`)).to.be.true;
        expect(await page.evaluate(`$('[data-gc2-id="public.test_line"]').is(':checked')`)).to.be.false;
        expect(await page.evaluate(`$('[data-gc2-id="public.test_poly"]').is(':checked')`)).to.be.true;
    });

    it('should load vector and tile layers', async () => {
        const page = await browser.newPage();
        await page.goto(PAGE_URL);
        await helpers.sleep(PAGE_LOAD_TIMEOUT);

        await page.click(`#burger-btn`);
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
        await page.goto(PAGE_URL);
        await helpers.sleep(PAGE_LOAD_TIMEOUT);

        await page.click(`#burger-btn`);
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
        await page.goto(PAGE_URL);
        await helpers.sleep(PAGE_LOAD_TIMEOUT);

        await page.click(`#burger-btn`);
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

describe('Editor', () => {
    describe('(if user is authorized)', () => {
        it('should add features', async () => {});
        it('should update features', async () => {});
        it('should delete features', async () => {});
    });

    describe('(if user is not authorized)', () => {
        it('should put add feature request to the queue', async () => {
            const page = await browser.newPage();
            await page.goto(`${PAGE_URL}v:public.test,public.test_poly`);
            await page.emulate(EMULATED_SCREEN);
            await helpers.sleep(PAGE_LOAD_TIMEOUT);

            // Selecting point on map and open the attribute editing dialog
            await page.click(`#burger-btn`);
            await page.evaluate(`$('[data-parent="#layers"]').last().trigger('click')`);
            await page.evaluate(`$('[data-gc2-key="public.test.the_geom"]').trigger('click')`);
            await page.click(`#map`);

            await helpers.sleep(1000);

            // Filling in attributes of the added feature
            await page.evaluate(`$('#root_id').val('111')`);
            await helpers.sleep(1000);
            await page.evaluate(`$('#editor-attr-dialog').find('[type="submit"]').trigger('click')`);

            await helpers.sleep(2000);

            // Checking if the queue indicator shows that element was added to the queue
            expect(await page.evaluate(`$('[class="btn btn-sm btn-secondary js-statistics-field js-rejectedByServer-add"]').is(':visible')`)).to.be.true;
        });

	/*
	// @todo First resolve the https://github.com/sashuk/vidi/issues/33
        it('should put update feature request to the queue', async () => {
	    const page = await browser.newPage();
            await page.goto(`${PAGE_URL}v:public.test`);
            await page.emulate(EMULATED_SCREEN);
            await helpers.sleep(PAGE_LOAD_TIMEOUT);

            // Selecting first already existing point on map and trying to edit it
            const markerPosition = await page.evaluate(`$('.leaflet-interactive').first().position()`);
            let mouse = page.mouse;
            await mouse.click(markerPosition.left + 10, markerPosition.top + 10);
            await helpers.sleep(500);
            await mouse.click(markerPosition.left + 10 - 24, markerPosition.top + 10 - 48);

            // Editing attributes of the selected feature
            await helpers.sleep(2000);
            await page.evaluate(`$('#root_id').val('111')`);
            await helpers.sleep(500);
            await page.evaluate(`$('#editor-attr-dialog').find('[type="submit"]').trigger('click')`);
            await helpers.sleep(500);
            await page.evaluate(`$('#root_id').val('112')`);
	    await page.evaluate(`$('#editor-attr-dialog').find('[type="submit"]').trigger('click')`);
            await helpers.sleep(500);

            // Checking if the queue indicator shows that element was added to the queue
            await page.click(`#burger-btn`);
            await page.evaluate(`$('[data-parent="#layers"]').last().trigger('click')`);

            await helpers.sleep(2000);

            //expect(await page.evaluate(`$('[class="btn btn-sm btn-secondary js-statistics-field js-rejectedByServer-update"]').is(':visible')`)).to.be.true;

            await page.screenshot({ path: 'test.png' });
        });
        */

        it('should put delete feature request to the queue', async () => {
	    const page = await browser.newPage();
            await page.goto(`${PAGE_URL}v:public.test`);
            await page.emulate(EMULATED_SCREEN);
            await helpers.sleep(PAGE_LOAD_TIMEOUT);

            // Accepting the dialog
            page.on("dialog", (dialog) => {
                dialog.accept();
            });

            await page.click(`#burger-btn`);
            await page.evaluate(`$('[data-parent="#layers"]').last().trigger('click')`);
            await helpers.sleep(1000);
            await page.evaluate(`$('.js-clear').trigger('click')`);
            await helpers.sleep(2000);

            // Selecting first already existing point on map and deleting it
            const markerPosition = await page.evaluate(`$('.leaflet-interactive').first().position()`);
            let mouse = page.mouse;

            await mouse.click(markerPosition.left + 10, markerPosition.top + 10);
            await helpers.sleep(500);
            await mouse.click(markerPosition.left + 10 + 24, markerPosition.top + 10 - 48);

            // Checking if the queue indicator shows that element was added to the queue
            await helpers.sleep(2000);

            expect(await page.evaluate(`$('[class="btn btn-sm btn-secondary js-statistics-field js-rejectedByServer-delete"]').is(':visible')`)).to.be.true;
        });
    });

    describe('should transform feature requests responses when offline', () => {});
    describe('should react to Force offline mode setting', () => {});
    describe('should dispatch feature requests in correct order', () => {});
});
