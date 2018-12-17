/**
 * Testing application
 */

const { expect } = require("chai");
const helpers = require("./../helpers");

describe("Application", () => {
    it("should be able to launch if service workers are not available", async () => {
        let page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL_DEFAULT_NO_SSL}`);
        page = await helpers.waitForPageToLoad(page);
    });

    it("should be able to reset the application", async () => {
        let page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL_DEFAULT}test.polygon,public.urbanspatial_dar_es_salaam_luse_2002,public.test_poly,v:public.test,v:public.test_line`);
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
        expect(await page.evaluate(`$('#layers_list').find('.accordion-toggle').eq(2).text()`)).to.equal(`Dynamic load test`);
        expect(await page.evaluate(`$('#layers_list').find('.accordion-toggle').eq(3).text()`)).to.equal(`Public group`);

        // Change the base layer
        await page.evaluate(`$('[href="#baselayer-content"]').trigger('click');`);
        await helpers.sleep(1000);
        await page.evaluate(`$('[name="baselayers"][value="osm"]').trigger('click');`);
        await helpers.sleep(1000);

        // Change the zoom level
        const button = await page.$('#map');
        await button.click({ clickCount: 2 });
        await helpers.sleep(1000);

        // Click the reset button
        await page.click(`#btn-reset`);
        await helpers.sleep(4000);
        await page.evaluate(`$('[href="#collapseUHVibGljIGdyb3Vw"]').trigger('click')`);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('input[data-gc2-id="public.test"]').is(':checked')`)).to.be.false;

        // Check if the panel for different schema was drawn as well
        expect(await page.evaluate(`$('#layers_list').find('.accordion-toggle').eq(0).text()`)).to.equal(`Test group`);
        expect(await page.evaluate(`$('#layers_list').find('.accordion-toggle').eq(1).text()`)).to.equal(`Dar es Salaam Land Use and Informal Settlement Data Set`);
        expect(await page.evaluate(`$('#layers_list').find('.accordion-toggle').eq(2).text()`)).to.equal(`Dynamic load test`);
        expect(await page.evaluate(`$('#layers_list').find('.accordion-toggle').eq(3).text()`)).to.equal(`Public group`);

        expect(page.url()).to.have.string(`/app/aleksandrshumilov/public/#stamenTonerLite/10/39.2358/-6.8057/`);
    });

    it("should ignore invalid layer in URL", async () => {
        let page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL_DEFAULT}test.polygon,public.test_poly_invalid_layer,v:public.test_line`);
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
        await page.goto(`${helpers.PAGE_URL_DEFAULT}`);
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
