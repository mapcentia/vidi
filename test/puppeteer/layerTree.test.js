/**
 * Testing layerTree module
 */

const { expect } = require("chai");
const helpers = require("./../helpers");

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

    it('should keep layer and layer group order', async () => {
        const page = await browser.newPage();
        await page.goto(helpers.PAGE_URL);
        await page.emulate(helpers.EMULATED_SCREEN);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        await page.click(`#burger-btn`);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('#layer-slide').find('[data-toggle="collapse"]').eq(0).text()`)).to.equal(`Dar es Salaam Land Use and Informal Settlement Data Set`);
        expect(await page.evaluate(`$('#layer-slide').find('[data-toggle="collapse"]').eq(1).text()`)).to.equal(`Public group`);

        let e = await page.$('#layer-panel-VGVzdCBncm91cA');
        let box = await e.boundingBox();
        let x = box.x + box.width / 2;
        let y = box.y + box.height / 2;
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x, y - 60);
        await page.mouse.up();
        await page.mouse.click(1, 1);
        await helpers.sleep(1000);

        await page.reload(helpers.PAGE_LOAD_TIMEOUT);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);
        await page.click(`#burger-btn`);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('#layer-slide').find('[data-toggle="collapse"]').eq(0).text()`)).to.equal(`Public group`);
        expect(await page.evaluate(`$('#layer-slide').find('[data-toggle="collapse"]').eq(1).text()`)).to.equal(`Dar es Salaam Land Use and Informal Settlement Data Set`);
    });
});
