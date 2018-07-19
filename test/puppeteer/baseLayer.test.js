/**
 * Testing layerTree module
 */

const { expect } = require("chai");
const helpers = require("./../helpers");

describe('Draw', () => {
    it('should allow adding features to the map', async () => {
        const page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL}`);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);
    });
});
