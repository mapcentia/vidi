/**
 * Testing layerTree module
 */

const { expect } = require("chai");
const helpers = require("./../../helpers");

describe(`Layer tree virtual layers`, () => {
    it(`should create virtual layer from infoClick result`, async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL_DEFAULT + `test.polygon`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        await page.click(`[data-module-id="infoClick"]`);
        await helpers.sleep(1000);

        await page.click(`#map`);
        await helpers.sleep(2000);

        // Create virtual layer and check URL and layer tree
        expect(page.url().indexOf(`v:virtual_layer.query`) > -1).to.be.false;
        expect(await page.evaluate(`$('.leaflet-interactive').length`)).to.equal(1);

        await page.click(`#_create_layer_0`);
        await helpers.sleep(4000);
        expect(await page.evaluate(`$('.leaflet-interactive').length`)).to.equal(2);

        expect(page.url().indexOf(`v:virtual_layer.query`) > -1).to.be.true;
        await page.click(`[data-module-id="layerTree"]`);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('#layer-panel-VmlydHVhbCBsYXllcnM').length`)).to.equal(1);
        await page.click(`#layer-panel-VmlydHVhbCBsYXllcnM`);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('#layer-panel-VmlydHVhbCBsYXllcnM').length`)).to.equal(1);
        expect(await page.evaluate(`$('[data-gc2-layer-key^="virtual_layer.query"]').length`)).to.equal(1);
        expect(await page.evaluate(`$('.leaflet-interactive').length`)).to.equal(1);
    });

    it(`should store virtual layer in state snapshot and restore it`, async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL_DEFAULT.replace(`13/39.2963/-6.8335`, `17/39.2802/-6.837`) + `public.test_poly`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        // Accepting dialogs
        page.on('dialog', (dialog) => { dialog.accept(); });

        await page.click(`[data-module-id="infoClick"]`);
        await helpers.sleep(1000);

        await page.click(`#map`);
        await helpers.sleep(2000);
        await page.click(`#_create_layer_0`);
        await helpers.sleep(4000);

        // Open state snapshot manager
        await page.click(`[href="#state-snapshots-content"]`);
        await helpers.sleep(2000);
        expect(await page.evaluate(`$('#state-snapshots-content').find('h4').length`)).to.equal(1);

        // Add snapshot
        await page.type(`.js-browser-owned input`, `snapshot with virtual layer`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-content').find('h4').first().find('button').first().trigger('click')`);
        await helpers.sleep(2000);

        // Open fresh page with virtual layer in URL
        let newPage = await browser.newPage();
        await newPage.goto(helpers.PAGE_URL_DEFAULT);
        await newPage.emulate(helpers.EMULATED_SCREEN);
        await helpers.sleep(5000);

        // Open state snapshot manager
        await newPage.click(`[href="#state-snapshots-content"]`);
        await helpers.sleep(2000);
        await newPage.evaluate(`$('#state-snapshots-content').find('.panel-default').eq(0).find('button').first().trigger('click')`);
        await helpers.sleep(4000);

        // Open layer tree
        await newPage.click(`[data-module-id="layerTree"]`);
        await helpers.sleep(1000);
        expect(await newPage.evaluate(`$('#layer-panel-VmlydHVhbCBsYXllcnM').length`)).to.equal(1);
        await newPage.click(`#layer-panel-VmlydHVhbCBsYXllcnM`);
        await helpers.sleep(2000);
        expect(await newPage.evaluate(`$('[data-gc2-layer-key^="virtual_layer.query"]').length`)).to.equal(1);
        expect(await newPage.evaluate(`$('.leaflet-interactive').length`)).to.equal(1);
    });
});
