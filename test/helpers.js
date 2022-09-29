/**
 * Helper functions
 */
const sleepFunction = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports = {
    API_URL: `http://127.0.0.1:3000/api`,
    // Base instance URL
    PAGE_URL_BASE: `http://127.0.0.1:3000/`,
    // Vidi instance with default template
    PAGE_URL_DEFAULT: `https://vidi.swarm.gc2.io/app/demo/workshop/#osm/9/8.4348/55.9177/`,
    // Vidi instance that works with newest backend (swarm.gc2.io testing:aDvvi9802dmosd)
    PAGE_URL_LATEST_GC2: `https://vidi.swarm.gc2.io/app/demo/workshop/#osm/9/8.4348/55.9177/`,
    // Vidi instance with default template without SSL
    PAGE_URL_DEFAULT_NO_SSL: `http://vidi.swarm.gc2.io/app/demo/workshop/#osm/9/8.4348/55.9177/`,
    // Vidi instance with embedded template
    PAGE_URL_EMBEDDED: `https://vidi.swarm.gc2.io/app/demo/workshop/?tmpl=embed.tmpl#osm/9/8.4348/55.9177/`,
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
