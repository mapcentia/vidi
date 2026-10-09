/**
 * Testing layerTree module
 */

const { expect } = require(`chai`);
const helpers = require(`./../helpers`);

describe('Measurements', () => {
    it('should allow measuring distance and area in default template', async () => {
        let page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL_DEFAULT}`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        expect(await page.evaluate(`$('.leaflet-draw-draw-polyline').is(':visible')`)).to.be.false;
        expect(await page.evaluate(`$('.leaflet-draw-draw-polygon').is(':visible')`)).to.be.false;

        await page.evaluate(`$('[class="fa fa-ruler"]').parent().trigger('click')`);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('.leaflet-draw-draw-polyline').is(':visible')`)).to.be.true;
        expect(await page.evaluate(`$('.leaflet-draw-draw-polygon').is(':visible')`)).to.be.true;
    });

    /*
    // Embedded template now does not contain measurements module, so this test should be removed
    it('should allow measuring distance and area in embed template', async () => {
        let page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL_EMBEDDED}`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);
        
        expect(await page.evaluate(`$('#measurements-module-btn').is(':visible')`)).to.be.true;
        expect(await page.evaluate(`$('#measurements-module-cancel-btn').is(':visible')`)).to.be.false;
        expect(await page.evaluate(`$('#measurements-module-draw-line-btn').is(':visible')`)).to.be.false;
        expect(await page.evaluate(`$('#measurements-module-draw-polygon-btn').is(':visible')`)).to.be.false;
        expect(await page.evaluate(`$('#measurements-module-delete-btn').is(':visible')`)).to.be.false;

        await page.click(`#measurements-module-btn`);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('#measurements-module-btn').is(':visible')`)).to.be.false;
        expect(await page.evaluate(`$('#measurements-module-cancel-btn').is(':visible')`)).to.be.true;
        expect(await page.evaluate(`$('#measurements-module-draw-line-btn').is(':visible')`)).to.be.true;
        expect(await page.evaluate(`$('#measurements-module-draw-polygon-btn').is(':visible')`)).to.be.true;
        expect(await page.evaluate(`$('#measurements-module-delete-btn').is(':visible')`)).to.be.true;

        await page.click(`#measurements-module-cancel-btn`);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('#measurements-module-cancel-btn').is(':visible')`)).to.be.false;
    });
    */
});