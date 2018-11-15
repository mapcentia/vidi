/**
 * Testing stateSnapshots module
 */

const { expect } = require("chai");
const helpers = require("./../helpers");

describe("State snapshots", () => {
    it("should store the offline mode settings, as well as apply them according to cache status", async () => {
        // @todo Implement
    });

    it("should react to authorization status change", async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL);
        page = await helpers.waitForPageToLoad(page);

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
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        // Accepting dialogs
        page.on('dialog', (dialog) => { dialog.accept(); });

        // Open state snapshot manager
        await page.click(`#state-snapshots-dialog-btn`);
        await helpers.sleep(2000);
        expect(await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').length`)).to.equal(1);
        let initialNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-dialog-content').find('.js-browser-owned').find('.panel-default').length`);

        // Clicking the Add state snapshot button
        await page.type(`.js-browser-owned input`, `test snapshot title`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').first().find('button').first().trigger('click')`);
        await helpers.sleep(2000);
        let currentNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-dialog-content').find('.js-browser-owned').find('.panel-default').length`);

        expect(initialNumberOfStateSnapshots === (currentNumberOfStateSnapshots - 1)).to.be.true;

        // Snapshot is displayed after the browser reload
        await page.reload(helpers.PAGE_LOAD_TIMEOUT);
        page = await helpers.waitForPageToLoad(page);

        // Open state snapshot manager
        await page.click(`#state-snapshots-dialog-btn`);
        await helpers.sleep(2000);

        // Check if browser-owned state snapshots were loaded
        expect(await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').length`)).to.equal(1);
        let numberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-dialog-content').find('.js-browser-owned').find('.panel-default').length`);
        expect(numberOfStateSnapshots > 0).to.be.true;
    });

    it("should capture current state and save it as user-owned", async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

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
        await page.type(`.js-user-owned input`, `test snapshot title`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').eq(1).find('button').first().trigger('click')`);
        await helpers.sleep(3000);

        let currentNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-dialog-content').find('.js-user-owned').find('.panel-default').length`);
        expect(initialNumberOfStateSnapshots === (currentNumberOfStateSnapshots - 1)).to.be.true;
    });

    it("should make browser-owned state snapshots user-owned ones and delete them", async () => {
        let page = await browser.newPage();   
        await page.goto(helpers.PAGE_URL);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        // Accepting dialogs
        page.on('dialog', (dialog) => { dialog.accept(); });

        // Open state snapshot manager
        await page.click(`#state-snapshots-dialog-btn`);
        await helpers.sleep(2000);
        expect(await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').length`)).to.equal(1);
        let initialNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-dialog-content').find('.js-browser-owned').find('.panel-default').length`);

        // Clicking the Add state snapshot button
        await page.type(`.js-browser-owned input`, `test snapshot title`);
        await helpers.sleep(2000);
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
        await page.evaluate(`$('#state-snapshots-dialog-content').find('.js-browser-owned').find('.panel-default').first().find('button').eq(3).trigger('click')`);
        await helpers.sleep(2000);
        currentNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-dialog-content').find('.js-user-owned').find('.panel-default').length`);       
        expect(initialNumberOfStateSnapshots === (currentNumberOfStateSnapshots - 1)).to.be.true;

        // Clicking the Add state snapshot button
        await page.type(`.js-browser-owned input`, `test snapshot title`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').first().find('button').first().trigger('click')`);
        await helpers.sleep(4000);
        initialNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-dialog-content').find('.js-browser-owned').find('.panel-default').length`);
        await page.evaluate(`$('#state-snapshots-dialog-content').find('.js-browser-owned').find('.panel-default').first().find('button').eq(2).trigger('click')`);
        await helpers.sleep(4000);

        currentNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-dialog-content').find('.js-browser-owned').find('.panel-default').length`);       
        expect(initialNumberOfStateSnapshots === (currentNumberOfStateSnapshots + 1)).to.be.true;
    });

    it("should create permalink that will make possible to share state snapshot", async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        // Accepting dialogs
        page.on('dialog', (dialog) => { dialog.accept(); });

        // Open state snapshot manager
        await page.click(`#state-snapshots-dialog-btn`);
        await helpers.sleep(2000);
        expect(await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').length`)).to.equal(1);

        // Clicking the Add state snapshot button
        await page.type(`.js-browser-owned input`, `test snapshot title`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').first().find('button').first().trigger('click')`);
        await helpers.sleep(2000);

        let linkURL = await page.evaluate(`$('#state-snapshots-dialog-content').find('.js-browser-owned').find('input[type="text"]').eq(1).val()`);

        let statePage = await browser.newPage();
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
        statePage = await helpers.waitForPageToLoad(statePage);

        expect(stateWasRequested).to.be.true;
    });

    it("should restore multiple snapshots with dynamic layers in state snapshot", async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL + `test.polygon`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        // Accepting dialogs
        page.on('dialog', (dialog) => { dialog.accept(); });

        // Turn on two layers, including dynamic one
        await page.click(`#burger-btn`);
        await helpers.sleep(1000);
        await page.evaluate(`$('.accordion-toggle.collapsed').eq(2).trigger('click')`);
        await helpers.sleep(1000);

        await page.evaluate(`$('input[data-gc2-id="public.test"]').trigger('click')`);
        await helpers.sleep(1000);

        // Open state snapshot manager
        await page.click(`#state-snapshots-dialog-btn`);
        await helpers.sleep(2000);

        // Clicking the Add state snapshot button
        await page.type(`.js-browser-owned input`, `test snapshot title`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').first().find('button').first().trigger('click')`);
        await helpers.sleep(2000);

        // Reload page without dynamic layer turned on
        let newPage = await browser.newPage();
        await newPage.goto(helpers.PAGE_URL);
        await newPage.emulate(helpers.EMULATED_SCREEN);
        newPage = await helpers.waitForPageToLoad(newPage);

        // Open state snapshot manager
        await newPage.click(`#state-snapshots-dialog-btn`);
        await helpers.sleep(2000);

        // Applying first state snapshot
        await helpers.sleep(2000);
        await newPage.evaluate(`$('#state-snapshots-dialog-content').find('.panel-default').eq(0).find('button').first().trigger('click')`);

        await helpers.sleep(6000);

        expect(newPage.url().indexOf(`test.polygon`) !== -1).to.be.true;
        expect(newPage.url().indexOf(`public.test`) !== -1).to.be.true;
    });

    it("should restore multiple snapshots with initial and dynamic layers in URL", async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL + `test.polygon`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        // Accepting dialogs
        page.on('dialog', (dialog) => { dialog.accept(); });

        // Turn on two layers
        await page.click(`#burger-btn`);
        await helpers.sleep(1000);
        await page.evaluate(`$('.accordion-toggle.collapsed').eq(2).trigger('click')`);
        await helpers.sleep(1000);

        await page.evaluate(`$('input[data-gc2-id="public.test"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('input[data-gc2-id="public.test_line"]').trigger('click')`);
        await helpers.sleep(1000);

        // Open state snapshot manager
        await page.click(`#state-snapshots-dialog-btn`);
        await helpers.sleep(2000);

        // Clicking the Add state snapshot button
        await page.type(`.js-browser-owned input`, `test snapshot title`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').first().find('button').first().trigger('click')`);
        await helpers.sleep(2000);

        // Turn on another two layers
        await helpers.sleep(1000);
        await page.evaluate(`$('input[data-gc2-id="public.test"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('input[data-gc2-id="public.test_line"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('input[data-gc2-id="public.test_point_no_type"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('input[data-gc2-id="public.test_poly"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('input[data-gc2-id="test.polygon"]').trigger('click')`);
        await helpers.sleep(1000);

        // Clicking the Add state snapshot button
        await page.type(`.js-browser-owned input`, `test snapshot title`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').first().find('button').first().trigger('click')`);
        await helpers.sleep(2000);
        
        expect(await page.evaluate(`$('#state-snapshots-dialog-content').find('.panel-default').length`)).to.equal(2);

        // Applying first state snapshot
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-dialog-content').find('.panel-default').eq(0).find('button').first().trigger('click')`);

        // Checking if the Apply button is disabled while state snapshot is being activated
        expect(await page.evaluate(`$('#state-snapshots-dialog-content').find('.panel-default').eq(0).find('button').first().prop('disabled')`)).to.be.true;
        expect(await page.evaluate(`$('#state-snapshots-dialog-content').find('.panel-default').eq(1).find('button').first().prop('disabled')`)).to.be.true;

        await helpers.sleep(4000);

        expect(await page.evaluate(`$('#state-snapshots-dialog-content').find('.panel-default').eq(0).find('button').first().prop('disabled')`)).to.be.false;
        expect(await page.evaluate(`$('#state-snapshots-dialog-content').find('.panel-default').eq(1).find('button').first().prop('disabled')`)).to.be.false;

        expect(await page.evaluate(`$('[data-gc2-id="public.test"]').prop('checked')`)).to.be.true;
        expect(await page.evaluate(`$('[data-gc2-id="public.test_line"]').prop('checked')`)).to.be.true;
        expect(await page.evaluate(`$('[data-gc2-id="public.test_point_no_type"]').prop('checked')`)).to.be.false;
        expect(await page.evaluate(`$('[data-gc2-id="public.test_poly"]').prop('checked')`)).to.be.false;       
        expect(await page.evaluate(`$('[data-gc2-id="test.polygon"]').prop('checked')`)).to.be.true;

        // Applying second state snapshot
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-dialog-content').find('.panel-default').eq(1).find('button').first().trigger('click')`);
        await helpers.sleep(4000);
        expect(await page.evaluate(`$('[data-gc2-id="public.test"]').prop('checked')`)).to.be.false;
        expect(await page.evaluate(`$('[data-gc2-id="public.test_line"]').prop('checked')`)).to.be.false;
        expect(await page.evaluate(`$('[data-gc2-id="public.test_point_no_type"]').prop('checked')`)).to.be.true;
        expect(await page.evaluate(`$('[data-gc2-id="public.test_poly"]').prop('checked')`)).to.be.true;
        expect(await page.evaluate(`$('[data-gc2-id="test.polygon"]').prop('checked')`)).to.be.false;
    });

    it("should store layer-specific settings", async () => {
        // @todo Check for filters
        // @todo Check for offline mode settings

        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL_DEFAULT + `public.test_poly`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        // Accepting dialogs
        page.on('dialog', (dialog) => { dialog.accept(); });

        // Open state snapshot manager
        await page.click(`[href="#state-snapshots-dialog-content-content"]`);
        await helpers.sleep(2000);

        // Add snapshot
        await page.type(`.js-browser-owned input`, `Plain snapshot`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').first().find('button').first().trigger('click')`);
        await helpers.sleep(2000);

        // Change layer opacity 
        await page.evaluate(`$('[href="#layer-content"]').trigger('click')`);
        await page.evaluate(`$('[href="#collapseUHVibGljIGdyb3Vw"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('[data-gc2-layer-key="public.test_poly.the_geom"]').find('.js-toggle-opacity').trigger('click')`);
        await helpers.sleep(1000);
        await page.click('[data-gc2-layer-key="public.test_poly.the_geom"] .js-opacity-slider');
        await helpers.sleep(1000);

        // Open state snapshot manager
        await page.click(`[href="#state-snapshots-dialog-content-content"]`);
        await helpers.sleep(2000);

        // Add snapshot
        await page.type(`.js-browser-owned input`, `Altered opacity snapshot`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').first().find('button').first().trigger('click')`);
        await helpers.sleep(2000);

        // Check if current opacity is 0.5
        let layerOpacity = await page.evaluate(`$('[src^="https://gc2.mapcentia.com/mapcache/aleksandrshumilov/tms/1.0.0/public.test_poly"]').parent().parent().css('opacity')`);
        expect(layerOpacity).to.equal(`0.5`);

        // Applying first state snapshot
        await page.evaluate(`$('#state-snapshots-dialog-content').find('.panel-default').eq(0).find('button').first().trigger('click')`);
        await helpers.sleep(2000);

        // Check if current opacity is 1 as it was initially
        layerOpacity = await page.evaluate(`$('[src^="https://gc2.mapcentia.com/mapcache/aleksandrshumilov/tms/1.0.0/public.test_poly"]').parent().parent().css('opacity')`);
        expect(layerOpacity).to.equal(`1`);
    });
});
