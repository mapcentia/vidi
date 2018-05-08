/**
 * Testing APIBridge and Queue classes
 */

const { expect } = require("chai");

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

describe("API Bridge and Queue", () => {
    it("should constantly check for connection status", async () => {
        const page = await browser.newPage();
        const client = await page.target().createCDPSession();

        let connectionCheckTries = 0;
        page.on("console", msg => {
            console.log("PAGE LOG:", msg.text());
            if (['log', 'info', 'debug'].indexOf(msg.type()) === -1) {
                console.log("ARGS:", msg.args());
            }
        });

        await client.send('ServiceWorker.enable');
        await client.on('Log.entryAdded', (message) => console.log('Log.entryAdded', message));
        await client.on('ServiceWorker.workerErrorReported', (event) => console.log('ServiceWorker.workerErrorReported'));
        await client.on('ServiceWorker.workerVersionUpdated', (event) => console.log('ServiceWorker.workerVersionUpdated'));

        await page.goto("https://vidi.alexshumilov.ru/app/aleksandrshumilov/public/#osm/13/39.2963/-6.8335/", { waitUntil: 'networkidle2' });
        await timeout(6000);
        await page.click(`[href="#layer-content"]`);

        const onlineBadgeClassAttribute = await page.$eval('.js-app-is-online-badge', e => e.getAttribute('class'));
        const offlineBadgeClassAttribute = await page.$eval('.js-app-is-offline-badge', e => e.getAttribute('class'));

        expect(onlineBadgeClassAttribute.indexOf('hidden') === -1).to.be.true;
        expect(offlineBadgeClassAttribute.indexOf('hidden') !== -1).to.be.true;
    });

    describe('should update features', () => {});
    describe('should delete features', () => {});
    describe('should add features', () => {});
    describe('should store unsuccessfull requests in internal queue', () => {});
    describe('should transform feature requests responses when offline', () => {});
    describe('should react to Force offline mode setting', () => {});
    describe('should dispatch feature requests in correct order', () => {});
    describe('should cleanup requests depending on their order', () => {});
});
