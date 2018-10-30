/**
 * Testing layerTree module
 */

const { expect } = require("chai");
const helpers = require("./../helpers");

describe('Layer tree opacity', () => {
    it(`should display controls only for tile layers`, async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL_DEFAULT + `v:public.test`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        await page.evaluate(`$('[href="#layer-content"]').trigger('click')`);
        await page.evaluate(`$('[href="#collapseUHVibGljIGdyb3Vw"]').trigger('click')`);
        await helpers.sleep(2000);

        expect(await page.evaluate(`$('[data-gc2-layer-key="public.test_poly.the_geom"]').find('.js-toggle-opacity').is(':visible')`)).to.be.false;
        expect(await page.evaluate(`$('[data-gc2-layer-key="public.test.the_geom"]').find('.js-toggle-opacity').is(':visible')`)).to.be.false;

        await page.evaluate(`$('[data-gc2-layer-key="public.test_poly.the_geom"]').find('.check').trigger('click')`);
        await page.evaluate(`$('[data-gc2-layer-key="public.test.the_geom"]').find('.js-layer-type-selector-tile').trigger('click')`);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('[data-gc2-layer-key="public.test_poly.the_geom"]').find('.js-toggle-opacity').is(':visible')`)).to.be.true;
        expect(await page.evaluate(`$('[data-gc2-layer-key="public.test.the_geom"]').find('.js-toggle-opacity').is(':visible')`)).to.be.true;

        await page.close();
    });

    it(`should change the opacity for tile layers using control`, async () => {
        // @todo Implement test with the actual drag and drop
    });

    it(`should keep the opacity settings after reload and after application of state snapshot`, async () => {
        // @todo Keeping the state of the application
    });
});
