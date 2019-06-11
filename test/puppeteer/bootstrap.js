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

  let response = await axios.get(`http://gc2.mapcentia.com/api/v2/keyvalue/aleksandrshumilov`);
  //console.log(`Cleaning up key-value storage for gc2.mapcentia.com (aleksandrshumilov database): ${response.data.data.length} elements`);
  response.data.data.map(item => {
    axios.delete(`http://gc2.mapcentia.com/api/v2/keyvalue/aleksandrshumilov/${item.key}`);
  });
});

// close browser and reset global variables
afterEach(async () => {
  await browser.close();

  global.browser = globalVariables.browser;
  global.localforage = globalVariables.localforage;
  global.expect = globalVariables.expect;
});
