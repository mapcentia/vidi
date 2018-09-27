/**
 * Testing layerTree module
 */

const { expect } = require("chai");
const helpers = require("./../helpers");

describe('Base layers', () => {
    it('should allow switching base layers', async () => {
        let page = await browser.newPage();

        let osmWasRequested = false;
        let stamenTonerLiteWasRequested = false;
        let geodkBrightWasRequested = false;

        await page.setRequestInterception(true);
        page.on('request', interceptedRequest => {
            if (interceptedRequest.url().indexOf(`tile.openstreetmap.org`) !== -1) {
                osmWasRequested = true;
            } else if (interceptedRequest.url().indexOf(`fastly.net/toner-lite`) !== -1) {
                stamenTonerLiteWasRequested = true;
            } else if (interceptedRequest.url().indexOf(`baselayers/tms/1.0.0/geodk.bright`) !== -1) {
                geodkBrightWasRequested = true;
            }

            interceptedRequest.continue();
        });

        await page.goto(`${helpers.PAGE_URL_BASE}app/aleksandrshumilov/public/#stamenTonerLite/8/9.7971/55.7688/`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        await page.click(`#base-layers-btn`);
        await helpers.sleep(1000);

        await page.evaluate(`$('[data-gc2-base-id="stamenTonerLite"]').find('input').trigger('click')`);
        await helpers.sleep(2000);
        await page.evaluate(`$('[data-gc2-base-id="geodk.bright"]').find('input').trigger('click')`);
        await helpers.sleep(2000);
        await page.evaluate(`$('[data-gc2-base-id="osm"]').find('input').trigger('click')`);
        await helpers.sleep(2000);

        expect(osmWasRequested && stamenTonerLiteWasRequested && geodkBrightWasRequested).to.be.true;
    });

    it('should be able to show base layers side-by-side and restore the side-by-side mode after page reload', async () => {
        let page = await browser.newPage();

        let osmWasRequested = false;
        let stamenTonerLiteWasRequested = false;

        await page.setRequestInterception(true);
        page.on('request', interceptedRequest => {
            if (interceptedRequest.url().indexOf(`tile.openstreetmap.org`) !== -1) {
                osmWasRequested = true;
            } else if (interceptedRequest.url().indexOf(`fastly.net/toner-lite`) !== -1) {
                stamenTonerLiteWasRequested = true;
            }

            interceptedRequest.continue();
        });

        await page.goto(`${helpers.PAGE_URL}`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        await page.click(`#base-layers-btn`);
        await helpers.sleep(1000);

        await page.evaluate(`$('.js-toggle-side-by-side-mode').trigger('click')`);
        await helpers.sleep(1000);

        await page.evaluate(`$('[data-gc2-base-id="stamenTonerLite"]').find('input').trigger('click')`);
        await helpers.sleep(2000);
        await page.evaluate(`$('[data-gc2-base-id="osm"]').find('input').trigger('click')`);
        await helpers.sleep(2000);
        expect(osmWasRequested).to.be.true;
        expect(stamenTonerLiteWasRequested).to.be.true;

        await page.evaluate(`$('[data-gc2-side-by-side-base-id="stamenTonerLite"]').find('input').trigger('click')`);
        await helpers.sleep(1000);
        expect(stamenTonerLiteWasRequested).to.be.true;

        expect(await page.evaluate(`$('.leaflet-sbs-range').length`)).to.equal(1);

        // Reloading page
        await page.reload();
        page = await helpers.waitForPageToLoad(page);

        expect(await page.evaluate(`$('.leaflet-sbs-range').length`)).to.equal(1);
    });
});
