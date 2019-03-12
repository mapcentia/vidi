/**
 * Testing layerTree module
 */

const { expect } = require("chai");
const helpers = require("./../helpers");

describe('Base layers', () => {
    it('should switch to first available layer if the provided one is invalid', async () => {
        let page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL_DEFAULT.replace(`#osm`, `#nonexistingbaselayer`)}`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        await helpers.sleep(2000);

        expect(page.url().indexOf(`public/#stamenTonerLite`) !== -1).to.be.true;
    });

    it('should allow switching base layers', async () => {
        let page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL_BASE}app/aleksandrshumilov/public/#stamenTonerLite/8/9.7971/55.7688/`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

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

        await page.click(`[href="#baselayer-content"]`);
        await helpers.sleep(1000);

        await page.evaluate(`$('[data-gc2-base-id="geodk.bright"]').find('input').trigger('click')`);
        await helpers.sleep(2000);
        await page.evaluate(`$('[data-gc2-base-id="stamenTonerLite"]').find('input').trigger('click')`);
        await helpers.sleep(2000);
        await page.evaluate(`$('[data-gc2-base-id="osm"]').find('input').trigger('click')`);
        await helpers.sleep(2000);

        expect(osmWasRequested && stamenTonerLiteWasRequested && geodkBrightWasRequested).to.be.true;
    });

    it('should be able to overlap base layers and restore overlap after page reload', async () => {
        let page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL_EMBEDDED.replace(`#osm`, `#stamenTonerLite`)}`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        await page.click(`#base-layers-btn`);
        await helpers.sleep(1000);
        await page.evaluate(`$('.js-two-layers-at-once-control').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('[name="two-layers-at-once-mode"][value="overlay"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('[name="side-by-side-baselayers"][value="osm"]').trigger('click')`);
        await helpers.sleep(1000);

        // Checking if base layres are drawn with initial 50% opacity
        await page.evaluate(`var slider = $('.js-side-by-side-layer-opacity-slider').get(0);`);
        expect(await page.evaluate(`$('.js-side-by-side-layer-opacity-slider').is(':visible')`)).to.be.true;
        expect(await page.evaluate(`slider.noUiSlider.get();`)).to.equal(`50.00`);
        await helpers.img(page);
        expect(await page.evaluate(`$('[src*="openstreetmap.org"]').first().closest('.leaflet-layer').css('opacity')`)).to.equal(`0.5`);
        await helpers.sleep(1000);

        // Setting slider value to 30%
        await page.evaluate(`slider.noUiSlider.set(30);`);
        await helpers.sleep(1000);

        // Checking if base layres are drawn with 30% opacity
        await page.evaluate(`var slider = $('.js-side-by-side-layer-opacity-slider').get(0);`);
        expect(await page.evaluate(`$('.js-side-by-side-layer-opacity-slider').is(':visible')`)).to.be.true;
        expect(await page.evaluate(`slider.noUiSlider.get();`)).to.equal(`30.00`);
        expect(await page.evaluate(`$('[src*="openstreetmap.org"]').first().closest('.leaflet-layer').css('opacity')`)).to.equal(`0.3`);
        await helpers.sleep(1000);

        // Reloading page
        await page.reload();
        page = await helpers.waitForPageToLoad(page);
        await helpers.sleep(2000);

        // Checking if base layres are drawn with 30% opacity
        await page.evaluate(`var slider = $('.js-side-by-side-layer-opacity-slider').get(0);`);
        expect(await page.evaluate(`$('.js-side-by-side-layer-opacity-slider').is(':visible')`)).to.be.true;
        expect(await page.evaluate(`slider.noUiSlider.get();`)).to.equal(`30.00`);
        expect(await page.evaluate(`$('[src*="openstreetmap.org"]').first().closest('.leaflet-layer').css('opacity')`)).to.equal(`0.3`);
    });

    it('should be able to show base layers side-by-side and restore the side-by-side mode after page reload', async () => {
        let page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL_EMBEDDED}`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        let osmWasRequested = false;
        let stamenTonerLiteWasRequested = false;

        const logRequest = interceptedRequest => {
            if (interceptedRequest.url().indexOf(`tile.openstreetmap.org`) !== -1) {
                osmWasRequested = true;
            } else if (interceptedRequest.url().indexOf(`fastly.net/toner-lite`) !== -1) {
                stamenTonerLiteWasRequested = true;
            }

            interceptedRequest.continue();
        };

        await page.setRequestInterception(true);
        page.on('request', logRequest);

        await page.click(`#base-layers-btn`);
        await helpers.sleep(1000);
        await page.evaluate(`$('.js-two-layers-at-once-control').trigger('click')`);
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
        await page.setRequestInterception(false);
        page.removeListener('request', logRequest);

        // Reloading page
        await page.reload();
        page = await helpers.waitForPageToLoad(page);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('.leaflet-sbs-range').length`)).to.equal(1);
    });
});
