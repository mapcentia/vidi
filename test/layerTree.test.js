/**
 * Testing layerTree module
 */

const { expect } = require("chai");
const helpers = require("./helpers");

describe('Layer tree', () => {
    it('should load layers from page URL', async () => {
        const page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL}v:public.test,public.test_poly`);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        await page.click(`#burger-btn`);
        await page.evaluate(`$('[href="#collapseVGVzdCBncm91cA"]').trigger('click')`);

        expect(await page.evaluate(`$('[data-gc2-id="public.test"]').is(':checked')`)).to.be.true;
        expect(await page.evaluate(`$('[data-gc2-id="public.test_line"]').is(':checked')`)).to.be.false;
        expect(await page.evaluate(`$('[data-gc2-id="public.test_poly"]').is(':checked')`)).to.be.true;
    });

    it('should load vector and tile layers', async () => {
        const page = await browser.newPage();
        await page.goto(helpers.PAGE_URL);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

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
        await page.goto(helpers.PAGE_URL);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        await page.click(`#burger-btn`);
        await page._client.send('Network.enable');

        let apiWasRequested = false;
        await page._client.on('Network.requestWillBeSent', event => {
            if (event.request.url.indexOf(`/api/legend/aleksandrshumilov?l=v:public.test_line&db=aleksandrshumilov`) !== -1) {
                apiWasRequested = true;
            }
        });

        await page.evaluate(`$('[data-gc2-layer-key="public.test_line.the_geom"]').find('.js-show-layer-control').trigger('click')`);
        expect(apiWasRequested).to.be.true;
    });

    it('should load tile layers', async () => {
        const page = await browser.newPage();
        await page.goto(helpers.PAGE_URL);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

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
