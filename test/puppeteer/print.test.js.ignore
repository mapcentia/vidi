/**
 * Testing printing capabilities
 */

const { expect } = require("chai");
const helpers = require("./../helpers");

describe("Print", () => {
    it("should be able to print page as PDF", async () => {
        const page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL.replace('8082', '8081')}public.test_poly,v:public.test_line`);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        await page.evaluate(`$('#search-border').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('[href="#print-content"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('#print-btn').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('#start-print-btn').trigger('click')`);
        await helpers.sleep(20000);

        let disabled = await page.evaluate(`$('#get-print-fieldset').attr('disabled')`);
        let PDFLink = await page.evaluate(`$('#open-pdf').attr('href')`);
        expect(disabled === undefined || disabled === `undefined`).to.be.true;
        expect(PDFLink.indexOf(`.pdf`) !== -1).to.be.true;
    });
});
