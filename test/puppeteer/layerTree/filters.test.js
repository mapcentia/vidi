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
    await page.focus('.rdt input');
    await page.type('.rdt input', value);
    await helpers.sleep(1000);
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
                        let buff = new Buffer(item.replace(`filters=`, ``), 'base64');
                        let text = buff.toString('ascii');
                        filtersString = JSON.parse(decodeURIComponent(text));
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
        await setDateFilterValue(page, `datefield`, `=`, `2018-8-11`);
        expect(numberOfFilteredItems).to.equal(1);
        await setDateFilterValue(page, `datefield`, `>`, `2018-8-24`);
        expect(numberOfFilteredItems).to.equal(1);
        await setDateFilterValue(page, `datefield`, `>=`, `1800-8-24`);
        expect(numberOfFilteredItems).to.equal(3);
        await setDateFilterValue(page, `datefield`, `<=`, `2800-8-24`);
        expect(numberOfFilteredItems).to.equal(3);

        await page.close();
    });
});
