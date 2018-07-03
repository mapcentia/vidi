/**
 * Testing application
 */

const { expect } = require("chai");
const helpers = require("./../helpers");

describe("Application", () => {
    it("should constantly check for connection status and keep Force offline mode selector updated", async () => {
        const page = await browser.newPage();
        await page.goto(helpers.PAGE_URL);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);
        await page.reload();
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        expect(await page.evaluate(`$('.js-app-is-online-badge').hasClass('hidden');`)).to.be.false;
        expect(await page.evaluate(`$('.js-app-is-offline-badge').hasClass('hidden');`)).to.be.true;

        let forceOfflineModeIndicator;
        forceOfflineModeIndicator = await page.evaluate(`$('.js-toggle-offline-mode').is(':checked')`);
        expect(forceOfflineModeIndicator).to.be.false;

        await page.evaluate(`$('.js-toggle-offline-mode').parent().find('.toggle').trigger('click')`);

        forceOfflineModeIndicator = await page.evaluate(`$('.js-toggle-offline-mode').is(':checked')`);
        expect(forceOfflineModeIndicator).to.be.true;
    });
});
