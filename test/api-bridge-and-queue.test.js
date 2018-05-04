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

        let connectionCheckTries = 0;
        page.on("console", msg => {
            console.log("PAGE LOG:", msg.text())
        });

        await page.setRequestInterception(true);
        page.on('request', request => {
            if (request.url().indexOf('connection-check') !== -1) {
                connectionCheckTries++;
            }

            request.continue();
        });

        await page.goto("https://vidi.alexshumilov.ru/app/aleksandrshumilov/public/#osm/13/39.2963/-6.8335/", { waitUntil: 'networkidle2' });
        await timeout(10000);

        expect(connectionCheckTries > 2).to.be.true;
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
