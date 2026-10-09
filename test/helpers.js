/**
 * Helper functions
 */
const sleepFunction = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// The tests run against a local Vidi (default http://127.0.0.1:3000) backed by a GC2 that holds
// the test database. Override with VIDI_TEST_URL and VIDI_TEST_DATABASE.
const BASE_URL = (process.env.VIDI_TEST_URL || `http://127.0.0.1:3000`).replace(/\/$/, ``);
const DATABASE = process.env.VIDI_TEST_DATABASE || `mydb`;
const PAGE_URL = `${BASE_URL}/app/${DATABASE}/public/#osm/13/39.2963/-6.8335/`;

module.exports = {
    API_URL: `${BASE_URL}/api`,
    // Base instance URL
    PAGE_URL_BASE: `${BASE_URL}/`,
    DATABASE,
    // Vidi instance with default template
    PAGE_URL_DEFAULT: PAGE_URL,
    // Vidi instance that works with newest backend
    PAGE_URL_LATEST_GC2: PAGE_URL,
    // Vidi instance with default template without SSL
    PAGE_URL_DEFAULT_NO_SSL: PAGE_URL,
    // Vidi instance with embedded template
    PAGE_URL_EMBEDDED: PAGE_URL,
    PAGE_LOAD_TIMEOUT: 1000,
    EMULATED_SCREEN: {
        viewport: {
        width: 1920,
            height: 1080
        },
        userAgent: 'Puppeteer'
    },
    sleep: sleepFunction,
    duplicate: (target) => JSON.parse(JSON.stringify(target)),
    waitForPageToLoad: async (page) => {
        let loadedPage = new Promise((resolve, reject) => {
            page.on('console', async (msg) => {
                //console.log(msg.text());
                if (msg.text().indexOf(`Vidi is now loaded`) !== -1) {
                    await sleepFunction(1000);
                    resolve(page);
                } else if (msg.text().indexOf(`Limit of connection check attempts exceeded`) !== -1) {
                    reject(new Error(`Unable to load the page`));
                }
            });
        });
    
        return await loadedPage;
    },
    img: async (page, path = `./test.png`) => {
        await page.screenshot({ path });
    }
};
