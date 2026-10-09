/**
 * Testing layerTree module
 */

const { expect } = require("chai");
const helpers = require("./../../helpers");

describe(`Layer tree layer types`, () => {
    it(`should work with raster tile layers`, async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL_LATEST_GC2 + `public.testlayertypes`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        // Open layer tree
        await page.click(`[data-module-id="layerTree"]`);
        await helpers.sleep(1000);
        expect(await page.evaluate(`$('#layer-panel-RG8gbm90IGFsdGVy').length`)).to.equal(1);
        await page.click(`#layer-panel-RG8gbm90IGFsdGVy`);
        await helpers.sleep(2000);
        expect(await page.evaluate(`$('.leaflet-image-layer').length`)).to.equal(3);
        expect(await page.evaluate(`$('[data-gc2-layer-key^="public.testlayertypes"]').length`)).to.equal(1);
        await page.evaluate(`$('.js-show-layer-control[type="checkbox"]').trigger('click');`);
        await helpers.sleep(1000);
        expect(await page.evaluate(`$('.leaflet-image-layer').length`)).to.equal(0);
    });

    it(`should work with vector layers`, async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL_LATEST_GC2 + `v:public.testlayertypes`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        // Open layer tree
        await page.click(`[data-module-id="layerTree"]`);
        await helpers.sleep(1000);
        expect(await page.evaluate(`$('#layer-panel-RG8gbm90IGFsdGVy').length`)).to.equal(1);
        await page.click(`#layer-panel-RG8gbm90IGFsdGVy`);
        await helpers.sleep(2000);
        expect(await page.evaluate(`$('.leaflet-interactive').length`)).to.equal(3);
        expect(await page.evaluate(`$('[data-gc2-layer-key^="public.testlayertypes"]').length`)).to.equal(1);
        await page.evaluate(`$('.js-show-layer-control[type="checkbox"]').trigger('click');`);
        await helpers.sleep(1000);
        expect(await page.evaluate(`$('.leaflet-interactive').length`)).to.equal(0);
    });

    it(`should work with vector tile layers`, async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL_LATEST_GC2 + `mvt:public.testlayertypes`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        // Open layer tree
        await page.click(`[data-module-id="layerTree"]`);
        await helpers.sleep(1000);
        expect(await page.evaluate(`$('#layer-panel-RG8gbm90IGFsdGVy').length`)).to.equal(1);
        await page.click(`#layer-panel-RG8gbm90IGFsdGVy`);
        await helpers.sleep(2000);
        expect(await page.evaluate(`$('svg[pointer-events="none"]').length`)).to.equal(40);
        expect(await page.evaluate(`$('[data-gc2-layer-key^="public.testlayertypes"]').length`)).to.equal(1);
        await page.evaluate(`$('.js-show-layer-control[type="checkbox"]').trigger('click');`);
        await helpers.sleep(1000);
        expect(await page.evaluate(`$('svg[pointer-events="none"]').length`)).to.equal(0);
    });

    it(`should work with WebGL layers`, async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL_LATEST_GC2 + `w:public.testlayertypes`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        // Open layer tree
        await page.click(`[data-module-id="layerTree"]`);
        await helpers.sleep(1000);
        expect(await page.evaluate(`$('#layer-panel-RG8gbm90IGFsdGVy').length`)).to.equal(1);
        await page.click(`#layer-panel-RG8gbm90IGFsdGVy`);
        await helpers.sleep(2000);
        expect(await page.evaluate(`$('canvas[class="leaflet-zoom-animated"]').length`)).to.equal(1);
        expect(await page.evaluate(`$('[data-gc2-layer-key^="public.testlayertypes"]').length`)).to.equal(1);
        await page.evaluate(`$('.js-show-layer-control[type="checkbox"]').trigger('click');`);
        await helpers.sleep(1000);
        expect(await page.evaluate(`$('canvas[class="leaflet-zoom-animated"]').length`)).to.equal(0);
    });
});
