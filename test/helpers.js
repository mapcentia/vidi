/**
 * Helper functions
 */

module.exports = {
    // @todo Independent development server has to be deployed in order to handle e2e tests
    API_URL: `https://vidi.alexshumilov.ru:8081/api`,
    PAGE_URL: `https://vidi.alexshumilov.ru:8081/app/aleksandrshumilov/public/#osm/13/39.2963/-6.8335/`,
    PAGE_LOAD_TIMEOUT: 10000,
    EMULATED_SCREEN: {
        viewport: {
        width: 1920,
            height: 1080
        },
        userAgent: 'Puppeteer'
    },
    sleep: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    duplicate: (target) => JSON.parse(JSON.stringify(target))
};