/**
 * Testing layerTree module
 */

const { expect } = require("chai");
const helpers = require("./../helpers");

const PAGE_URL = `${helpers.PAGE_URL_BASE.replace(`8082`, `8081`)}app/aleksandrshumilov/test/#stamenTonerLite/13/39.2681/-6.8108/v:test.testpointfilters`;

const createPage = async () => {
    let page = await browser.newPage();
    await page.emulate(helpers.EMULATED_SCREEN);
    await page.goto(PAGE_URL, { timeout: 0 });
    page = await helpers.waitForPageToLoad(page);

    await page._client.send('Network.enable');
        
    await page.evaluate(`$('#search-border').trigger('click')`);
    await helpers.sleep(500);
    await page.evaluate(`$('[href="#layer-content"]').trigger('click')`);
    await helpers.sleep(500);
    await page.evaluate(`$('[href="#collapseUHVwcGV0ZWVyIHRlc3Rpbmcgb25seQ"]').trigger('click')`);
    await helpers.sleep(500);
    await page.evaluate(`$('[data-gc2-layer-key="test.testpointfilters.the_geom"]').find('.js-toggle-filters').trigger('click')`);
    await helpers.sleep(500);

    return page;
};

const setTextFilterValue = async (page, field, expression, value, index = 0, submit = true) => {
    await page.select(`select[id="column_select_testpointfilters.test_${index}"]`, field);
    await helpers.sleep(500);
    await page.select(`select[id="expression_select_testpointfilters.test_${index}"]`, expression);
    await helpers.sleep(500);
    await page.type(`[id="expression_input_testpointfilters.test_${index}"]`, value);
    await helpers.sleep(500);

    if (submit) {
        await page.evaluate(`$('[id="layer-settings-filters-test.testpointfilters"').find('[class="btn btn-sm btn-success"]').trigger('click')`);
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
event.simulated = true;
target.value = '${value}';
target.dispatchEvent(event);`);

    await page.evaluate(`$('[id="layer-settings-filters-test.testpointfilters"').find('[class="btn btn-sm btn-success"]').trigger('click')`);
    await helpers.sleep(2000);
};

describe('Layer tree filters', () => {
    it('should store filters in state snapshot', async () => {
        let page = await createPage();

        let numberOfFilteredItems = false;
        page.on(`response`, async response => {
            if (response.url().indexOf(`/api/sql/aleksandrshumilov`) !== -1) {
                let parsedResponse = await response.json();
                numberOfFilteredItems = parsedResponse.features.length;
            }
        });

        await setTextFilterValue(page, `stringfield`, `like`, `abc`, 0, false);
        expect(await page.evaluate(`$('[id="layer-settings-filters-test.testpointfilters"').find('[class="btn btn-sm"]').first().trigger('click')`));
        await setTextFilterValue(page, `decimalfield`, `=`, `1.4`, 1);

        expect(numberOfFilteredItems).to.equal(4);

        await page.click(`[href="#state-snapshots-dialog-content-content"]`);   
        await helpers.sleep(1000);

        // Create state snapshot
        await page.type(`.js-browser-owned input`, `test snapshot title`);
        await helpers.sleep(2000);
        await page.evaluate(`$('.js-browser-owned').find('button').first().trigger('click')`);
        await helpers.sleep(3000);

        // Reload page
        await page.reload();
        await helpers.sleep(5000);

        expect(numberOfFilteredItems).to.equal(7);

        // Restore snapshot
        await page.evaluate(`$('#search-border').trigger('click')`);
        await helpers.sleep(500);
        await page.click(`[href="#state-snapshots-dialog-content-content"]`);   
        await helpers.sleep(1000);

        await page.evaluate(`$('#state-snapshots-dialog-content').find('.panel-default').eq(0).find('button').first().trigger('click')`);
        await helpers.sleep(2000);
        expect(numberOfFilteredItems).to.equal(4);

        await page.close();
    });

    it('should allow AND / OR modes of filtering, as well as adding and deleting of rules', async () => {
        let page = await createPage();

        let numberOfFilteredItems = false;
        page.on(`response`, async response => {
            if (response.url().indexOf(`/api/sql/aleksandrshumilov`) !== -1) {
                let parsedResponse = await response.json();
                numberOfFilteredItems = parsedResponse.features.length;
            }
        });

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

        expect(await page.evaluate(`$('[id="layer-settings-filters-test.testpointfilters"').find('[class="btn btn-sm btn-success"]').is(':disabled')`)).to.be.true;
        await setTextFilterValue(page, `stringfield`, `like`, `abc`, 0, false);
        expect(await page.evaluate(`$('[id="layer-settings-filters-test.testpointfilters"').find('[class="btn btn-sm btn-success"]').is(':disabled')`)).to.be.false;
        await setTextFilterValue(page, `stringfield`, `=`, `abc`);
        expect(numberOfFilteredItems).to.equal(2);

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

        await setTextFilterValue(page, `stringfield`, `like`, `abc`);
        expect(numberOfFilteredItems).to.equal(3);
        await setTextFilterValue(page, `stringfield`, `=`, `abc`);
        expect(numberOfFilteredItems).to.equal(2);

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
