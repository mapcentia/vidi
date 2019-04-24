/**
 * Testing layerTree module
 */

const { expect } = require("chai");
const helpers = require("./../../helpers");

const PAGE_URL = `${helpers.PAGE_URL_BASE}app/aleksandrshumilov/test/#stamenTonerLite/13/39.2681/-6.8108/`;

const createPage = async (layerName = `test.testpointfilters`) => {
    let url = PAGE_URL + `v:` + layerName;
    let page = await browser.newPage();
    await page.emulate(helpers.EMULATED_SCREEN);
    await page.goto(url, { timeout: 0 });
    page = await helpers.waitForPageToLoad(page);

    await page._client.send('Network.enable');

    await page.evaluate(`$('[href="#layer-content"]').trigger('click')`);
    await helpers.sleep(1000);
    await page.evaluate(`$('[href="#collapseUHVwcGV0ZWVyIHRlc3Rpbmcgb25seQ"]').trigger('click')`);
    await helpers.sleep(1000);
    await page.evaluate(`$('[data-gc2-layer-key="${layerName}.the_geom"]').find('.js-toggle-filters').trigger('click')`);
    await helpers.sleep(1000);

    return page;
};

const setTextFilterValue = async (page, field, expression, value, index = 0, submit = true, layer = `testpointfilters`) => {
    await page.select(`select[id="column_select_${layer}.test_${index}"]`, field);
    await helpers.sleep(500);
    await page.select(`select[id="expression_select_${layer}.test_${index}"]`, expression);
    await helpers.sleep(500);
    await page.type(`[id="expression_input_${layer}.test_${index}"]`, value);
    await helpers.sleep(500);

    if (submit) {
        await page.evaluate(`$('[id="layer-settings-filters-test.${layer}"').find('[class="btn btn-sm btn-success"]').trigger('click')`);
        await helpers.sleep(2000);
    }
};

const setBooleanFilterValue = async (page, field, expression, value, index = 0) => {
    await page.select(`select[id="column_select_testpointfilters.test_${index}"]`, field);
    await helpers.sleep(500);
    await page.select(`select[id="expression_select_testpointfilters.test_${index}"]`, expression);
    await helpers.sleep(500);
    await page.evaluate(`$('[id="expression_input_testpointfilters.test_${index}"][value="${value}"]').trigger('click')`);
    await helpers.sleep(500);
    await page.evaluate(`$('[id="layer-settings-filters-test.testpointfilters"').find('[class="btn btn-sm btn-success"]').trigger('click')`);
    await helpers.sleep(2000);
};

const setDateFilterValue = async (page, field, expression, value, index = 0) => {
    await page.select(`select[id="column_select_testpointfilters.test_${index}"]`, field);
    await helpers.sleep(500);
    await page.select(`select[id="expression_select_testpointfilters.test_${index}"]`, expression);
    await helpers.sleep(500);
    await page.evaluate(`$('[id="expression_input_testpointfilters.test_${index}"]').val('${value}')`);
    await helpers.sleep(500);

    await page.evaluate(`var event = new Event('input', { bubbles: true });
var target = $('[id="expression_input_testpointfilters.test_${index}"]')[0];
var lastValue = target.value;
target.value = '${value}';
target.dispatchEvent(event);
reactTriggerChange(target);`);

    await page.evaluate(`$('[id="layer-settings-filters-test.testpointfilters"').find('[class="btn btn-sm btn-success"]').trigger('click')`);
    await helpers.sleep(2000);
};

const disablePredefinedFilters = async (page) => {
    // Turn off the predefined filter
    await page.evaluate(`$('[id="layer-settings-filters-test.testpointfilters"]').find('.js-predefined-filters').find('input').trigger('click')`);
    await helpers.sleep(2000);

    // Switch to arbitrary filters tab
    await page.evaluate(`$($('[id="layer-settings-filters-test.testpointfilters"]').find('.btn-group')[2]).find('button').trigger('click')`);
    await helpers.sleep(2000);
}

describe('Layer tree filters', () => {
    it('should apply preset filters', async () => {
        let page = await createPage(`test.testpresetpointfilters`);

        let numberOfFilteredItems = false;
        page.on(`response`, async response => {
            if (response.url().indexOf(`/api/sql/aleksandrshumilov`) !== -1) {
                let parsedResponse = await response.json();
                numberOfFilteredItems = parsedResponse.features.length;
            }
        });

        await helpers.sleep(1000);

        expect(await page.evaluate(`document.getElementById('column_select_testpresetpointfilters.test_0').value`)).to.equal(`id`);
        expect(await page.evaluate(`document.getElementById('expression_select_testpresetpointfilters.test_0').value`)).to.equal(`>`);
        expect(await page.evaluate(`document.getElementById('expression_input_testpresetpointfilters.test_0').value`)).to.equal(``);

        expect(await page.evaluate(`document.getElementById('column_select_testpresetpointfilters.test_1').value`)).to.equal(`stringfield`);
        expect(await page.evaluate(`document.getElementById('expression_select_testpresetpointfilters.test_1').value`)).to.equal(`=`);
        expect(await page.evaluate(`document.getElementById('expression_input_testpresetpointfilters.test_1').value`)).to.equal(``);

        await helpers.sleep(1000);

        await setTextFilterValue(page, `id`, `>`, `2`, 0, false, `testpresetpointfilters`);
        await setTextFilterValue(page, `stringfield`, `=`, `def`, 1, true, `testpresetpointfilters`);

        await helpers.img(page);
        await helpers.sleep(2000);

        expect(numberOfFilteredItems).to.equal(2);
    });

    it('should store arbitrary filters values after reload and in the state snapshot', async () => {
        let page = await createPage();

        // Accepting the dialog
        page.on('dialog', (dialog) => {
            dialog.accept();
        });

        let numberOfFilteredItems = false;
        page.on(`response`, async response => {
            if (response.url().indexOf(`/api/sql/aleksandrshumilov`) !== -1) {
                let parsedResponse = await response.json();
                numberOfFilteredItems = parsedResponse.features.length;
            }
        });

        await disablePredefinedFilters(page);
        await helpers.img(page);

        await helpers.sleep(2000);
        expect(numberOfFilteredItems).to.equal(7);

        await setTextFilterValue(page, `stringfield`, `like`, `abc`, 0, false);
        expect(await page.evaluate(`$('[id="layer-settings-filters-test.testpointfilters"').find('[class="btn btn-sm"]').first().trigger('click')`));
        await setTextFilterValue(page, `decimalfield`, `=`, `1.4`, 1);
        expect(numberOfFilteredItems).to.equal(4);

        await page.click(`[href="#state-snapshots-content"]`);
        await helpers.sleep(1000);

        // Create state snapshot
        await page.type(`.js-browser-owned input`, `test snapshot title`);
        await helpers.sleep(2000);
        await page.evaluate(`$('.js-browser-owned').find('button').first().trigger('click')`);
        await helpers.sleep(3000);

        // Reload page
        await page.reload();
        await helpers.sleep(5000);

        // Checking if filters are after reload
        expect(numberOfFilteredItems).to.equal(4);
        await helpers.sleep(1000);

        // Checking if reset drops filters
        await page.click(`#btn-reset`);
        await helpers.sleep(2000);
        await page.evaluate(`$('[href="#layer-content"]').trigger('click')`);
        await helpers.sleep(2000);
        await page.evaluate(`$('[href="#collapseUHVwcGV0ZWVyIHRlc3Rpbmcgb25seQ"]').trigger('click')`);
        await helpers.sleep(2000);
        await page.evaluate(`$('[data-gc2-id="test.testpointfilters"]').first().trigger('click')`);
        await helpers.sleep(2000);


        await disablePredefinedFilters(page);

        expect(numberOfFilteredItems).to.equal(7);

        // Restore snapshot
        await page.click(`[href="#state-snapshots-content"]`);   
        await helpers.sleep(1000);
        
        await page.evaluate(`$('#state-snapshots').find('.panel-default').eq(0).find('button').first().trigger('click')`);
        await helpers.sleep(2000);

        expect(numberOfFilteredItems).to.equal(4);

        await page.close();
    });

    it('should store predefined filters values after reload and in the state snapshot for vector layer', async () => {
        let page = await createPage();

        // Accepting the dialog
        page.on('dialog', (dialog) => {
            dialog.accept();
        });

        let numberOfFilteredItems = false;
        page.on(`response`, async response => {
            if (response.url().indexOf(`/api/sql/aleksandrshumilov`) !== -1) {
                let parsedResponse = await response.json();
                numberOfFilteredItems = parsedResponse.features.length;
            }
        });

        await page.evaluate(`$('[id="layer-settings-filters-test.testpointfilters"').find('.js-predefined-filters').find('input').trigger('click')`);
        await helpers.sleep(2000);
        expect(numberOfFilteredItems).to.equal(7);

        await page.click(`[href="#state-snapshots-content"]`);   
        await helpers.sleep(1000);

        // Create state snapshot
        await page.type(`.js-browser-owned input`, `test snapshot title`);
        await helpers.sleep(2000);
        await page.evaluate(`$('.js-browser-owned').find('button').first().trigger('click')`);
        await helpers.sleep(3000);

        // Reload page
        await page.reload();
        await helpers.sleep(5000);

        // Checking if filters are after reload
        expect(numberOfFilteredItems).to.equal(7);
        await helpers.sleep(1000);

        // Checking if reset drops filters
        await page.click(`#btn-reset`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#search-border').trigger('click')`);
        await helpers.sleep(500);
        await page.evaluate(`$('[href="#layer-content"]').trigger('click')`);
        await helpers.sleep(500);
        await page.evaluate(`$('[href="#collapseUHVwcGV0ZWVyIHRlc3Rpbmcgb25seQ"]').trigger('click')`);
        await helpers.sleep(500);
        await page.evaluate(`$('[data-gc2-id="test.testpointfilters"]').first().trigger('click')`);
        await helpers.sleep(2000);
        expect(numberOfFilteredItems).to.equal(2);
        expect(await page.evaluate(`$('[id="layer-settings-filters-test.testpointfilters"').find('.js-predefined-filters').find('input').is(':checked')`)).to.be.true;

        // Restore snapshot
        await page.evaluate(`$('#search-border').trigger('click')`);
        await helpers.sleep(500);
        await page.click(`[href="#state-snapshots-content"]`);   
        await helpers.sleep(1000);
        await page.evaluate(`$('#state-snapshots').find('.panel-default').eq(0).find('button').first().trigger('click')`);
        await helpers.sleep(2000);
        expect(numberOfFilteredItems).to.equal(7);
        expect(await page.evaluate(`$('[id="layer-settings-filters-test.testpointfilters"').find('.js-predefined-filters').find('input').is(':checked')`)).to.be.false;
        await page.close();
    });

    it('should apply predefined filters for vector layers', async () => {
        let page = await createPage();

        // Accepting the dialog
        page.on('dialog', (dialog) => {
            dialog.accept();
        });

        let numberOfFilteredItems = false;
        page.on(`response`, async response => {
            if (response.url().indexOf(`/api/sql/aleksandrshumilov`) !== -1) {
                let parsedResponse = await response.json();
                numberOfFilteredItems = parsedResponse.features.length;
            }
        });

        await page.evaluate(`$('[id="layer-settings-filters-test.testpointfilters"').find('.js-predefined-filters').find('input').trigger('click')`);
        await helpers.sleep(2000);
        expect(numberOfFilteredItems).to.equal(7);

        await page.evaluate(`$('[id="layer-settings-filters-test.testpointfilters"').find('.js-predefined-filters').find('input').trigger('click')`);
        await helpers.sleep(2000);
        expect(numberOfFilteredItems).to.equal(2);
 
        await page.evaluate(`$('[id="layer-settings-filters-test.testpointfilters"').find('.js-predefined-filters').find('input').trigger('click')`);
        await helpers.sleep(2000);
        expect(numberOfFilteredItems).to.equal(7);

        await page.close();
    });

    it('should store predefined and arbitrary filters values after reload for tile layer', async () => {
        let page = await createPage();

        // Accepting the dialog
        page.on('dialog', (dialog) => {
            dialog.accept();
        });

        let filtersString = false;

        await page.setRequestInterception(true);
        page.on('request', request => {
            if (request.url().indexOf(`format=image`) > -1) {
                filtersString = false;
                request.url().split(`?`)[1].split(`&`).map(item => {
                    if (item.split(`=`)[0] === `filters`) {
                        filtersString = JSON.parse(decodeURIComponent(item.replace(`filters=`, ``)));
                    }
                });
            }

            request.continue();
        });

        await helpers.sleep(500);   
        await page.evaluate(`$('[href="#collapseVGVzdCBncm91cA"]').trigger('click')`);
        await helpers.sleep(500);
        await page.evaluate(`$('input[type="checkbox"][data-gc2-id="test.polygon"][class="js-show-layer-control"]').trigger('click')`);
        await helpers.sleep(2000);

        expect(filtersString[`test.polygon`][0]).to.equal(`id = 2`);

        await page.evaluate(`$('[data-gc2-layer-key="test.polygon.the_geom"]').find('.js-toggle-filters').trigger('click')`);
        await helpers.sleep(500);
        await page.evaluate(`$('[id="layer-settings-filters-test.polygon"').find('.js-predefined-filters').find('input').trigger('click')`);
        await helpers.sleep(4000);
        expect(filtersString).to.equal(false);

        await page.evaluate(`$($('[id="layer-settings-filters-test.polygon"').find('.btn-group')[2]).find('button').trigger('click')`);
        await helpers.sleep(1000);
        await setTextFilterValue(page, `id`, `=`, `1`, 0, true, `polygon`);
        await helpers.sleep(1000);

        await page.click(`[href="#state-snapshots-content"]`);   
        await helpers.sleep(1000);

        // Create state snapshot
        await page.type(`.js-browser-owned input`, `test snapshot title`);
        await helpers.sleep(2000);
        await page.evaluate(`$('.js-browser-owned').find('button').first().trigger('click')`);
        await helpers.sleep(3000);

        // Checking if reset drops filters
        await page.click(`#btn-reset`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#search-border').trigger('click')`);
        await helpers.sleep(500);
        await page.evaluate(`$('[href="#layer-content"]').trigger('click')`);
        await helpers.sleep(500);
        await page.evaluate(`$('[href="#collapseVGVzdCBncm91cA"]').trigger('click')`);
        await helpers.sleep(500);
        await page.evaluate(`$('[data-gc2-id="test.polygon"]').first().trigger('click')`);
        await helpers.sleep(2000);
        expect(await page.evaluate(`$('[id="layer-settings-filters-test.polygon"').find('.js-predefined-filters').find('input').is(':checked')`)).to.be.true;
        expect(filtersString[`test.polygon`].length).to.equal(1);

        // Restore snapshot
        await page.evaluate(`$('#search-border').trigger('click')`);
        await helpers.sleep(500);
        await page.click(`[href="#state-snapshots-content"]`);   
        await helpers.sleep(1000);
        await page.evaluate(`$('#state-snapshots').find('.panel-default').eq(0).find('button').first().trigger('click')`);
        await helpers.sleep(2000);
        expect(filtersString[`test.polygon`][0]).to.equal(`(id = 1)`);
        expect(await page.evaluate(`$('[id="layer-settings-filters-test.polygon"').find('.js-predefined-filters').find('input').is(':checked')`)).to.be.false;

        await page.close();
    });

    it('should allow AND / OR modes for arbitrary filtering, as well as adding and deleting rules', async () => {
        let page = await createPage();

        let numberOfFilteredItems = false;
        page.on(`response`, async response => {
            if (response.url().indexOf(`/api/sql/aleksandrshumilov`) !== -1) {
                let parsedResponse = await response.json();
                numberOfFilteredItems = parsedResponse.features.length;
            }
        });

        await disablePredefinedFilters(page);

        await setTextFilterValue(page, `stringfield`, `like`, `abc`, 0, false);
        expect(await page.evaluate(`$('[id="layer-settings-filters-test.testpointfilters"').find('[class="btn btn-sm"]').first().trigger('click')`));
        await setTextFilterValue(page, `decimalfield`, `=`, `1.4`, 1);

        expect(numberOfFilteredItems).to.equal(4);
        
        await page.select(`select[id="match_select_testpointfilters.test"]`, `all`);
        await helpers.sleep(500);
        await page.evaluate(`$('[id="layer-settings-filters-test.testpointfilters"').find('[class="btn btn-sm btn-success"]').trigger('click')`);
        await helpers.sleep(2000);

        expect(numberOfFilteredItems).to.equal(1);

        await page.evaluate(`$('[id="layer-settings-filters-test.testpointfilters"').find('[class="btn btn-xs btn-warning"]').first().trigger('click')`);
        await page.evaluate(`$('[id="layer-settings-filters-test.testpointfilters"').find('[class="btn btn-sm btn-success"]').trigger('click')`);
        await helpers.sleep(2000);

        expect(numberOfFilteredItems).to.equal(2);

        // Testing the Disable button
        await page.evaluate(`$('[id="layer-settings-filters-test.testpointfilters"').find('.fa-eraser').parent().first().trigger('click')`);
        await helpers.sleep(2000);

        expect(numberOfFilteredItems).to.equal(7);

        await page.close();
    });

    it('should enable Apply button accordingly to rules validity', async () => {
        let page = await createPage();

        let numberOfFilteredItems = false;
        page.on(`response`, async response => {
            if (response.url().indexOf(`/api/sql/aleksandrshumilov`) !== -1) {
                let parsedResponse = await response.json();
                numberOfFilteredItems = parsedResponse.features.length;
            }
        });

        await disablePredefinedFilters(page);

        await helpers.img(page);

        expect(await page.evaluate(`$('[id="layer-settings-filters-test.testpointfilters"').find('[class="btn btn-sm btn-success"]').is(':disabled')`)).to.be.true;
        await setTextFilterValue(page, `stringfield`, `like`, `abc`, 0, false);
        expect(await page.evaluate(`$('[id="layer-settings-filters-test.testpointfilters"').find('[class="btn btn-sm btn-success"]').is(':disabled')`)).to.be.false;
        await setTextFilterValue(page, `stringfield`, `=`, `abc`);
        expect(numberOfFilteredItems).to.equal(1);

        await page.close();
    });

    it('should filter strings', async () => {
        let page = await createPage();

        let numberOfFilteredItems = false;
        page.on(`response`, async response => {
            if (response.url().indexOf(`/api/sql/aleksandrshumilov`) !== -1) {
                let parsedResponse = await response.json();
                numberOfFilteredItems = parsedResponse.features.length;
            }
        });

        await disablePredefinedFilters(page);

        await setTextFilterValue(page, `stringfield`, `like`, `abc`);
        expect(numberOfFilteredItems).to.equal(3);
        await setTextFilterValue(page, `stringfield`, `=`, `abc`);
        expect(numberOfFilteredItems).to.equal(1);

        await page.close();
   });

    it('should filter integers', async () => {
        let page = await createPage();

        let numberOfFilteredItems = false;
        page.on(`response`, async response => {
            if (response.url().indexOf(`/api/sql/aleksandrshumilov`) !== -1) {
                let parsedResponse = await response.json();
                numberOfFilteredItems = parsedResponse.features.length;
            }
        });

        await disablePredefinedFilters(page);

        await setTextFilterValue(page, `integerfield`, `=`, `12`);
        expect(numberOfFilteredItems).to.equal(2);
        await setTextFilterValue(page, `integerfield`, `>`, `0`);
        expect(numberOfFilteredItems).to.equal(3);
        await setTextFilterValue(page, `integerfield`, `<`, `13`);
        expect(numberOfFilteredItems).to.equal(2);
        await setTextFilterValue(page, `integerfield`, `<>`, `12`);
        expect(numberOfFilteredItems).to.equal(1);
        await setTextFilterValue(page, `integerfield`, `>=`, `12`);
        expect(numberOfFilteredItems).to.equal(3);

        await page.close();
    });

    it('should filter decimals', async () => {
        let page = await createPage();

        let numberOfFilteredItems = false;
        page.on(`response`, async response => {
            if (response.url().indexOf(`/api/sql/aleksandrshumilov`) !== -1) {
                let parsedResponse = await response.json();
                numberOfFilteredItems = parsedResponse.features.length;
            }
        });

        await disablePredefinedFilters(page);

        await setTextFilterValue(page, `decimalfield`, `=`, `1.16`);
        expect(numberOfFilteredItems).to.equal(1);
        await setTextFilterValue(page, `decimalfield`, `<>`, `1.16`);
        expect(numberOfFilteredItems).to.equal(2);
        await setTextFilterValue(page, `decimalfield`, `>`, `1.4`);
        expect(numberOfFilteredItems).to.equal(0);
        await setTextFilterValue(page, `decimalfield`, `<`, `13.123`);
        expect(numberOfFilteredItems).to.equal(3);
        await setTextFilterValue(page, `decimalfield`, `>=`, `1.4`);
        expect(numberOfFilteredItems).to.equal(2);

        await page.close();
    });

    it('should filter booleans', async () => {
        let page = await createPage();

        let numberOfFilteredItems = false;
        page.on(`response`, async response => {
            if (response.url().indexOf(`/api/sql/aleksandrshumilov`) !== -1) {
                let parsedResponse = await response.json();
                numberOfFilteredItems = parsedResponse.features.length;
            }
        });

        await disablePredefinedFilters(page);

        await setBooleanFilterValue(page, `booleanfield`, `=`, `true`);
        expect(numberOfFilteredItems).to.equal(2);
        await setBooleanFilterValue(page, `booleanfield`, `=`, `false`);
        expect(numberOfFilteredItems).to.equal(0);

        await page.close();
    });

    it('should filter dates', async () => {
        let page = await createPage();

        let numberOfFilteredItems = false;
        page.on(`response`, async response => {
            if (response.url().indexOf(`/api/sql/aleksandrshumilov`) !== -1) {
                let parsedResponse = await response.json();
                numberOfFilteredItems = parsedResponse.features.length;
            }
        });

        await disablePredefinedFilters(page);

        /**
         * Thanks to https://www.npmjs.com/package/react-trigger-change
         */
        await page.evaluate(`(function webpackUniversalModuleDefinition(root, factory) {
            if(typeof exports === 'object' && typeof module === 'object')
                module.exports = factory();
            else if(typeof define === 'function' && define.amd)
                define([], factory);
            else if(typeof exports === 'object')
                exports["reactTriggerChange"] = factory();
            else
                root["reactTriggerChange"] = factory();
        })(this, function() {
        return /******/ (function(modules) { // webpackBootstrap
        /******/ 	// The module cache
        /******/ 	var installedModules = {};
        /******/
        /******/ 	// The require function
        /******/ 	function __webpack_require__(moduleId) {
        /******/
        /******/ 		// Check if module is in cache
        /******/ 		if(installedModules[moduleId])
        /******/ 			return installedModules[moduleId].exports;
        /******/
        /******/ 		// Create a new module (and put it into the cache)
        /******/ 		var module = installedModules[moduleId] = {
        /******/ 			i: moduleId,
        /******/ 			l: false,
        /******/ 			exports: {}
        /******/ 		};
        /******/
        /******/ 		// Execute the module function
        /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ 		// Flag the module as loaded
        /******/ 		module.l = true;
        /******/
        /******/ 		// Return the exports of the module
        /******/ 		return module.exports;
        /******/ 	}
        /******/
        /******/
        /******/ 	// expose the modules object (__webpack_modules__)
        /******/ 	__webpack_require__.m = modules;
        /******/
        /******/ 	// expose the module cache
        /******/ 	__webpack_require__.c = installedModules;
        /******/
        /******/ 	// identity function for calling harmony imports with the correct context
        /******/ 	__webpack_require__.i = function(value) { return value; };
        /******/
        /******/ 	// define getter function for harmony exports
        /******/ 	__webpack_require__.d = function(exports, name, getter) {
        /******/ 		if(!__webpack_require__.o(exports, name)) {
        /******/ 			Object.defineProperty(exports, name, {
        /******/ 				configurable: false,
        /******/ 				enumerable: true,
        /******/ 				get: getter
        /******/ 			});
        /******/ 		}
        /******/ 	};
        /******/
        /******/ 	// getDefaultExport function for compatibility with non-harmony modules
        /******/ 	__webpack_require__.n = function(module) {
        /******/ 		var getter = module && module.__esModule ?
        /******/ 			function getDefault() { return module['default']; } :
        /******/ 			function getModuleExports() { return module; };
        /******/ 		__webpack_require__.d(getter, 'a', getter);
        /******/ 		return getter;
        /******/ 	};
        /******/
        /******/ 	// Object.prototype.hasOwnProperty.call
        /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
        /******/
        /******/ 	// __webpack_public_path__
        /******/ 	__webpack_require__.p = "";
        /******/
        /******/ 	// Load entry module and return exports
        /******/ 	return __webpack_require__(__webpack_require__.s = 0);
        /******/ })
        /************************************************************************/
        /******/ ([
        /* 0 */
        /***/ (function(module, exports, __webpack_require__) {
        
        "use strict";
        // Trigger React's synthetic change events on input, textarea and select elements
        // https://github.com/facebook/react/pull/4051 - React 15 fix
        // https://github.com/facebook/react/pull/5746 - React 16 fix
        
        
        
        // Constants and functions are declared inside the closure.
        // In this way, reactTriggerChange can be passed directly to executeScript in Selenium.
        module.exports = function reactTriggerChange(node) {
          var supportedInputTypes = {
            color: true,
            date: true,
            datetime: true,
            'datetime-local': true,
            email: true,
            month: true,
            number: true,
            password: true,
            range: true,
            search: true,
            tel: true,
            text: true,
            time: true,
            url: true,
            week: true
          };
          var nodeName = node.nodeName.toLowerCase();
          var type = node.type;
          var event;
          var descriptor;
          var initialValue;
          var initialChecked;
          var initialCheckedRadio;
        
          // Do not try to delete non-configurable properties.
          // Value and checked properties on DOM elements are non-configurable in PhantomJS.
          function deletePropertySafe(elem, prop) {
            var desc = Object.getOwnPropertyDescriptor(elem, prop);
            if (desc && desc.configurable) {
              delete elem[prop];
            }
          }
        
          // In IE10 propertychange is not dispatched on range input if invalid
          // value is set.
          function changeRangeValue(range) {
            var initMin = range.min;
            var initMax = range.max;
            var initStep = range.step;
            var initVal = Number(range.value);
        
            range.min = initVal;
            range.max = initVal + 1;
            range.step = 1;
            range.value = initVal + 1;
            deletePropertySafe(range, 'value');
            range.min = initMin;
            range.max = initMax;
            range.step = initStep;
            range.value = initVal;
          }
        
          function getCheckedRadio(radio) {
            var name = radio.name;
            var radios;
            var i;
            if (name) {
              radios = document.querySelectorAll('input[type="radio"][name="' + name + '"]');
              for (i = 0; i < radios.length; i += 1) {
                if (radios[i].checked) {
                  return radios[i] !== radio ? radios[i] : null;
                }
              }
            }
            return null;
          }
        
          function preventChecking(e) {
            e.preventDefault();
            if (!initialChecked) {
              e.target.checked = false;
            }
            if (initialCheckedRadio) {
              initialCheckedRadio.checked = true;
            }
          }
        
          if (nodeName === 'select' ||
            (nodeName === 'input' && type === 'file')) {
            // IE9-IE11, non-IE
            // Dispatch change.
            event = document.createEvent('HTMLEvents');
            event.initEvent('change', true, false);
            node.dispatchEvent(event);
          } else if ((nodeName === 'input' && supportedInputTypes[type]) ||
            nodeName === 'textarea') {
            // React 16
            // Cache artificial value property descriptor.
            // Property doesn't exist in React <16, descriptor is undefined.
            descriptor = Object.getOwnPropertyDescriptor(node, 'value');
        
            // React 0.14: IE9
            // React 15: IE9-IE11
            // React 16: IE9
            // Dispatch focus.
            event = document.createEvent('UIEvents');
            event.initEvent('focus', false, false);
            node.dispatchEvent(event);
        
            // React 0.14: IE9
            // React 15: IE9-IE11
            // React 16
            // In IE9-10 imperative change of node value triggers propertychange event.
            // Update inputValueTracking cached value.
            // Remove artificial value property.
            // Restore initial value to trigger event with it.
            if (type === 'range') {
              changeRangeValue(node);
            } else {
              initialValue = node.value;
              node.value = initialValue + '#';
              deletePropertySafe(node, 'value');
              node.value = initialValue;
            }
        
            // React 15: IE11
            // For unknown reason React 15 added listener for propertychange with addEventListener.
            // This doesn't work, propertychange events are deprecated in IE11,
            // but allows us to dispatch fake propertychange which is handled by IE11.
            event = document.createEvent('HTMLEvents');
            event.initEvent('propertychange', false, false);
            event.propertyName = 'value';
            node.dispatchEvent(event);
        
            // React 0.14: IE10-IE11, non-IE
            // React 15: non-IE
            // React 16: IE10-IE11, non-IE
            event = document.createEvent('HTMLEvents');
            event.initEvent('input', true, false);
            node.dispatchEvent(event);
        
            // React 16
            // Restore artificial value property descriptor.
            if (descriptor) {
              Object.defineProperty(node, 'value', descriptor);
            }
          } else if (nodeName === 'input' && type === 'checkbox') {
            // Invert inputValueTracking cached value.
            node.checked = !node.checked;
        
            // Dispatch click.
            // Click event inverts checked value.
            event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            node.dispatchEvent(event);
          } else if (nodeName === 'input' && type === 'radio') {
            // Cache initial checked value.
            initialChecked = node.checked;
        
            // Find and cache initially checked radio in the group.
            initialCheckedRadio = getCheckedRadio(node);
        
            // React 16
            // Cache property descriptor.
            // Invert inputValueTracking cached value.
            // Remove artificial checked property.
            // Restore initial value, otherwise preventDefault will eventually revert the value.
            descriptor = Object.getOwnPropertyDescriptor(node, 'checked');
            node.checked = !initialChecked;
            deletePropertySafe(node, 'checked');
            node.checked = initialChecked;
        
            // Prevent toggling during event capturing phase.
            // Set checked value to false if initialChecked is false,
            // otherwise next listeners will see true.
            // Restore initially checked radio in the group.
            node.addEventListener('click', preventChecking, true);
        
            // Dispatch click.
            // Click event inverts checked value.
            event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            node.dispatchEvent(event);
        
            // Remove listener to stop further change prevention.
            node.removeEventListener('click', preventChecking, true);
        
            // React 16
            // Restore artificial checked property descriptor.
            if (descriptor) {
              Object.defineProperty(node, 'checked', descriptor);
            }
          }
        };
        
        
        /***/ })
        /******/ ]);
        });`);

        await setDateFilterValue(page, `datefield`, `=`, `2018-08-11T10:10`);
        expect(numberOfFilteredItems).to.equal(1);
        await setDateFilterValue(page, `datefield`, `>`, `2018-08-24T10:10`);
        expect(numberOfFilteredItems).to.equal(1);
        await setDateFilterValue(page, `datefield`, `>=`, `1800-08-24T10:10`);
        expect(numberOfFilteredItems).to.equal(3);
        await setDateFilterValue(page, `datefield`, `<=`, `2800-08-24T10:10`);
        expect(numberOfFilteredItems).to.equal(3);

        await page.close();
    });
});
