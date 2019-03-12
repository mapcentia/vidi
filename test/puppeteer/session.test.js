/**
 * Testing Session extension
 */

const { expect } = require("chai");
const helpers = require("./../helpers");

describe('Session', () => {
    it('should login with correct credentials', async () => {
        let page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL_DEFAULT}v:public.test,public.test_poly`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

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
        let page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL_DEFAULT}v:public.test,public.test_poly`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

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

    it('should gain access to protected layers and route protected tile requests through the WMS proxy', async () => {
        let page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL_DEFAULT.replace(`/public/`, `/test/`)}`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        await page.evaluate(`$('[href="#layer-content"]').trigger('click')`);
        await page.evaluate(`$('[href="#collapseVGVzdCBncm91cA"]').trigger('click')`);
        await helpers.sleep(1000);
        expect(await page.evaluate(`$('[data-gc2-layer-key="test.polygon_private.the_geom"]').find('.check').length`)).to.equal(0);
        await helpers.sleep(1000);

        await page.evaluate(`$('.gc2-session-unlock').trigger('click')`);

        await helpers.sleep(1000);

        await page.focus('#sessionEmail');
        await page.keyboard.type('aleksandrshumilov');
        await page.focus('#sessionPassword');
        await page.keyboard.type('qewadszcx');
        await helpers.sleep(1000);
        await page.evaluate(`$('.login').find('[type="submit"]').trigger('click')`);

        await helpers.sleep(1000);
        await page.evaluate(`$('#login-modal').find('.close').trigger('click')`);
        await helpers.sleep(2000);
        await page.evaluate(`$('[href="#layer-content"]').trigger('click')`);
        await page.evaluate(`$('[href="#collapseVGVzdCBncm91cA"]').trigger('click')`);

        let tileProxyWasRequested = false;
        await page.setRequestInterception(true);
        page.on('request', request => {
            if (request.url().indexOf(`api/tileRequestProxy?request=`) > -1) {
                tileProxyWasRequested = true;
            }

            request.continue();
        });

        let tileProxyResponseCode = false;
        page.on('response', async(response) => {
            if (response.url().indexOf(`api/tileRequestProxy?request=`) > -1) {
                tileProxyResponseCode = response.status();
            }
        });

        await helpers.sleep(1000);
        await page.evaluate(`$('[data-gc2-layer-key="test.polygon_private.the_geom"]').find('.check').trigger('click')`);
        await helpers.sleep(1000);

        expect(tileProxyWasRequested).to.be.true;
        expect(tileProxyResponseCode).to.equal(200);
    });
});
