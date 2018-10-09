/**
 * Testing application
 */

const { expect } = require("chai");
const helpers = require("./../helpers");

describe("Application", () => {
    it("should constantly check for connection status and keep Force offline mode selector updated", async () => {
        let page = await browser.newPage();
        await page.goto(helpers.PAGE_URL);
        page = await helpers.waitForPageToLoad(page);

        await page.click(`#burger-btn`);
        await helpers.sleep(3000);
        await page.screenshot({ path: './test.png' });
        expect(await page.evaluate(`$('.js-app-is-online-badge').hasClass('hidden');`)).to.be.false;
        expect(await page.evaluate(`$('.js-app-is-offline-badge').hasClass('hidden');`)).to.be.true;

        let forceOfflineModeIndicator;
        forceOfflineModeIndicator = await page.evaluate(`$('.js-toggle-offline-mode').is(':checked')`);
        expect(forceOfflineModeIndicator).to.be.false;

        await page.evaluate(`$('.js-toggle-offline-mode').parent().find('.toggle').trigger('click')`);

        forceOfflineModeIndicator = await page.evaluate(`$('.js-toggle-offline-mode').is(':checked')`);
        expect(forceOfflineModeIndicator).to.be.true;
    });

    it("should be able to reset the application", async () => {
        let page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL.replace('8082', '8081')}test.polygon,public.urbanspatial_dar_es_salaam_luse_2002,public.test_poly,v:public.test,v:public.test_line`);
        page = await helpers.waitForPageToLoad(page);

        // Accepting the dialog
        page.on('dialog', (dialog) => {
            dialog.accept();
        });

        await page.evaluate(`$('[class="floatRight cursorPointer fa fa-reorder"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('[href="#layer-content"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('[href="#collapseUHVibGljIGdyb3Vw"]').trigger('click')`);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('input[data-gc2-id="test.polygon"]').is(':checked')`)).to.be.true;
        expect(await page.evaluate(`$('input[data-gc2-id="public.test"]').is(':checked')`)).to.be.true;

        // Check if the panel for different schema was drawn as well
        expect(await page.evaluate(`$('#layers_list').find('.accordion-toggle').eq(0).text()`)).to.equal(`Test group`);
        expect(await page.evaluate(`$('#layers_list').find('.accordion-toggle').eq(1).text()`)).to.equal(`Dar es Salaam Land Use and Informal Settlement Data Set`);
        expect(await page.evaluate(`$('#layers_list').find('.accordion-toggle').eq(2).text()`)).to.equal(`Public group`);

        // Click the reset button
        await page.click(`#btn-reset`);
        await helpers.sleep(4000);
        await page.evaluate(`$('[href="#collapseUHVibGljIGdyb3Vw"]').trigger('click')`);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('input[data-gc2-id="public.test"]').is(':checked')`)).to.be.false;

        // Check if the panel for different schema was drawn as well
        expect(await page.evaluate(`$('#layers_list').find('.accordion-toggle').eq(0).text()`)).to.equal(`Test group`);
        expect(await page.evaluate(`$('#layers_list').find('.accordion-toggle').eq(1).text()`)).to.equal(`Dar es Salaam Land Use and Informal Settlement Data Set`);
        expect(await page.evaluate(`$('#layers_list').find('.accordion-toggle').eq(2).text()`)).to.equal(`Public group`);

        expect(page.url()).to.equal(`https://vidi.alexshumilov.ru:8081/app/aleksandrshumilov/public/#stamenTonerLite/0/39.2963/-6.8335/`);
    });

    it("should ignore invalid layer in URL", async () => {
        let page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL.replace('8082', '8081')}test.polygon,public.test_poly_invalid_layer,v:public.test_line`);
        page = await helpers.waitForPageToLoad(page);

        // Accepting the dialog
        page.on('dialog', (dialog) => {
            dialog.accept();
        });

        await page.evaluate(`$('[class="floatRight cursorPointer fa fa-reorder"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('[href="#layer-content"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('[href="#collapseUHVibGljIGdyb3Vw"]').trigger('click')`);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('input[data-gc2-id="test.polygon"]').is(':checked')`)).to.be.true;
        expect(await page.evaluate(`$('input[data-gc2-id="public.test_line"]').is(':checked')`)).to.be.true;
    });

    it("should update coordinates upon map changes", async () => {
        let page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL.replace('8082', '8081')}`);
        page = await helpers.waitForPageToLoad(page);

        await page.evaluate(`$('[class="floatRight cursorPointer fa fa-reorder"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('[href="#coordinates-content"]').trigger('click')`);
        await helpers.sleep(1000);

        let initialCoordinates = await page.evaluate(`$('#coordinates').find('h3').eq(1).next().html()`);

        await helpers.sleep(1000);
        await page.mouse.move(50, 50);
        await page.mouse.down();
        await page.mouse.move(100, 100);
        await page.mouse.up();
        await helpers.sleep(1000);
        await page.mouse.move(200, 200);

        await helpers.sleep(1000);

        let updatedCoordinates = await page.evaluate(`$('#coordinates').find('h3').eq(1).next().html()`);

        expect(initialCoordinates === updatedCoordinates).to.be.false;
    });
});
