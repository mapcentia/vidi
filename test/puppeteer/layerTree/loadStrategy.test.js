/**
 * Testing loadStrategy toggle in layerTree module
 */

const { expect } = require("chai");
const helpers = require("./../../helpers");

describe('Layer tree load strategy', () => {
    it(`should display controls only for vector layers`, async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL_DEFAULT + 'v:public.dynamicloadtest,public.polygon');
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        await page.evaluate(`$('[href="#layer-content"]').trigger('click')`);
        await page.evaluate(`$('[href="#collapseRHluYW1pYyBsb2FkIHRlc3Q"]').trigger('click')`);
        await page.evaluate(`$('[href="#collapseUHVibGljIGdyb3Vw"]').trigger('click')`);
        await helpers.sleep(2000);

        expect(await page.evaluate(`$('[data-gc2-layer-key="public.dynamicloadtest.the_geom"]').find('.js-toggle-load-strategy').is(':visible')`)).to.be.true;
        expect(await page.evaluate(`$('[data-gc2-layer-key="public.test_poly.the_geom"]').find('.js-toggle-load-strategy').is(':visible')`)).to.be.false;
        await helpers.sleep(1000);

        await page.close();
    });

    it(`should change the load strategy for vector layers using control and keep it after page reload`, async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL_DEFAULT);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        await page.evaluate(`$('[href="#layer-content"]').trigger('click')`);
        await page.evaluate(`$('[href="#collapseRHluYW1pYyBsb2FkIHRlc3Q"]').trigger('click')`);
        await helpers.sleep(2000);

        let lastLoadStrategyUsedWasDynamic = -1;
        await page.setRequestInterception(true);
        page.on('request', request => {
            if (request.method() === `POST`) {
                let decodedQuery = Buffer.from(request.postData().split(`&`)[0].split(`=`)[1], 'base64').toString('ascii');
                if (decodedQuery.indexOf(`ST_Intersects(ST_Force2D`) > -1) {
                    lastLoadStrategyUsedWasDynamic = true;
                } else {
                    lastLoadStrategyUsedWasDynamic = false;
                }
            }

            request.continue();
        });

        // Enable vector layer
        await page.evaluate(`$('[data-gc2-layer-key="public.dynamicloadtest.the_geom"]').find('.js-layer-type-selector-vector').trigger('click')`);
        await helpers.sleep(1000);

        expect(lastLoadStrategyUsedWasDynamic).to.be.true;

        await page.evaluate(`$('#collapseRHluYW1pYyBsb2FkIHRlc3Q .js-toggle-load-strategy').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('#collapseRHluYW1pYyBsb2FkIHRlc3Q .js-layer-settings-load-strategy .togglebutton label').trigger('click')`);
        await helpers.sleep(1000);

        expect(lastLoadStrategyUsedWasDynamic).to.be.false;

        // Reload page
        let newPage = await browser.newPage();
        await newPage.goto(helpers.PAGE_URL_DEFAULT);
        await newPage.emulate(helpers.EMULATED_SCREEN);
        newPage = await helpers.waitForPageToLoad(newPage);

        await newPage.evaluate(`$('[href="#layer-content"]').trigger('click')`);
        await newPage.evaluate(`$('[href="#collapseRHluYW1pYyBsb2FkIHRlc3Q"]').trigger('click')`);
        await helpers.sleep(2000);

        lastLoadStrategyUsedWasDynamic = -1;
        await newPage.setRequestInterception(true);
        newPage.on('request', request => {
            if (request.method() === `POST`) {
                let decodedQuery = Buffer.from(request.postData().split(`&`)[0].split(`=`)[1], 'base64').toString('ascii');
                if (decodedQuery.indexOf(`ST_Intersects(ST_Force2D`) > -1) {
                    lastLoadStrategyUsedWasDynamic = true;
                } else {
                    lastLoadStrategyUsedWasDynamic = false;
                }
            }

            request.continue();
        });

        // Enable vector layer
        await newPage.evaluate(`$('[data-gc2-layer-key="public.dynamicloadtest.the_geom"]').find('.js-layer-type-selector-vector').trigger('click')`);
        await helpers.sleep(2000);
        await newPage.evaluate(`$('#collapseRHluYW1pYyBsb2FkIHRlc3Q .js-toggle-load-strategy').trigger('click')`);
        await helpers.sleep(2000);

        expect(lastLoadStrategyUsedWasDynamic).to.be.false;
        expect(await page.evaluate(`$('#collapseRHluYW1pYyBsb2FkIHRlc3Q .js-layer-settings-load-strategy .togglebutton label').is(':visible')`)).to.be.true;

        await page.close();
        await newPage.close();
    });
});
