/**
 * Testing printing capabilities
 */

const { expect } = require("chai");
const helpers = require("./../helpers");

describe("Print", () => {
    it("should be able to print page as PDF multiple times", async () => {
        let page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL_DEFAULT}public.test_poly,v:public.test_line`);
        page = await helpers.waitForPageToLoad(page);

        await page.evaluate(`$('#search-border').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('[href="#print-content"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('#print-btn').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('#start-print-btn').trigger('click')`);
        await helpers.sleep(20000);

        let disabled = await page.evaluate(`$('#get-print-fieldset').attr('disabled')`);
        let firstPDFLink = await page.evaluate(`$('#open-pdf').attr('href')`);

        expect(disabled === undefined || disabled === `undefined`).to.be.true;
        expect(firstPDFLink.indexOf(`.pdf`) !== -1).to.be.true;

        await helpers.sleep(1000);
        await page.evaluate(`$('[href="#baselayer-content"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('[data-gc2-base-id="stamenTonerLite"] input').trigger('click')`);
        await helpers.sleep(1000);

        await page.evaluate(`$('[href="#print-content"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('#start-print-btn').trigger('click')`);
        await helpers.sleep(20000);

        let secondPDFLink = await page.evaluate(`$('#open-pdf').attr('href')`);
        expect(firstPDFLink && secondPDFLink && (firstPDFLink !== secondPDFLink)).to.be.true;
    });
});
