/**
 * Testing layerTree module
 */

const { expect } = require("chai");
const helpers = require("./../helpers");

describe('Layer tree table view', () => {
    it(`should load data for vector layers`, async () => {
        let page = await browser.newPage();
        await page.emulate(helpers.EMULATED_SCREEN);
        await page.goto(helpers.PAGE_URL_DEFAULT, { timeout: 0 });
        page = await helpers.waitForPageToLoad(page);
    
        await page.evaluate(`$('#search-border').trigger('click')`);
        await helpers.sleep(500);
        await page.evaluate(`$('[href="#layer-content"]').trigger('click')`);
        await helpers.sleep(500);
        await page.evaluate(`$('[href="#collapseRHluYW1pYyBsb2FkIHRlc3Q"]').trigger('click')`);
        await page.evaluate(`$('[href="#collapseUHVibGljIGdyb3Vw"]').trigger('click')`);
        await helpers.sleep(500);
        await page.evaluate(`$('[data-gc2-layer-key="public.dynamicloadtest.the_geom"]').find('.js-layer-type-selector-vector').trigger('click')`);
        await page.evaluate(`$('[data-gc2-layer-key="public.test_line.the_geom"] input').first().trigger('click')`);
        await helpers.sleep(500);

        // Enabling table view for points layer
        await page.evaluate(`$('[data-gc2-layer-key="public.dynamicloadtest.the_geom"]').find('.js-toggle-table-view').trigger('click')`);
        await helpers.sleep(500);
        expect(await page.evaluate(`$('[data-gc2-layer-key="public.dynamicloadtest.the_geom"]').find('tbody').is(':visible')`)).to.be.true;
        expect(await page.evaluate(`$('[data-gc2-layer-key="public.dynamicloadtest.the_geom"]').find('tbody').find('tr').length`)).to.equal(8);

        // Enabling table view for lines layer
        await page.evaluate(`$('[data-gc2-layer-key="public.test_line.the_geom"]').find('.js-toggle-table-view').trigger('click')`);
        await helpers.sleep(500);
        expect(await page.evaluate(`$('[data-gc2-layer-key="public.test_line.the_geom"]').find('tbody').is(':visible')`)).to.be.true;
        expect(await page.evaluate(`$('[data-gc2-layer-key="public.test_line.the_geom"]').find('tbody').find('tr').length`) > 0).to.be.true;
    });
});
