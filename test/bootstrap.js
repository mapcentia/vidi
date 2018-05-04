const puppeteer = require("puppeteer");
const localforage = require("localforage");
const { expect } = require("chai");
const _ = require("lodash");
const globalVariables = _.pick(global, ["browser", "expect", "localforage"]);

// puppeteer options
const opts = {
  headless: true,
  slowMo: 100,
  timeout: 10000,
  args: ["--no-sandbox"]
};

// expose variables
before(async function() {
  global.expect = expect;
  global.localforage = localforage;
  global.browser = await puppeteer.launch(opts);
});

// close browser and reset global variables
after(function() {
  browser.close();

  global.browser = globalVariables.browser;
  global.localforage = globalVariables.localforage;
  global.expect = globalVariables.expect;
});
