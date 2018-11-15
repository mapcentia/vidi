/**
 * Helper functions
 */
const sleepFunction = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports = {
    // @todo Independent development server has to be deployed in order to handle e2e tests
    API_URL: `https://vidi.alexshumilov.ru:8081/api`,
    // Deployment with default template
    PAGE_URL_DEFAULT: `https://vidi.alexshumilov.ru/app/aleksandrshumilov/public/#osm/13/39.2963/-6.8335/`,
    // Deployment with embedded template
    PAGE_URL_EMBEDDED: `https://vidi.alexshumilov.ru:8082/app/aleksandrshumilov/public/#osm/13/39.2963/-6.8335/`,
    // @todo Remove obsolete constant
    PAGE_URL: `https://vidi.alexshumilov.ru:8082/app/aleksandrshumilov/public/#osm/13/39.2963/-6.8335/`,
    PAGE_URL_BASE: `https://vidi.alexshumilov.ru/`,
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
                console.log(msg.text());
                if (msg.text().indexOf(`Vidi is now loaded`) !== -1) {
                    await sleepFunction(1000);
                    resolve(page);
                } else if (msg.text().indexOf(`Limit of connection check attempts exceeded`) !== -1) {
                    reject(`Unable to load the page`);
                }
            });
        });
    
        return await loadedPage;
    }
};