/**
 * Smoke tests for the current UI.
 *
 * Runs against a local Vidi (see test/helpers.js). The database is set with VIDI_TEST_DATABASE and must
 * have a published layer in the "public" schema, set with VIDI_TEST_LAYER (default public.punkt).
 */

const {expect} = require("chai");
const helpers = require("./../helpers");

const LAYER = process.env.VIDI_TEST_LAYER || `public.punkt`;
const APP_URL = `${helpers.PAGE_URL_BASE}app/${helpers.DATABASE}/public/`;

/**
 * Opens a page and waits until Vidi reports that it is loaded
 */
const openApp = async (url = APP_URL, beforeLoad = false) => {
    const page = await browser.newPage();
    await page.emulate(helpers.EMULATED_SCREEN);
    page.dialogs = [];
    page.on(`dialog`, async dialog => {
        page.dialogs.push(dialog.message());
        await dialog.dismiss();
    });
    if (beforeLoad) await beforeLoad(page);
    const loaded = helpers.waitForPageToLoad(page);
    await page.goto(url);
    await loaded;
    return page;
};

const getHashParts = (page) => decodeURIComponent(new URL(page.url()).hash).replace(`#`, ``).split(`/`);

const getAvailableBaseLayers = (page) => page.evaluate(() =>
    [...document.querySelectorAll(`.base-layer-item[data-gc2-base-id]`)].map(e => e.getAttribute(`data-gc2-base-id`)));

const openLayerGroupOf = async (page, layerKey) => {
    const selector = `input.js-show-layer-control[data-gc2-id="${layerKey}"]`;
    await page.click(`[href="#layer-content"]`);
    // Groups are rendered lazily, so open them until the layer shows up
    for (const toggle of await page.$$(`.js-toggle-layer-panel`)) {
        if (await page.$(selector)) break;
        await toggle.click();
        await helpers.sleep(500);
    }
    return page.$(selector);
};

/**
 * Clicks the screenshot button and waits for either the "ready" toast or an error dialog
 */
const takeScreenshot = async (page) => {
    await page.click(`.leaflet-control-simpleMapScreenshoter a`);
    const done = page.waitForFunction(() => document.body.innerText.indexOf(`Screenshot is ready`) !== -1 ||
        document.body.innerText.indexOf(`Screenshot er klar`) !== -1, {timeout: 30000});
    // The page is closed before the wait times out when a dialog wins the race
    done.catch(() => {});
    const failed = new Promise(resolve => page.once(`dialog`, resolve));
    await Promise.race([done, failed]);
    expect(page.dialogs, `screenshot failed`).to.deep.equal([]);
};

describe(`Smoke`, () => {
    it(`loads the application and writes the map state into the URL`, async () => {
        const page = await openApp();
        const [baseLayer, zoom, lng, lat] = getHashParts(page);
        const baseLayers = await getAvailableBaseLayers(page);

        expect(baseLayers).to.include(baseLayer);
        expect(parseInt(zoom)).to.be.at.least(0);
        expect(isNaN(parseFloat(lng)) || isNaN(parseFloat(lat))).to.be.false;
        expect(page.dialogs).to.deep.equal([]);
    });

    it(`falls back to the first base layer if the requested one does not exist`, async () => {
        const page = await openApp(`${APP_URL}#nonexistingbaselayer/13/9.92/57.05/`);
        const baseLayers = await getAvailableBaseLayers(page);

        expect(getHashParts(page)[0]).to.equal(baseLayers[0]);
    });

    it(`switches base layer from the base layer tab`, async () => {
        const page = await openApp();
        const baseLayers = await getAvailableBaseLayers(page);
        expect(baseLayers.length).to.be.at.least(2);
        const target = baseLayers.find(id => id !== getHashParts(page)[0]);

        await page.click(`[href="#baselayer-content"]`);
        await helpers.sleep(500);
        await page.click(`.base-layer-item[data-gc2-base-id="${target}"] input`);
        await helpers.sleep(1000);

        expect(getHashParts(page)[0]).to.equal(target);
    });

    it(`turns a layer on and off from the layer tree`, async () => {
        const page = await openApp();
        const layerRequests = [];
        await page.setRequestInterception(true);
        page.on(`request`, request => {
            if (request.url().indexOf(LAYER) !== -1) layerRequests.push(request.url());
            request.continue();
        });

        const checkbox = await openLayerGroupOf(page, LAYER);
        expect(checkbox, `layer ${LAYER} was not found in the layer tree`).to.not.be.null;

        await checkbox.click();
        await helpers.sleep(2000);
        expect(getHashParts(page)[4].split(`,`)).to.include(LAYER);
        expect(layerRequests.length).to.be.above(0);

        await checkbox.click();
        await helpers.sleep(1000);
        expect((getHashParts(page)[4] || ``).split(`,`)).to.not.include(LAYER);
    });

    it(`loads a vector layer from the URL`, async () => {
        let sqlResponse = false;
        const page = await openApp(`${APP_URL}#osm/13/9.92/57.05/v:${LAYER}`, async (page) => {
            page.on(`response`, response => {
                if (response.url().indexOf(`/api/sql/`) !== -1 && response.request().method() === `POST`) {
                    sqlResponse = response;
                }
            });
        });
        await helpers.sleep(1000);

        expect(sqlResponse, `no SQL request was made for the vector layer`).to.not.be.false;
        expect(sqlResponse.status()).to.equal(200);
        const body = await sqlResponse.json();
        expect(body.type).to.equal(`FeatureCollection`);
        expect(getHashParts(page)[4].split(`,`)).to.include(`v:${LAYER}`);
    });

    it(`takes a screenshot of the map`, async () => {
        const page = await openApp();
        await takeScreenshot(page);
    });

    it(`takes a screenshot of the map with a single tiled WMS base layer`, async function () {
        // Find a single tiled WMS base layer in the configuration
        let page = await openApp();
        const baseLayer = await page.evaluate(() =>
            (window.vidiConfig.baseLayers || []).find(l => l.type === `wms` && l.singleTile)?.id);
        await page.close();
        if (!baseLayer) this.skip();

        page = await openApp(`${APP_URL}#${baseLayer}/13/9.92/57.05/`);
        expect(getHashParts(page)[0]).to.equal(baseLayer);
        await takeScreenshot(page);
    });
});
