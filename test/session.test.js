/**
 * Testing Session extension
 */

const { expect } = require("chai");
const helpers = require("./helpers");

describe('Session', () => {
    it('should login with correct credentials', async () => {
        const page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL}v:public.test,public.test_poly`);
        await page.emulate(helpers.EMULATED_SCREEN);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        await page.evaluate(`$('.gc2-session-unlock').trigger('click')`);

        await helpers.sleep(1000);

        await page.focus('#sessionEmail');
        await page.keyboard.type('aleksandrshumilov');
        await page.focus('#sessionPassword');
        await page.keyboard.type('qewadszcx');
        await helpers.sleep(1000);
        await page.evaluate(`$('.login').find('[type="submit"]').trigger('click')`);

        await helpers.sleep(2000);

        expect(await page.evaluate(`$('#login-modal').find('.alert-success').is(':visible')`)).to.be.true;
        expect(await page.evaluate(`$('#login-modal').find('.alert-danger').is(':visible')`)).to.be.false;

        await page.evaluate(`$('.login').find('[type="submit"]').trigger('click')`);
    });

    it('should not login with invalid credentials', async () => {
        const page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL}v:public.test,public.test_poly`);
        await page.emulate(helpers.EMULATED_SCREEN);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        await page.evaluate(`$('.gc2-session-unlock').trigger('click')`);

        await helpers.sleep(1000);

        await page.focus('#sessionEmail');
        await page.keyboard.type('aleksandrshumilovWRONG');
        await page.focus('#sessionPassword');
        await page.keyboard.type('qewadszcxWRONG');
        await helpers.sleep(1000);
        await page.evaluate(`$('.login').find('[type="submit"]').trigger('click')`);

        await helpers.sleep(2000);

        expect(await page.evaluate(`$('#login-modal').find('.alert-success').is(':visible')`)).to.be.false;
        expect(await page.evaluate(`$('#login-modal').find('.alert-danger').is(':visible')`)).to.be.true;
    });
});
