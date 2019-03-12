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
        expect(await page.evaluate(`$('[data-gc2-layer-key="public.test.the_geom"]').find('.js-toggle-opacity').is(':visible')`)).to.be.false;

        await page.close();
    });

    it(`should change the opacity for tile layers using control`, async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL_DEFAULT + `public.test,public.test_poly`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        await page.evaluate(`$('[href="#layer-content"]').trigger('click')`);
        await page.evaluate(`$('[href="#collapseUHVibGljIGdyb3Vw"]').trigger('click')`);
        await helpers.sleep(2000);

        await page.evaluate(`$('[data-gc2-layer-key="public.test_poly.the_geom"]').find('.js-toggle-opacity').trigger('click')`);
        let layerOpacity = await page.evaluate(`$('.leaflet-tile-pane > .leaflet-image-layer').css('opacity')`);
        expect(layerOpacity).to.equal(`1`);
        expect(await page.evaluate(`$('[data-gc2-layer-key="public.test_poly.the_geom"]').find('.js-toggle-opacity').is(':visible')`)).to.be.true;
        await helpers.sleep(1000);

        await page.click('[data-gc2-layer-key="public.test_poly.the_geom"] .js-opacity-slider');
        layerOpacity = await page.evaluate(`$('.leaflet-tile-pane > .leaflet-image-layer').css('opacity')`);
        expect(layerOpacity).to.equal(`0.5`);

        await page.close();
    });

    it(`should keep the opacity settings after reload`, async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL_DEFAULT + `public.test,public.test_poly`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        await page.evaluate(`$('[href="#layer-content"]').trigger('click')`);
        await page.evaluate(`$('[href="#collapseUHVibGljIGdyb3Vw"]').trigger('click')`);
        await helpers.sleep(2000);

        // Open and click the slider
        await page.evaluate(`$('[data-gc2-layer-key="public.test_poly.the_geom"]').find('.js-toggle-opacity').trigger('click')`);
        await helpers.sleep(1000);
        await page.click('[data-gc2-layer-key="public.test_poly.the_geom"] .js-opacity-slider');
        await helpers.sleep(1000);

        // Reload page and check if the slider and layer have the same opacity as before
        await page.reload(helpers.PAGE_LOAD_TIMEOUT);
        page = await helpers.waitForPageToLoad(page);
        await helpers.sleep(1000);

        await page.evaluate(`$('[href="#layer-content"]').trigger('click')`);
        await page.evaluate(`$('[href="#collapseUHVibGljIGdyb3Vw"]').trigger('click')`);
        await helpers.sleep(2000);

        // Open and click the slider
        await page.evaluate(`$('[data-gc2-layer-key="public.test_poly.the_geom"]').find('.js-toggle-opacity').trigger('click')`);
        await helpers.sleep(1000);

        await page.screenshot({ path: './test.png' });

        let sliderValue = await page.evaluate(`$('[data-gc2-layer-key="public.test_poly.the_geom"] .js-opacity-slider .noUi-origin').attr('style')`);
        let layerOpacity = await page.evaluate(`$('.leaflet-tile-pane > .leaflet-image-layer').css('opacity')`);
        expect(sliderValue).to.equal(`left: 50%;`);
        expect(layerOpacity).to.equal(`0.5`);
    });
});
