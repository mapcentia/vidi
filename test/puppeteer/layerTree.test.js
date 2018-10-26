/**
 * Testing layerTree module
 */

const { expect } = require("chai");
const helpers = require("./../helpers");

describe('Layer tree', () => {
    it("should react when application goes online or offline", async () => {
        // @todo Not supported by Puppeteer right now https://github.com/GoogleChrome/puppeteer/issues/2469
    });

    it("should keep offline mode settings for layers after page reload", async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL_DEFAULT + `v:public.test`);
        page = await helpers.waitForPageToLoad(page);

        await page.evaluate(`$('[href="#layer-content"]').trigger('click')`);
        await page.evaluate(`$('[href="#collapseUHVibGljIGdyb3Vw"]').trigger('click')`);
        await helpers.sleep(2000);

        await page.screenshot({ path: './test.png' });
        console.log(`### First error occurence`);

        expect(await page.evaluate(`$('#layers').find('.js-app-is-online-badge').hasClass('hidden');`)).to.be.false;
        expect(await page.evaluate(`$('#layers').find('.js-app-is-offline-badge').hasClass('hidden');`)).to.be.true;
        expect(await page.evaluate(`$('[data-gc2-layer-key="public.test_point_no_type.the_geom"]').find('.js-set-online').prop('disabled')`)).to.be.true;
        expect(await page.evaluate(`$('[data-gc2-layer-key="public.test_point_no_type.the_geom"]').find('.js-set-offline').prop('disabled')`)).to.be.false;
        expect(await page.evaluate(`$('[data-gc2-layer-key="public.test_line.the_geom"]').find('.js-set-online').prop('disabled')`)).to.be.true;
        expect(await page.evaluate(`$('[data-gc2-layer-key="public.test_line.the_geom"]').find('.js-set-offline').prop('disabled')`)).to.be.true;
        expect(await page.evaluate(`$('[data-gc2-layer-key="public.test.the_geom"]').find('.js-set-online').prop('disabled')`)).to.be.true;
        expect(await page.evaluate(`$('[data-gc2-layer-key="public.test.the_geom"]').find('.js-set-offline').prop('disabled')`)).to.be.false;
        await helpers.sleep(1000);

        await page.evaluate(`$('[data-gc2-layer-key="public.test_point_no_type.the_geom"]').find('.js-set-offline').trigger('click')`);
        await page.evaluate(`$('[data-gc2-layer-key="public.test.the_geom"]').find('.js-set-offline').trigger('click')`);
        await helpers.sleep(2000);

        // Reload page
        await page.reload(helpers.PAGE_LOAD_TIMEOUT);
        page = await helpers.waitForPageToLoad(page);
        
        await page.evaluate(`$('[href="#layer-content"]').trigger('click')`);
        await page.evaluate(`$('[href="#collapseUHVibGljIGdyb3Vw"]').trigger('click')`);
        await helpers.sleep(2000);

        expect(await page.evaluate(`$('#layers').find('.js-app-is-online-badge').hasClass('hidden');`)).to.be.false;
        expect(await page.evaluate(`$('#layers').find('.js-app-is-offline-badge').hasClass('hidden');`)).to.be.true;
        expect(await page.evaluate(`$('[data-gc2-layer-key="public.test_point_no_type.the_geom"]').find('.js-set-online').prop('disabled')`)).to.be.false;
        expect(await page.evaluate(`$('[data-gc2-layer-key="public.test_point_no_type.the_geom"]').find('.js-set-offline').prop('disabled')`)).to.be.true;
        expect(await page.evaluate(`$('[data-gc2-layer-key="public.test_line.the_geom"]').find('.js-set-online').prop('disabled')`)).to.be.true;
        expect(await page.evaluate(`$('[data-gc2-layer-key="public.test_line.the_geom"]').find('.js-set-offline').prop('disabled')`)).to.be.true;
        expect(await page.evaluate(`$('[data-gc2-layer-key="public.test.the_geom"]').find('.js-set-online').prop('disabled')`)).to.be.false;
        expect(await page.evaluate(`$('[data-gc2-layer-key="public.test.the_geom"]').find('.js-set-offline').prop('disabled')`)).to.be.true;
    });




    /*
    should be able to request service worker about cached layers (preloaded layer from URL and manually loaded vector layer)
    refreshes cache for vector layers in offline mode
    pulls vector layer data from cache if the offline mode is enabled
    remember choices made by user and accounts them upon application availability change
    test all the editing cases in editor.test.js
    test the snapshot iteraction in stateSnapshot.test.js
    */

    it('should load layers from page URL from same schema', async () => {
        let page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL}v:public.test,public.test_poly`);
        page = await helpers.waitForPageToLoad(page);

        await page.click(`#burger-btn`);
        await helpers.sleep(1000);
        await page.evaluate(`$('[href="#collapseUHVibGljIGdyb3Vw"]').trigger('click')`);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('input[data-gc2-id="public.test"]').length`)).to.equal(1);
        expect(await page.evaluate(`$('input[data-gc2-id="public.test"]').is(':checked')`)).to.be.true;
        expect(await page.evaluate(`$('input[data-gc2-id="public.test_line"]').length`)).to.equal(1);
        expect(await page.evaluate(`$('input[data-gc2-id="public.test_line"]').is(':checked')`)).to.be.false;
        expect(await page.evaluate(`$('input[data-gc2-id="public.test_poly"]').length`)).to.equal(1);
        expect(await page.evaluate(`$('input[data-gc2-id="public.test_poly"]').is(':checked')`)).to.be.true;

        await page.close();
    });

    it('should load layers from page URL from different schemas', async () => {
        let page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL}test.polygon,public.urbanspatial_dar_es_salaam_luse_2002,public.test_poly,v:public.test,v:public.test_line`);
        page = await helpers.waitForPageToLoad(page);

        await page.click(`#burger-btn`);
        await helpers.sleep(1000);
        await page.evaluate(`$('[href="#collapseUHVibGljIGdyb3Vw"]').trigger('click')`);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('input[data-gc2-id="test.polygon"]').length`)).to.equal(1);
        expect(await page.evaluate(`$('input[data-gc2-id="test.polygon"]').is(':checked')`)).to.be.true;
        expect(await page.evaluate(`$('input[data-gc2-id="public.test"]').length`)).to.equal(1);
        expect(await page.evaluate(`$('input[data-gc2-id="public.test"]').is(':checked')`)).to.be.true;
        expect(await page.evaluate(`$('input[data-gc2-id="public.test_line"]').length`)).to.equal(1);
        expect(await page.evaluate(`$('input[data-gc2-id="public.test_line"]').is(':checked')`)).to.be.true;
        expect(await page.evaluate(`$('input[data-gc2-id="public.test_point_no_type"]').length`)).to.equal(1);
        expect(await page.evaluate(`$('input[data-gc2-id="public.test_point_no_type"]').is(':checked')`)).to.be.false;
        expect(await page.evaluate(`$('input[data-gc2-id="public.urbanspatial_dar_es_salaam_luse_2002"]').length`)).to.equal(1);
        expect(await page.evaluate(`$('input[data-gc2-id="public.urbanspatial_dar_es_salaam_luse_2002"]').is(':checked')`)).to.be.true;
        expect(await page.evaluate(`$('input[data-gc2-id="public.test_poly"]').length`)).to.equal(1);
        expect(await page.evaluate(`$('input[data-gc2-id="public.test_poly"]').is(':checked')`)).to.be.true;

        // Check if the panel for different schema was drawn as well
        expect(await page.evaluate(`$('#layers_list').find('.accordion-toggle').eq(0).text()`)).to.equal(`Test group`);
        expect(await page.evaluate(`$('#layers_list').find('.accordion-toggle').eq(1).text()`)).to.equal(`Dar es Salaam Land Use and Informal Settlement Data Set`);
        expect(await page.evaluate(`$('#layers_list').find('.accordion-toggle').eq(2).text()`)).to.equal(`Public group`);

        await page.close();
    });

    it('should load vector and tile layers', async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL);
        page = await helpers.waitForPageToLoad(page);

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

        await page.close();
    });

    it('should load vector layers', async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL);
        page = await helpers.waitForPageToLoad(page);

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

        await page.close();
    });

    it('should load tile layers', async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL);
        page = await helpers.waitForPageToLoad(page);

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

        await page.close();
    });

    it('should keep layer and layer group order', async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);
        await page.click(`#burger-btn`);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('#layer-slide').find('[data-toggle="collapse"]').eq(0).text()`)).to.equal(`Dar es Salaam Land Use and Informal Settlement Data Set`);
        expect(await page.evaluate(`$('#layer-slide').find('[data-toggle="collapse"]').eq(1).text()`)).to.equal(`Public group`);

        let e = await page.$('#layer-panel-UHVibGljIGdyb3Vw');
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

        await page.close();
    });
});
