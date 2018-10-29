/**
 * Testing Editor extension
 */

const { expect } = require("chai");
const helpers = require("./../helpers");

describe('Editor', () => {
    describe('(if user is authorized)', () => {
        it('should add, update and delete features', async () => {
            let page = await browser.newPage();
            await page.goto(`${helpers.PAGE_URL}v:public.test,public.test_poly`);
            await page.emulate(helpers.EMULATED_SCREEN);
            page = await helpers.waitForPageToLoad(page);

            // Accepting the dialog
            page.on('dialog', (dialog) => {
                dialog.accept();
            });

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
    	    await page.evaluate(`$('#login-modal').find('.close').trigger('click')`);
            await helpers.sleep(1000);

            // Check if feature already exists on the map, if it does - delete
            await page.click(`#map`);
            await helpers.sleep(1000);
            while (await page.evaluate(`$('.ge-delete').is(':visible')`)) {
                await page.evaluate(`$('.ge-delete').trigger('click')`);
                await helpers.sleep(6000);
                await page.click(`#map`);
                await helpers.sleep(1000);
            }

            // Adding feature
            await page.click(`#burger-btn`);
            await helpers.sleep(1000);
            let offlineModeIsForced = await page.evaluate(`$('.js-toggle-offline-mode').is(':checked')`);
            if (offlineModeIsForced) {
                await page.evaluate(`$('.toggle').trigger('click');`);
                await helpers.sleep(2000);
            }

            await page.evaluate(`$('[data-parent="#layers"]').last().trigger('click')`);
            await page.evaluate(`$('[data-gc2-key="public.test.the_geom"]').trigger('click')`);
            await page.click(`#map`);
            await helpers.sleep(1000);
            await page.focus('#root_id');
            await page.keyboard.type('2000');
            await page.focus('#root_stringfield');
            await page.keyboard.type('333');
            await helpers.sleep(1000);
            await page.evaluate(`$('#editor-attr-dialog').find('[type="submit"]').trigger('click')`);
            await helpers.sleep(4000);

            // Ensure that the feature was added
            await page.click(`#map`);
            await helpers.sleep(1000);
            expect(await page.evaluate(`$('.ge-delete').is(':visible')`)).to.be.true;
            await helpers.sleep(4000);

            // Updating feature
            await helpers.sleep(4000);
            await page.click(`#map`);
            await helpers.sleep(1000);
            await page.evaluate(`$('.ge-start-edit').trigger('click')`);
            await helpers.sleep(2000);
            await page.focus('#root_id');
            await page.keyboard.type('1000');
            await helpers.sleep(1000);

            await page.setRequestInterception(true);
            let requestWasSent = false;
            page.on('request', interceptedRequest => {
                if (interceptedRequest.url().indexOf(`api/feature/aleksandrshumilov/public.test.the_geom/4326`) !== -1) {
                    requestWasSent = true;
                }
    
                interceptedRequest.continue();
            });

            await helpers.sleep(1000);

            expect(await page.evaluate(`$('#editor-attr-dialog').find('[type="submit"]').length`)).to.equal(1);
            await page.evaluate(`$('#editor-attr-dialog').find('[type="submit"]').trigger('click')`);
            await helpers.sleep(6000);

            expect(requestWasSent).to.be.true;

            // Ensure that the feature was updated
            await page.click(`#map`);
            await helpers.sleep(1000);
            await page.evaluate(`$('.ge-start-edit').trigger('click')`);
            await helpers.sleep(1000);

            expect(await page.evaluate(`$('#root_id').val()`)).to.equal('20001000');
            await helpers.sleep(1000);
            await page.evaluate(`$('#editor-attr-dialog').find('.close-hide').trigger('click')`);

            // Delete feature
            await helpers.sleep(1000);
            await page.click(`#map`);
            await helpers.sleep(1000);
            await page.evaluate(`$('.ge-delete').trigger('click')`);
            await helpers.sleep(4000);

            // Ensure that the feature was deleted
            await helpers.sleep(1000);
            await page.click(`#map`);
            expect(await page.evaluate(`$('.ge-delete').is(':visible')`)).to.be.false;

            // Sign out
            await page.evaluate(`$('.gc2-session-unlock').trigger('click')`);
            await helpers.sleep(1000);
            await page.evaluate(`$('.login').find('[type="submit"]').trigger('click')`);
        });
    });

    describe('(if user is not authorized)', () => {
        it('should put add feature request to the queue', async () => {
            let page = await browser.newPage();
            await page.goto(`${helpers.PAGE_URL}v:public.test,public.test_poly`);
            await page.emulate(helpers.EMULATED_SCREEN);
            page = await helpers.waitForPageToLoad(page);

            // Accepting the dialog
            page.on('dialog', (dialog) => {
                dialog.accept();
            });

            // Selecting point on map and open the attribute editing dialog
            await page.click(`#burger-btn`);
            await helpers.sleep(1000);

            let offlineModeIsForced = await page.evaluate(`$('.js-toggle-offline-mode').is(':checked')`);
            if (offlineModeIsForced) {
                await page.evaluate(`$('#layers .toggle').trigger('click');`);
                await helpers.sleep(1000);
            }

            await page.evaluate(`$('[data-parent="#layers"]').last().trigger('click')`);
            await page.evaluate(`$('[data-gc2-key="public.test.the_geom"]').trigger('click')`);

            // Filling in attributes of the added feature
            await page.focus('#root_id');
            await page.keyboard.type('111');
            await page.focus('#root_stringfield');
            await page.keyboard.type('222');
            await page.evaluate(`$('#editor-attr-dialog').find('[type="submit"]').trigger('click')`);
            await helpers.sleep(6000);

            // Checking if the queue indicator shows that element was added to the queue
            expect(await page.evaluate(`$('[class="btn btn-sm btn-secondary js-statistics-field js-rejectedByServer-add"]').is(':visible')`)).to.be.true;
        });

        it('should put update feature request to the queue', async () => {
	        let page = await browser.newPage();
            await page.goto(`${helpers.PAGE_URL}v:public.test`);
            await page.emulate(helpers.EMULATED_SCREEN);
            page = await helpers.waitForPageToLoad(page);

            // Accepting the dialog
            page.on('dialog', (dialog) => {
                dialog.accept();
            });

            await page.click(`#burger-btn`);
            await helpers.sleep(1000);

            



            let layerIsSetOffline = await page.evaluate(`$('[data-gc2-layer-key="public.test.the_geom"]').find('.js-set-online').prop('disabled')`);
            if (layerIsSetOffline === false) {
                await page.evaluate(`$('[data-gc2-layer-key="public.test.the_geom"]').find('.js-set-online').trigger('click')`);
                await helpers.sleep(1000);
            }










            await page.evaluate(`$('#layer-slide .close').trigger('click')`);
            await helpers.sleep(1000);

            // Selecting first already existing point on map and trying to edit it
            const markerPosition = await page.evaluate(`$('.leaflet-interactive').first().position()`);

            let mouse = page.mouse;
            await mouse.click(markerPosition.left + 10, markerPosition.top + 10);
            await helpers.sleep(500);
            await mouse.click(markerPosition.left + 10 - 24, markerPosition.top + 10 - 48);

            // Editing attributes of the selected feature
            await helpers.sleep(2000);
            await page.evaluate(`$('#root_id').val('111')`);
            await helpers.sleep(500);
	        await page.evaluate(`$('#editor-attr-dialog').find('[type="submit"]').trigger('click')`);
            await helpers.sleep(500);

            // Checking if the queue indicator shows that element was added to the queue
            await page.click(`#burger-btn`);
            await page.evaluate(`$('[data-parent="#layers"]').last().trigger('click')`);
            await helpers.sleep(4000);

            expect(await page.evaluate(`$('[class="btn btn-sm btn-secondary js-statistics-field js-rejectedByServer-update"]').is(':visible')`)).to.be.true;

            // Cleanup
            await page.evaluate(`$('.js-clear').trigger('click')`);
            await helpers.sleep(2000);
        });

        it('should put delete feature request to the queue', async () => {
	        let page = await browser.newPage();
            await page.goto(`${helpers.PAGE_URL}v:public.test`);
            await page.emulate(helpers.EMULATED_SCREEN);
            page = await helpers.waitForPageToLoad(page);

            // Accepting the dialog
            page.on("dialog", (dialog) => {
                dialog.accept();
            });

            await page.click(`#burger-btn`);
            await helpers.sleep(1000);

            let offlineModeIsForced = await page.evaluate(`$('.js-toggle-offline-mode').is(':checked')`);
            if (offlineModeIsForced) {
                await page.evaluate(`$('.toggle').trigger('click');`);
                await helpers.sleep(1000);
            }

            await page.evaluate(`$('#layer-slide .close').trigger('click')`);
            await helpers.sleep(1000);

            await page.evaluate(`$('[data-parent="#layers"]').last().trigger('click')`);
            await helpers.sleep(1000);
            await page.evaluate(`$('.js-clear').trigger('click')`);
            await helpers.sleep(2000);

            // Selecting first already existing point on map and deleting it
            const markerPosition = await page.evaluate(`$('.leaflet-interactive').first().position()`);
            let mouse = page.mouse;
            await mouse.click(markerPosition.left + 10, markerPosition.top + 10);
            await helpers.sleep(500);
            await mouse.click(markerPosition.left + 10 + 24, markerPosition.top + 10 - 48);

            // Checking if the queue indicator shows that element was added to the queue
            await helpers.sleep(10000);

            expect(await page.evaluate(`$('[class="btn btn-sm btn-secondary js-statistics-field js-rejectedByServer-delete"]').is(':visible')`)).to.be.true;

            // Cleanup
            await page.evaluate(`$('.js-clear').trigger('click')`);
            await helpers.sleep(2000);
        });
    });

    it('should react to Force offline mode setting', async () => {
        let page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL}v:public.test,public.test_poly`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        // Accepting the dialog
        page.on('dialog', (dialog) => {
            dialog.accept();
        });

        // Selecting point on map and open the attribute editing dialog
        await page.click(`#burger-btn`);
        await page.evaluate(`$('[data-parent="#layers"]').last().trigger('click')`);

        let offlineModeIsOn = await page.evaluate(`$('.js-toggle-offline-mode').is(':checked')`);
        if (offlineModeIsOn === false) {
            await page.evaluate(`$('.toggle').trigger('click');`);
        }

        let layerIsSetOffline = await page.evaluate(`$('[data-gc2-layer-key="public.test.the_geom"]').find('.js-set-online').prop('disabled')`);
        if (layerIsSetOffline) {
            await page.evaluate(`$('[data-gc2-layer-key="public.test.the_geom"]').find('.js-set-offline').trigger('click')`);
            await helpers.sleep(1000);
        }

        expect(await page.evaluate(`$('[data-gc2-layer-key="public.test.the_geom"]').find('.js-set-offline').prop('disabled')`)).to.be.true;

        await helpers.sleep(1000);

        await page.evaluate(`$('[data-gc2-key="public.test.the_geom"]').trigger('click')`);
        await page.click(`#map`);

        await helpers.sleep(1000);

        // Filling in attributes of the added feature
        await page.focus('#root_id');
        await page.keyboard.type('111');
        await page.focus('#root_stringfield');
        await page.keyboard.type('222');
        await page.evaluate(`$('#editor-attr-dialog').find('[type="submit"]').trigger('click')`);
        await helpers.sleep(4000);

        // Created feature is not rejected by server yet, so checking the failed indicator
        
        expect(await page.evaluate(`$('[class="btn btn-sm btn-secondary js-statistics-field js-failed-add"]').is(':visible')`)).to.be.true;
        expect(await page.evaluate(`$('[class="btn btn-sm btn-secondary js-statistics-field js-rejectedByServer-add"]').is(':visible')`)).to.be.false;

        await helpers.sleep(1000);

        await page.evaluate(`$('[data-gc2-layer-key="public.test.the_geom"]').find('.js-set-online').trigger('click')`);
	    await helpers.sleep(6000);

	    // Created feature is already rejected by server, so checking corresponding indicator
        expect(await page.evaluate(`$('[class="btn btn-sm btn-secondary js-statistics-field js-failed-add"]').is(':visible')`)).to.be.false;
        expect(await page.evaluate(`$('[class="btn btn-sm btn-secondary js-statistics-field js-rejectedByServer-add"]').is(':visible')`)).to.be.true;

        // Cleanup
        await page.evaluate(`$('.js-clear').trigger('click')`);
        await helpers.sleep(2000);
    });

    describe('should transform feature requests responses when offline', () => {});
    describe('should dispatch feature requests in correct order', () => {});
});
