process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function (config) {
    config.set({
        frameworks: ['mocha', 'chai'],
        files: ['test/**/*.test.js'],
        reporters: ['progress'],
        port: 9876,  // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless', 'ChromeHeadless_no_sandbox'],
        autoWatch: false,
        // singleRun: false, // Karma captures browsers, runs the tests and exits
        concurrency: Infinity,
        customLaunchers: {
            ChromeHeadless_no_sandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
            }
          }
    })
}