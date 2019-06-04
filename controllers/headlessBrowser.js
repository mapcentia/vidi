/**
 * Keeping single instance of the headless browser and restarting the browser on every request in order to reset cache
 */

const puppeteer = require('puppeteer');

const startupParameters = {
    headless: true,
    timeout: 10000,
    args: ["--no-sandbox", "--ignore-certificate-errors", "--enable-features=NetworkService"]
};

let browser = false;
const getBrowser = () => {
    return new Promise((resolve, reject) => {
        if (browser) {
            browser.close().then(() => {
                puppeteer.launch(startupParameters).then(instance => {
                    browser = instance;
                    resolve(browser);
                }).catch(reject);
            }).catch(reject);
        } else {
            puppeteer.launch(startupParameters).then(instance => {
                browser = instance;
                resolve(browser);
            }).catch(reject);
        }
    });
};

module.exports = {
    getBrowser
}
