/**
 * Testing application
 */

const { expect } = require("chai");
const helpers = require("./../helpers");

describe("Application", () => {
    it("should constantly check for connection status and keep Force offline mode selector updated", async () => {
        const page = await browser.newPage();
        await page.goto(helpers.PAGE_URL);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);
        await page.reload();
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        expect(await page.evaluate(`$('.js-app-is-online-badge').hasClass('hidden');`)).to.be.false;
        expect(await page.evaluate(`$('.js-app-is-offline-badge').hasClass('hidden');`)).to.be.true;

        let forceOfflineModeIndicator;
        forceOfflineModeIndicator = await page.evaluate(`$('.js-toggle-offline-mode').is(':checked')`);
        expect(forceOfflineModeIndicator).to.be.false;

        await page.evaluate(`$('.js-toggle-offline-mode').parent().find('.toggle').trigger('click')`);

        forceOfflineModeIndicator = await page.evaluate(`$('.js-toggle-offline-mode').is(':checked')`);
        expect(forceOfflineModeIndicator).to.be.true;

        /*
        // @todo Enable logging in separate function
        page.on("console", msg => {
            console.log("PAGE LOG:", msg.text());
            if (['log', 'info', 'debug'].indexOf(msg.type()) === -1) {
                console.log("ARGS:", msg.args());
            }
        });

        await page.screenshot({ path: 'test.png' });
        */

        // @todo Check the indicator change when app goes offline
        /*
        await page._client.send('Network.enable');
        await page._client.on('Network.requestWillBeSent', event => {
            console.log('Network.requestWillBeSent', event.requestId, event.request.url);
        });
        await page._client.on('Network.loadingFinished', event => {
            console.log('Network.loadingFinished', event.requestId);
        });

        await page._client.send('Network.emulateNetworkConditions', {
            offline: true,
            latency: 100,
            downloadThroughput: 0,
            uploadThroughput: 0
        });

        await page.evaluate(`$.getJSON('https://jsonplaceholder.typicode.com/posts/1', function() {
            console.log("success");
        }).done(function() {
            console.log("second success" );
        }).fail(function() {
            console.log("error");
        }).always(function() {
            console.log("complete");
        });`);

        await timeout(10000);
        */
    });
});
