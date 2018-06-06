/**
 * Helper functions
 */

module.exports = {
    sleep: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    duplicate: (target) => JSON.parse(JSON.stringify(target))
};