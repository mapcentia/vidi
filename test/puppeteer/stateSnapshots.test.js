/**
 * Testing stateSnapshots module
 */

const { expect } = require("chai");
const { v1: uuidv1 } = require('uuid');
const helpers = require("./../helpers");

describe("State snapshots", () => {
    it("should react to authorization status change", async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL_DEFAULT);
        page = await helpers.waitForPageToLoad(page);

        // Open state snapshot manager
        await page.click(`#search-border`);
        await helpers.sleep(500);
        await page.click(`[href="#state-snapshots-content"]`);
        await helpers.sleep(500);
        expect(await page.evaluate(`$('#state-snapshots-content').find('h4').length`)).to.equal(1);

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
        expect(await page.evaluate(`$('#state-snapshots-content').find('h4').length`)).to.equal(2);
    });

    it("should generate state snapshot link with template parameter, taken from meta, not the current URL", async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL_DEFAULT.replace(`public/#`, `public/?tmpl=default.tmpl#`));
        page = await helpers.waitForPageToLoad(page);

        // Accepting dialogs
        page.on('dialog', (dialog) => { dialog.accept(); });

        // Open state snapshot manager
        await page.click(`#search-border`);
        await helpers.sleep(1000);
        await page.click(`[data-module-id="stateSnapshots"]`);
        await helpers.sleep(1000);

        let snapshotTitle = `test snapshot with template in meta ` + uuidv1();

        // Clicking the Add state snapshot button
        await page.type(`.js-browser-owned input[placeholder="New title"]`, snapshotTitle);
        await helpers.sleep(2000);

        await page.evaluate(`$('#state-snapshots-content').find('h4').first().find('button').first().trigger('click')`);
        await helpers.sleep(2000);

        let link = await page.evaluate(`$('[title="${snapshotTitle}"]').closest('.panel-body').find('input[type="text"]').val()`);
        expect(link.indexOf(`tmpl=default.tmpl`) > -1).to.equal(true);

        await helpers.sleep(1000);

        await page.goto(helpers.PAGE_URL_DEFAULT);
        page = await helpers.waitForPageToLoad(page);
        await helpers.sleep(3000);

        // Open state snapshot manager
        await page.click(`[href="#state-snapshots-content"]`);
        await helpers.sleep(2000);

        link = await page.evaluate(`$('[title="${snapshotTitle}"]').closest('.panel-body').find('input[type="text"]').val()`);
        expect(link.indexOf(`tmpl=default.tmpl`) > -1).to.equal(true);
    });

    it("should keep and update meta and title properties when seizing or updating the snapshot", async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL_DEFAULT.replace(`public/#`, `public/?tmpl=default.tmpl#`));
        page = await helpers.waitForPageToLoad(page);

        // Accepting dialogs
        page.on('dialog', (dialog) => { dialog.accept(); });

        // Open state snapshot manager
        await page.click(`#search-border`);
        await helpers.sleep(1000);
        await page.click(`[data-module-id="stateSnapshots"]`);
        await helpers.sleep(1000);

        await page.setRequestInterception(true);

        page.on('request', request => {
            request.continue();
        });

        let snapshotTitle = `test snapshot with template in meta ` + uuidv1();
        let updatedSnapshotTitle = ` updated`;

        let metaWasProperlySaved = false;
        let titleWasUpdated = false;
        page.on('response', response => {
            if (response.url().indexOf(`state-snapshots/aleksandrshumilov`) > -1) {
                response.json().then(result => {
                    if (Array.isArray(result) && result.length > 0) {
                        result.map(stateSnapshot => {
                            if (stateSnapshot.title === snapshotTitle || stateSnapshot.title === (snapshotTitle + updatedSnapshotTitle)) {
                                if (stateSnapshot.title === (snapshotTitle + updatedSnapshotTitle)) {
                                    titleWasUpdated = true;
                                }

                                if (stateSnapshot.snapshot.meta.tmpl === `default.tmpl`) {
                                    metaWasProperlySaved = true;
                                }
                            }
                        });
                    }
                });
            }
        });

        // Clicking the Add state snapshot button
        await page.type(`.js-browser-owned input[placeholder="New title"]`, snapshotTitle);
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-content').find('h4').first().find('button').first().trigger('click')`);
        await helpers.sleep(2000);

        // Checking if meta was saved
        expect(metaWasProperlySaved).to.equal(true);
        metaWasProperlySaved = false;

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

        // Seizing the snapshot
        await page.evaluate(`$($('.js-browser-owned').find('.panel-body').find('button')[3]).trigger('click')`);
        await helpers.sleep(2000);

        // Checking if meta was kept after seizing
        expect(metaWasProperlySaved).to.equal(true);
        metaWasProperlySaved = false;

        // Updating snapshot
        await page.evaluate(`$($('[title="${snapshotTitle}"]').closest('.panel-body').find('button')[1]).trigger('click')`);
        await helpers.sleep(1000);
        await page.type(`[value="${snapshotTitle}"]`, updatedSnapshotTitle);
        await helpers.sleep(1000);
        await page.evaluate(`$('[title="${snapshotTitle}"]').closest('.panel-body').find('.input-group-btn').find('button').first().trigger('click')`);
        await helpers.sleep(2000);

        // Checking if meta was kept after updating and title was changed
        expect(metaWasProperlySaved).to.equal(true);
        expect(titleWasUpdated).to.equal(true);
    });

    it("should capture current state and save it as browser-owned", async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL_DEFAULT);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        // Accepting dialogs
        page.on('dialog', (dialog) => { dialog.accept(); });

        // Open state snapshot manager
        await page.click(`[href="#state-snapshots-content"]`);
        await helpers.sleep(2000);
        expect(await page.evaluate(`$('#state-snapshots-content').find('h4').length`)).to.equal(1);
        let initialNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-content').find('.js-browser-owned').find('.panel-default').length`);

        // Clicking the Add state snapshot button
        await page.type(`.js-browser-owned input`, `test snapshot title`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-content').find('h4').first().find('button').first().trigger('click')`);
        await helpers.sleep(2000);
        let currentNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-content').find('.js-browser-owned').find('.panel-default').length`);

        expect(initialNumberOfStateSnapshots === (currentNumberOfStateSnapshots - 1)).to.be.true;
        await helpers.sleep(2000);

        // Snapshot is displayed after the browser reload
        await page.reload();
        page = await helpers.waitForPageToLoad(page);

        // Open state snapshot manager
        await page.click(`[href="#state-snapshots-content"]`);
        await helpers.sleep(2000);

        // Check if browser-owned state snapshots were loaded
        expect(await page.evaluate(`$('#state-snapshots-content').find('h4').length`)).to.equal(1);
        let numberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-content').find('.js-browser-owned').find('.panel-default').length`);
        expect(numberOfStateSnapshots > 0).to.be.true;
    });

    it("should capture current state and save it as user-owned", async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL_DEFAULT);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        // Accepting dialogs
        page.on('dialog', (dialog) => { dialog.accept(); });

        // Open state snapshot manager
        await page.click(`[href="#state-snapshots-content"]`);
        await helpers.sleep(2000);
        expect(await page.evaluate(`$('#state-snapshots-content').find('h4').length`)).to.equal(1);

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

        let initialNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-content').find('.js-user-owned').find('.panel-default').length`);

        // Clicking the Add state snapshot button
        await page.type(`.js-user-owned input`, `test snapshot title`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-content').find('h4').eq(1).find('button').first().trigger('click')`);
        await helpers.sleep(3000);

        let currentNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-content').find('.js-user-owned').find('.panel-default').length`);
        expect(initialNumberOfStateSnapshots === (currentNumberOfStateSnapshots - 1)).to.be.true;
    });

    it("should make browser-owned state snapshots user-owned ones and delete them", async () => {
        let page = await browser.newPage();   
        await page.goto(helpers.PAGE_URL_DEFAULT);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        // Accepting dialogs
        page.on('dialog', (dialog) => { dialog.accept(); });

        // Open state snapshot manager
        await page.click(`[href="#state-snapshots-content"]`);
        await helpers.sleep(2000);
        expect(await page.evaluate(`$('#state-snapshots-content').find('h4').length`)).to.equal(1);
        let initialNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-content').find('.js-browser-owned').find('.panel-default').length`);

        // Clicking the Add state snapshot button
        await page.type(`.js-browser-owned input`, `test snapshot title`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-content').find('h4').first().find('button').first().trigger('click')`);
        await helpers.sleep(2000);
        let currentNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-content').find('.js-browser-owned').find('.panel-default').length`);
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

        initialNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-content').find('.js-user-owned').find('.panel-default').length`);
        await page.evaluate(`$('#state-snapshots-content').find('.js-browser-owned').find('.panel-default').first().find('button').eq(3).trigger('click')`);
        await helpers.sleep(2000);
        currentNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-content').find('.js-user-owned').find('.panel-default').length`);       
        expect(initialNumberOfStateSnapshots === (currentNumberOfStateSnapshots - 1)).to.be.true;

        // Clicking the Add state snapshot button
        await page.type(`.js-browser-owned input`, `test snapshot title`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-content').find('h4').first().find('button').first().trigger('click')`);
        await helpers.sleep(4000);
        initialNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-content').find('.js-browser-owned').find('.panel-default').length`);
        await page.evaluate(`$('#state-snapshots-content').find('.js-browser-owned').find('.panel-default').first().find('button').eq(2).trigger('click')`);
        await helpers.sleep(4000);

        currentNumberOfStateSnapshots = await page.evaluate(`$('#state-snapshots-content').find('.js-browser-owned').find('.panel-default').length`);       
        expect(initialNumberOfStateSnapshots === (currentNumberOfStateSnapshots + 1)).to.be.true;
    });

    it("should create permalink that will make possible to share state snapshot", async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL_DEFAULT);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        // Accepting dialogs
        page.on('dialog', (dialog) => { dialog.accept(); });

        // Turning on the layer
        await helpers.sleep(1000);
        await page.click(`[href="#layer-content"]`);
        await helpers.sleep(1000);
        await page.click(`[href="#collapseUHVibGljIGdyb3Vw"]`);
        await helpers.sleep(1000);
        await page.evaluate(`$('[data-gc2-id="public.test"]').first().trigger('click')`);
        await helpers.sleep(1000);

        // Open state snapshot manager
        await page.click(`[href="#state-snapshots-content"]`);
        await helpers.sleep(2000);
        expect(await page.evaluate(`$('#state-snapshots-content').find('h4').length`)).to.equal(1);

        // Clicking the Add state snapshot button
        await page.type(`.js-browser-owned input`, `test snapshot title`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-content').find('h4').first().find('button').first().trigger('click')`);
        await helpers.sleep(2000);
        let linkURL = await page.evaluate(`$('#state-snapshots-content').find('.js-browser-owned').find('input[type="text"]').eq(1).val()`);
        await page.close();

        let statePage = await browser.newPage();
        await statePage.goto(linkURL);
        await statePage.emulate(helpers.EMULATED_SCREEN);
        statePage = await helpers.waitForPageToLoad(statePage);

        await helpers.sleep(1000);
        await statePage.click(`[href="#layer-content"]`);
        await helpers.sleep(1000);
        await statePage.click(`[href="#collapseUHVibGljIGdyb3Vw"]`);
        await helpers.sleep(1000);
        expect(await statePage.evaluate(`$('[data-gc2-id="public.test"]').prop('checked')`)).to.be.true;
    });

    it("should restore multiple snapshots with dynamic layers in state snapshot", async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL_DEFAULT + `test.polygon`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        // Accepting dialogs
        page.on('dialog', (dialog) => { dialog.accept(); });

        // Turn on two layers, including dynamic one
        await helpers.sleep(1000);
        await page.click(`[href="#layer-content"]`);
        await helpers.sleep(1000);
        await page.click(`[href="#collapseUHVibGljIGdyb3Vw"]`);
        await helpers.sleep(1000);
        await page.evaluate(`$('input[data-gc2-id="public.test"]').trigger('click')`);
        await helpers.sleep(1000);

        // Open state snapshot manager
        await page.click(`[href="#state-snapshots-content"]`);
        await helpers.sleep(2000);

        // Clicking the Add state snapshot button
        await page.type(`.js-browser-owned input`, `test snapshot title`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-content').find('h4').first().find('button').first().trigger('click')`);
        await helpers.sleep(2000);

        // Reload page without dynamic layer turned on
        let newPage = await browser.newPage();
        await newPage.goto(helpers.PAGE_URL_DEFAULT);
        await newPage.emulate(helpers.EMULATED_SCREEN);
        newPage = await helpers.waitForPageToLoad(newPage);

        // Open state snapshot manager
        await newPage.click(`[href="#state-snapshots-content"]`);
        await helpers.sleep(2000);

        // Applying first state snapshot
        await helpers.sleep(2000);
        await newPage.evaluate(`$('#state-snapshots-content').find('.panel-default').eq(0).find('button').first().trigger('click')`);

        await helpers.sleep(6000);

        expect(newPage.url().indexOf(`test.polygon`) !== -1).to.be.true;
        expect(newPage.url().indexOf(`public.test`) !== -1).to.be.true;
    });

    it("should restore multiple snapshots with initial and dynamic layers in URL", async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL_DEFAULT + `test.polygon`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        // Accepting dialogs
        page.on('dialog', (dialog) => { dialog.accept(); });

        // Turn on two layers
        await helpers.sleep(1000);
        await page.click(`[href="#layer-content"]`);
        await helpers.sleep(1000);
        await page.click(`[href="#collapseUHVibGljIGdyb3Vw"]`);
        await page.click(`[href="#collapseVGVzdCBncm91cA"]`);
        await helpers.sleep(1000);
        await page.evaluate(`$('input[data-gc2-id="public.test"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('input[data-gc2-id="public.test_line"]').trigger('click')`);
        await helpers.sleep(1000);

        // Open state snapshot manager
        await page.click(`[href="#state-snapshots-content"]`);
        await helpers.sleep(2000);

        // Clicking the Add state snapshot button
        await page.type(`.js-browser-owned input`, `test snapshot title`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-content').find('h4').first().find('button').first().trigger('click')`);
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
        await page.evaluate(`$('input[data-gc2-id="test.polygon"]').first().trigger('click')`);
        await helpers.sleep(1000);

        // Clicking the Add state snapshot button
        await page.type(`.js-browser-owned input`, `test snapshot title`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-content').find('h4').first().find('button').first().trigger('click')`);
        await helpers.sleep(2000);
        
        expect(await page.evaluate(`$('#state-snapshots-content').find('.panel-default').length`)).to.equal(2);

        // Applying first state snapshot
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-content').find('.panel-default').eq(0).find('button').first().trigger('click')`);

        // Checking if the Apply button is disabled while state snapshot is being activated
        expect(await page.evaluate(`$('#state-snapshots-content').find('.panel-default').eq(0).find('button').first().prop('disabled')`)).to.be.true;
        expect(await page.evaluate(`$('#state-snapshots-content').find('.panel-default').eq(1).find('button').first().prop('disabled')`)).to.be.true;

        await helpers.sleep(4000);

        expect(await page.evaluate(`$('#state-snapshots-content').find('.panel-default').eq(0).find('button').first().prop('disabled')`)).to.be.false;
        expect(await page.evaluate(`$('#state-snapshots-content').find('.panel-default').eq(1).find('button').first().prop('disabled')`)).to.be.false;

        await helpers.sleep(1000);
        await page.click(`[href="#layer-content"]`);
        await helpers.sleep(1000);
        await page.click(`[href="#collapseUHVibGljIGdyb3Vw"]`);
        await page.click(`[href="#collapseVGVzdCBncm91cA"]`);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('[data-gc2-id="public.test"]').prop('checked')`)).to.be.true;
        expect(await page.evaluate(`$('[data-gc2-id="public.test_line"]').prop('checked')`)).to.be.true;
        expect(await page.evaluate(`$('[data-gc2-id="public.test_point_no_type"]').prop('checked')`)).to.be.false;
        expect(await page.evaluate(`$('[data-gc2-id="public.test_poly"]').prop('checked')`)).to.be.false;       
        expect(await page.evaluate(`$('[data-gc2-id="test.polygon"]').prop('checked')`)).to.be.true;

        // Applying second state snapshot
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-content').find('.panel-default').eq(1).find('button').first().trigger('click')`);
        await helpers.sleep(4000);

        await helpers.sleep(1000);
        await page.click(`[href="#layer-content"]`);
        await helpers.sleep(1000);
        await page.click(`[href="#collapseUHVibGljIGdyb3Vw"]`);
        await helpers.sleep(1000);
        await page.click(`[href="#collapseVGVzdCBncm91cA"]`);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('[data-gc2-id="public.test"]').prop('checked')`)).to.be.false;
        expect(await page.evaluate(`$('[data-gc2-id="public.test_line"]').prop('checked')`)).to.be.false;
        expect(await page.evaluate(`$('[data-gc2-id="public.test_point_no_type"]').prop('checked')`)).to.be.true;
        expect(await page.evaluate(`$('[data-gc2-id="public.test_poly"]').prop('checked')`)).to.be.true;
        expect(await page.evaluate(`$('[data-gc2-id="test.polygon"]').prop('checked')`)).to.be.false;
    });

    it("should store layer-specific settings", async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL_DEFAULT + `public.test_poly,v:public.test`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        // Accepting dialogs
        page.on('dialog', (dialog) => { dialog.accept(); });

        // Open state snapshot manager
        await page.click(`[href="#state-snapshots-content"]`);
        await helpers.sleep(2000);

        // Add snapshot
        await page.type(`.js-browser-owned input`, `Plain snapshot`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-content').find('h4').first().find('button').first().trigger('click')`);
        await helpers.sleep(2000);

        // Open layers tab
        await page.evaluate(`$('[href="#layer-content"]').trigger('click')`);
        await page.evaluate(`$('[href="#collapseUHVibGljIGdyb3Vw"]').trigger('click')`);
        await helpers.sleep(1000);

        // Change layer opacity 
        await page.evaluate(`$('[data-gc2-layer-key="public.test_poly.the_geom"]').find('.js-toggle-opacity').trigger('click')`);
        await helpers.sleep(1000);
        await page.click('[data-gc2-layer-key="public.test_poly.the_geom"] .js-opacity-slider');
        await helpers.sleep(1000);

        // Set offline mode
        await page.evaluate(`$('.js-set-offline[data-layer-key="public.test"]').trigger('click')`);
        await helpers.sleep(1000);

        // Open state snapshot manager
        await page.click(`[href="#state-snapshots-content"]`);
        await helpers.sleep(2000);

        // Add snapshot
        await page.type(`.js-browser-owned input`, `Altered snapshot`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-content').find('h4').first().find('button').first().trigger('click')`);
        await helpers.sleep(2000);

        // Check if current opacity is 0.5
        let layerOpacity = await page.evaluate(`$('.leaflet-tile-pane > .leaflet-image-layer').css('opacity')`);
        expect(layerOpacity).to.equal(`0.5`);

        // Applying first state snapshot
        await page.evaluate(`$('#state-snapshots-content').find('.panel-default').eq(0).find('button').first().trigger('click')`);
        await helpers.sleep(2000);

        // Open layers tab
        await page.evaluate(`$('[href="#layer-content"]').trigger('click')`);
        await page.evaluate(`$('[href="#collapseUHVibGljIGdyb3Vw"]').trigger('click')`);
        await helpers.sleep(6000);

        // Check if current opacity is 1 as it was initially
        layerOpacity = await page.evaluate(`$('.leaflet-tile-pane > .leaflet-image-layer').css('opacity')`);
        expect(layerOpacity).to.equal(`1`);

        // Check if offline mode is disabled
        expect(await page.evaluate(`$('.js-set-online[data-layer-key="public.test"]').prop('disabled')`)).to.be.true;
        expect(await page.evaluate(`$('.js-set-offline[data-layer-key="public.test"]').prop('disabled')`)).to.be.false;

        // Applying second state snapshot
        await page.evaluate(`$('#state-snapshots-content').find('.panel-default').eq(1).find('button').first().trigger('click')`);
        await helpers.sleep(2000);

        // Open layers tab
        await page.evaluate(`$('[href="#layer-content"]').trigger('click')`);
        await page.evaluate(`$('[href="#collapseUHVibGljIGdyb3Vw"]').trigger('click')`);
        await helpers.sleep(6000);

        // Check if current opacity is 1 as it was initially
        layerOpacity = await page.evaluate(`$('.leaflet-tile-pane > .leaflet-image-layer').css('opacity')`);
        expect(layerOpacity).to.equal(`0.5`);

        // Check if offline mode is disabled
        expect(await page.evaluate(`$('.js-set-online[data-layer-key="public.test"]').prop('disabled')`)).to.be.false;
        expect(await page.evaluate(`$('.js-set-offline[data-layer-key="public.test"]').prop('disabled')`)).to.be.true;
    });
});
