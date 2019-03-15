/**
 * Testing layerTree module
 */

const { expect } = require("chai");
const helpers = require("./../helpers");

describe(`Info click`, () => {
    it(`should search in enabled raster layers`, async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL_DEFAULT + `test.polygon`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        await page.click(`[data-module-id="infoClick"]`);
        await helpers.sleep(1000);

        await page.click(`#map`);
        await helpers.sleep(2000);

        // Checking if result table and action buttons were generated
        expect(await page.evaluate(`$('.fixed-table-body').find('tbody').find('tr[data-uniqueid]').length`)).to.equal(1);
        expect(await page.evaluate(`$('#modal-info-body').find('#_download_geojson_0').length`)).to.equal(1);
        expect(await page.evaluate(`$('#modal-info-body').find('#_download_excel_0').length`)).to.equal(1);
        expect(await page.evaluate(`$('#modal-info-body').find('#_create_layer_0').length`)).to.equal(1);
    });

    it (`should perform advanced search in enabled raster layers`, async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL_DEFAULT + `test.polygon,public.test_poly`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        expect(await page.evaluate(`$('#buffer-value').is(':visible')`)).to.be.false;

        // Enable advanced info
        await page.click(`[data-module-id="infoClick"]`);
        await helpers.sleep(1000);
        await page.evaluate(`$('#advanced-info-btn').trigger('click')`);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('#buffer-value').is(':visible')`)).to.be.true;
        expect(await page.evaluate(`$('#advanced-info-btn').is(':visible')`)).to.be.true;

        await page.evaluate(`var event = document.createEvent('Event');
        event.initEvent('click', true, true);
        var cb = document.getElementsByClassName('leaflet-draw-draw-rectangle');
        !cb[0].dispatchEvent(event);`);

        await page.click(`#map`);
        await helpers.sleep(1000);

        let mouse = page.mouse;
        await mouse.click(100, 100);
        await helpers.sleep(1000);

        // Checking if result table and action buttons were generated
        expect(await page.evaluate(`$('.fixed-table-body').find('tbody').find('tr[data-uniqueid]').length`)).to.equal(2);
        expect(await page.evaluate(`$('#modal-info-body').find('#_download_geojson_1').length`)).to.equal(1);
        expect(await page.evaluate(`$('#modal-info-body').find('#_download_excel_1').length`)).to.equal(1);
        expect(await page.evaluate(`$('#modal-info-body').find('#_create_layer_1').length`)).to.equal(1);
    });
});
