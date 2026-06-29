/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const genericPool = require("generic-pool");

const puppeteer = require('puppeteer');

const config = require('../config/config.js')

const puppeteerProcesses = {
    min: config?.puppeteerProcesses?.min ?? 0,
    max: config?.puppeteerProcesses?.max ?? 2,
    // Must be larger than a cold headless browser launch (the launch `timeout` below is
    // 10s) plus any time spent queueing when all browsers are borrowed. The old 500ms
    // value was below cold-launch time, so the first/cold acquire failed with the
    // misleading "ResourceRequest timed out".
    acquireTimeoutMillis: config?.puppeteerProcesses?.acquireTimeoutMillis ?? 30000,
};


// When set, launch this Chromium instead of puppeteer's bundled binary. Falls back
// to undefined (bundled) so local/dev keeps working unchanged. In Docker the bundled
// download is absent, so point this at the system chromium (e.g. /usr/bin/chromium)
// via the PUPPETEER_EXECUTABLE_PATH env var or config.puppeteerProcesses.executablePath.
const executablePath = config?.puppeteerProcesses?.executablePath || process.env.PUPPETEER_EXECUTABLE_PATH || undefined;

const startupParameters = {
    headless: true,
    timeout: 10000,
    ignoreHTTPSErrors: true,
    executablePath,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        // WebGL + SwiftShader
        '--use-gl=angle',
        '--use-angle=swiftshader-webgl',
        '--enable-unsafe-swiftshader',
        '--ignore-gpu-blocklist',
    ]
};

const pool = genericPool.createPool({
    create() {
        return puppeteer.launch(startupParameters);
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
    min: puppeteerProcesses.min,
    max: puppeteerProcesses.max,
    testOnBorrow: true,
    acquireTimeoutMillis: puppeteerProcesses.acquireTimeoutMillis, // Should be bigger than it takes to start a headless browser
    evictionRunIntervalMillis: 5000,
    numTestsPerEvictionRun: 3, // Default
    maxWaitingClients: 5,
    idleTimeoutMillis: 30000

})

// Surface the real factory errors. Without these listeners generic-pool swallows
// puppeteer.launch() failures and they only show up downstream as the misleading
// "ResourceRequest timed out" acquire error.
pool.on('factoryCreateError', (err) => {
    console.error("headlessBrowserPool: factoryCreateError (puppeteer.launch failed):", err && err.message ? err.message : err);
});
pool.on('factoryDestroyError', (err) => {
    console.error("headlessBrowserPool: factoryDestroyError (browser.close failed):", err && err.message ? err.message : err);
});

setInterval(() => {
    if (pool.size === pool.max) {
        let poolInfo = {
            "pool.max": pool.max,
            "pool.size": pool.size,
            "pool.available": pool.available,
            "pool.borrowed": pool.borrowed,
            "pool.pending": pool.pending,
            "pool.spareResourceCapacity": pool.spareResourceCapacity
        }
        console.log(poolInfo)
    }
}, 5000)

module.exports = {pool};
