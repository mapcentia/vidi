/**
 * Keeping single instance of the headless browser
 */

const puppeteer = require('puppeteer');
let browser = false;
puppeteer.launch({
    headless: true,
    timeout: 10000,
    args: ["--no-sandbox", "--ignore-certificate-errors", "--enable-features=NetworkService"]
}).then(instance => {
    browser = instance;
});

const getBrowser = () => {
    return browser;
};

module.exports = {
    getBrowser
}
