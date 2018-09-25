/**
 * Helper functions
 */
const sleepFunction = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports = {
    // @todo Independent development server has to be deployed in order to handle e2e tests
    API_URL: `https://vidi.alexshumilov.ru:8081/api`,
    //PAGE_URL: `https://vidi.alexshumilov.ru:8082/app/aleksandrshumilov/public/#osm/13/39.2963/-6.8335/`,
    PAGE_URL: `https://vidi.alexshumilov.ru/app/aleksandrshumilov/public/#osm/13/39.2963/-6.8335/`,
    PAGE_URL_BASE: `https://vidi.alexshumilov.ru:8082/`,
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
                }
            });
        });
    
        return await loadedPage;
    }
};