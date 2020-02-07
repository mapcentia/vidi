/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const genericPool = require("generic-pool");

const puppeteer = require('puppeteer');

const startupParameters = {
    headless: true,
    timeout: 10000,
    ignoreHTTPSErrors: true,
    args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--enable-features=NetworkService",
        // "--use-gl=desktop",
    ],
    //userDataDir: '/tmp/chromeSession'
};

module.exports = {
    pool: genericPool.createPool({
        create() {
            return  puppeteer.launch(startupParameters);
        },
        destroy(browser) {
            return browser.close();
        },
        validate(browser) {
            return Promise.race([
                new Promise(res => setTimeout(() => res(false), 1500)),
                browser.version().then(_ => true).catch(_ => false)
            ])
        },
    }, {
        min: 2,
        max: 5,
        testOnBorrow: true,
        //acquireTimeoutMillis: 15000
    })
};