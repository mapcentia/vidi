const puppeteer = require("puppeteer");
const axios = require("axios");
const localforage = require("localforage");
const { expect } = require("chai");
const _ = require("lodash");
const globalVariables = _.pick(global, ["browser", "expect", "localforage"]);
const helpers = require('../helpers');

// puppeteer options
const opts = {
    headless: true,
    timeout: 10000,
    args: ["--no-sandbox"]
};

// expose variables
beforeEach(async () => {
    global.expect = expect;
    global.localforage = localforage;
    global.browser = await puppeteer.launch(opts);
    let response = await axios.get(`https://swarm.gc2.io/api/v2/keyvalue/aleksandrshumilov`);
    response.data.data.map(item => {
        axios.delete(`http://swarm.gc2.io/api/v2/keyvalue/aleksandrshumilov/${item.key}`);
    });
});

// close browser and reset global variables
afterEach(async () => {
    await browser.close();

    global.browser = globalVariables.browser;
    global.localforage = globalVariables.localforage;
    global.expect = globalVariables.expect;
});
