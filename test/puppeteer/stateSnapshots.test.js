/**
 * Testing stateSnapshots module
 */

const { expect } = require("chai");
const helpers = require("./../helpers");

describe("State snapshots", () => {
    it("should react to authorization status change", async () => {
        const page = await browser.newPage();
        await page.goto(helpers.PAGE_URL);
        await page.emulate(helpers.EMULATED_SCREEN);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);
        await page.reload(helpers.PAGE_LOAD_TIMEOUT);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        // Open state snapshot manager
        await page.click(`#state-snapshots-dialog-btn`);
        await helpers.sleep(2000);
        expect(await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').length`)).to.equal(1);

        // Sign in
        await page.evaluate(`$('.gc2-session-unlock').trigger('click')`);
        await helpers.sleep(1000);
        await page.focus('#sessionEmail');
        await page.keyboard.type('aleksandrshumilov');
        await page.focus('#sessionPassword');
        await page.keyboard.type('qewadszcx');
        await helpers.sleep(1000);
        await page.evaluate(`$('.login').find('[type="submit"]').trigger('click')`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#login-modal').find('[data-dismiss="modal"]').first().trigger('click');`);
        await helpers.sleep(2000);
       
        // Check if user-owned state snapshots tab was shown
        expect(await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').length`)).to.equal(2);
    });

    it("should capture current state and save it as browser-owned", async () => {
        const page = await browser.newPage();
        await page.goto(helpers.PAGE_URL);
        await page.emulate(helpers.EMULATED_SCREEN);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);
        await page.reload(helpers.PAGE_LOAD_TIMEOUT);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        // Accepting dialogs
        page.on('dialog', (dialog) => { dialog.accept(); });

        // Open state snapshot manager
        await page.click(`#state-snapshots-dialog-btn`);
        await helpers.sleep(2000);
        expect(await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').length`)).to.equal(1);
        let initialNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-dialog-content').find('.js-browser-owned').find('.panel-default').length`);

        // Clicking the Add state snapshot button
        await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').first().find('button').first().trigger('click')`);
        await helpers.sleep(2000);
        let currentNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-dialog-content').find('.js-browser-owned').find('.panel-default').length`);

        expect(initialNumberOfStateSnapshots === (currentNumberOfStateSnapshots - 1)).to.be.true;

        // Snapshot is displayed after the browser reload
        await page.reload(helpers.PAGE_LOAD_TIMEOUT);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        // Open state snapshot manager
        await page.click(`#state-snapshots-dialog-btn`);
        await helpers.sleep(2000);

        // Check if browser-owned state snapshots were loaded
        expect(await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').length`)).to.equal(1);
        let numberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-dialog-content').find('.js-browser-owned').find('.panel-default').length`);
        expect(numberOfStateSnapshots > 0).to.be.true;
    });

    it("should capture current state and save it as user-owned", async () => {
        const page = await browser.newPage();
        await page.goto(helpers.PAGE_URL);
        await page.emulate(helpers.EMULATED_SCREEN);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);
        await page.reload(helpers.PAGE_LOAD_TIMEOUT);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        // Accepting dialogs
        page.on('dialog', (dialog) => { dialog.accept(); });

        // Open state snapshot manager
        await page.click(`#state-snapshots-dialog-btn`);
        await helpers.sleep(2000);
        expect(await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').length`)).to.equal(1);

        // Sign in
        await page.evaluate(`$('.gc2-session-unlock').trigger('click')`);
        await helpers.sleep(1000);
        await page.focus('#sessionEmail');
        await page.keyboard.type('aleksandrshumilov');
        await page.focus('#sessionPassword');
        await page.keyboard.type('qewadszcx');
        await helpers.sleep(1000);
        await page.evaluate(`$('.login').find('[type="submit"]').trigger('click')`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#login-modal').find('[data-dismiss="modal"]').first().trigger('click');`);
        await helpers.sleep(2000);

        let initialNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-dialog-content').find('.js-user-owned').find('.panel-default').length`);

        // Clicking the Add state snapshot button
        await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').eq(1).find('button').first().trigger('click')`);
        await helpers.sleep(3000);

        let currentNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-dialog-content').find('.js-user-owned').find('.panel-default').length`);
        expect(initialNumberOfStateSnapshots === (currentNumberOfStateSnapshots - 1)).to.be.true;
    });

    it("should make browser-owned state snapshots user-owned ones", async () => {
        const page = await browser.newPage();
        await page.goto(helpers.PAGE_URL);
        await page.emulate(helpers.EMULATED_SCREEN);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);
        await page.reload(helpers.PAGE_LOAD_TIMEOUT);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        // Accepting dialogs
        page.on('dialog', (dialog) => { dialog.accept(); });

        // Open state snapshot manager
        await page.click(`#state-snapshots-dialog-btn`);
        await helpers.sleep(2000);
        expect(await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').length`)).to.equal(1);
        let initialNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-dialog-content').find('.js-browser-owned').find('.panel-default').length`);

        // Clicking the Add state snapshot button
        await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').first().find('button').first().trigger('click')`);
        await helpers.sleep(2000);
        let currentNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-dialog-content').find('.js-browser-owned').find('.panel-default').length`);
        expect(initialNumberOfStateSnapshots === (currentNumberOfStateSnapshots - 1)).to.be.true;

        // Sign in
        await page.evaluate(`$('.gc2-session-unlock').trigger('click')`);
        await helpers.sleep(1000);
        await page.focus('#sessionEmail');
        await page.keyboard.type('aleksandrshumilov');
        await page.focus('#sessionPassword');
        await page.keyboard.type('qewadszcx');
        await helpers.sleep(1000);
        await page.evaluate(`$('.login').find('[type="submit"]').trigger('click')`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#login-modal').find('[data-dismiss="modal"]').first().trigger('click');`);
        await helpers.sleep(2000);

        initialNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-dialog-content').find('.js-user-owned').find('.panel-default').length`);
        await page.evaluate(`$('#state-snapshots-dialog-content').find('.js-browser-owned').find('.panel-default').first().find('button').eq(2).trigger('click')`);
        await helpers.sleep(2000);
        currentNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-dialog-content').find('.js-user-owned').find('.panel-default').length`);       
        expect(initialNumberOfStateSnapshots === (currentNumberOfStateSnapshots - 1)).to.be.true;
    });

    it("should create permalink that will make possible to share state snapshot", async () => {
        const page = await browser.newPage();
        await page.goto(helpers.PAGE_URL);
        await page.emulate(helpers.EMULATED_SCREEN);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);
        await page.reload(helpers.PAGE_LOAD_TIMEOUT);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        // Accepting dialogs
        page.on('dialog', (dialog) => { dialog.accept(); });

        // Open state snapshot manager
        await page.click(`#state-snapshots-dialog-btn`);
        await helpers.sleep(2000);
        expect(await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').length`)).to.equal(1);

        // Clicking the Add state snapshot button
        await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').first().find('button').first().trigger('click')`);
        await helpers.sleep(2000);

        let linkURL = await page.evaluate(`$('#state-snapshots-dialog-content').find('.js-browser-owned').find('input[type="text"]').val()`);

        const statePage = await browser.newPage();
        await statePage.setRequestInterception(true);
        let stateWasRequested = false;
        statePage.on('request', interceptedRequest => {
            if (interceptedRequest.url().indexOf('state-snapshot') !== -1) {
                if (interceptedRequest.url().indexOf(linkURL.split('=')[1]) !== -1) {
                    stateWasRequested = true;
                }
            }

            interceptedRequest.continue();
        });

        await statePage.goto(linkURL);
        await statePage.emulate(helpers.EMULATED_SCREEN);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        expect(stateWasRequested).to.be.true;
    });
});
