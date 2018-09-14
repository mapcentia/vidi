/**
 * Testing layerTree module
 */

const { expect } = require("chai");
const helpers = require("./../helpers");

const PAGE_URL = `${helpers.PAGE_URL_BASE.replace(`8082`, `8081`)}/app/aleksandrshumilov/test/#stamenTonerLite/13/39.2681/-6.8108/v:test.testpointfilters`;

const createPage = async () => {
    const page = await browser.newPage();
    await page.goto(PAGE_URL);
    await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);
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
        const newPage = await browser.newPage();
        await newPage.goto(PAGE_URL);
        newPage.on(`response`, async response => {
            if (response.url().indexOf(`/api/sql/aleksandrshumilov`) !== -1) {
                let parsedResponse = await response.json();
                numberOfFilteredItems = parsedResponse.features.length;
            }
        });

        await newPage.emulate(helpers.EMULATED_SCREEN);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);
        expect(numberOfFilteredItems).to.equal(7);

        // Restore snapshot
        await newPage.evaluate(`$('#search-border').trigger('click')`);
        await helpers.sleep(500);
        await newPage.click(`[href="#state-snapshots-dialog-content-content"]`);   
        await helpers.sleep(1000);

        await newPage.evaluate(`$('#state-snapshots-dialog-content').find('.panel-default').eq(0).find('button').first().trigger('click')`);
        await helpers.sleep(2000);
        expect(numberOfFilteredItems).to.equal(4);
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
    });

    /*
    it('should load layers from page URL from same schema', async () => {
        const page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL}v:public.test,public.test_poly`);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        await page.click(`#burger-btn`);
        await helpers.sleep(1000);
        await page.evaluate(`$('[href="#collapseUHVibGljIGdyb3Vw"]').trigger('click')`);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('input[data-gc2-id="public.test"]').length`)).to.equal(1);
        expect(await page.evaluate(`$('input[data-gc2-id="public.test"]').is(':checked')`)).to.be.true;
        expect(await page.evaluate(`$('input[data-gc2-id="public.test_line"]').length`)).to.equal(1);
        expect(await page.evaluate(`$('input[data-gc2-id="public.test_line"]').is(':checked')`)).to.be.false;
        expect(await page.evaluate(`$('input[data-gc2-id="public.test_poly"]').length`)).to.equal(1);
        expect(await page.evaluate(`$('input[data-gc2-id="public.test_poly"]').is(':checked')`)).to.be.true;
    

    it('should load layers from page URL from different schemas', async () => {
        const page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL}test.polygon,public.urbanspatial_dar_es_salaam_luse_2002,public.test_poly,v:public.test,v:public.test_line`);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        await page.click(`#burger-btn`);
        await helpers.sleep(1000);
        await page.evaluate(`$('[href="#collapseUHVibGljIGdyb3Vw"]').trigger('click')`);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('input[data-gc2-id="test.polygon"]').length`)).to.equal(1);
        expect(await page.evaluate(`$('input[data-gc2-id="test.polygon"]').is(':checked')`)).to.be.true;
        expect(await page.evaluate(`$('input[data-gc2-id="public.test"]').length`)).to.equal(1);
        expect(await page.evaluate(`$('input[data-gc2-id="public.test"]').is(':checked')`)).to.be.true;
        expect(await page.evaluate(`$('input[data-gc2-id="public.test_line"]').length`)).to.equal(1);
        expect(await page.evaluate(`$('input[data-gc2-id="public.test_line"]').is(':checked')`)).to.be.true;
        expect(await page.evaluate(`$('input[data-gc2-id="public.test_point_no_type"]').length`)).to.equal(1);
        expect(await page.evaluate(`$('input[data-gc2-id="public.test_point_no_type"]').is(':checked')`)).to.be.false;
        expect(await page.evaluate(`$('input[data-gc2-id="public.urbanspatial_dar_es_salaam_luse_2002"]').length`)).to.equal(1);
        expect(await page.evaluate(`$('input[data-gc2-id="public.urbanspatial_dar_es_salaam_luse_2002"]').is(':checked')`)).to.be.true;
        expect(await page.evaluate(`$('input[data-gc2-id="public.test_poly"]').length`)).to.equal(1);
        expect(await page.evaluate(`$('input[data-gc2-id="public.test_poly"]').is(':checked')`)).to.be.true;

        // Check if the panel for different schema was drawn as well
        expect(await page.evaluate(`$('#layers_list').find('.accordion-toggle').eq(0).text()`)).to.equal(`Test group`);
        expect(await page.evaluate(`$('#layers_list').find('.accordion-toggle').eq(1).text()`)).to.equal(`Dar es Salaam Land Use and Informal Settlement Data Set`);
        expect(await page.evaluate(`$('#layers_list').find('.accordion-toggle').eq(2).text()`)).to.equal(`Public group`);
    });

    it('should load vector and tile layers', async () => {
        const page = await browser.newPage();
        await page.goto(helpers.PAGE_URL);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        await page.click(`#burger-btn`);
        await page._client.send('Network.enable');

        let apiWasRequested = false;
        await page._client.on('Network.requestWillBeSent', event => {
            if (event.request.url.indexOf(`/api/legend/aleksandrshumilov?l=v:public.test&db=aleksandrshumilov`) !== -1) {
                apiWasRequested = true;
            }
        });
        await page.evaluate(`$('[data-gc2-layer-key="public.test.the_geom"]').find('.js-layer-type-selector-vector').trigger('click')`);
        expect(apiWasRequested).to.be.true;

        let tilesWereRequested = false;
        await page._client.on('Network.requestWillBeSent', event => {
            if (event.request.url.indexOf(`mapcache/aleksandrshumilov/tms/1.0.0/public.test`) !== -1) {
                tilesWereRequested = true;
            }
        });
        await page.evaluate(`$('[data-gc2-layer-key="public.test.the_geom"]').find('.js-layer-type-selector-tile').trigger('click')`);
        expect(tilesWereRequested).to.be.true;
    });

    it('should load vector layers', async () => {
        const page = await browser.newPage();
        await page.goto(helpers.PAGE_URL);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        await page.click(`#burger-btn`);
        await page._client.send('Network.enable');

        let apiWasRequested = false;
        await page._client.on('Network.requestWillBeSent', event => {
            if (event.request.url.indexOf(`/api/legend/aleksandrshumilov?l=v:public.test_line&db=aleksandrshumilov`) !== -1) {
                apiWasRequested = true;
            }
        });

        await page.evaluate(`$('[data-gc2-layer-key="public.test_line.the_geom"]').find('.js-show-layer-control').trigger('click')`);
        expect(apiWasRequested).to.be.true;
    });

    it('should load tile layers', async () => {
        const page = await browser.newPage();
        await page.goto(helpers.PAGE_URL);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        await page.click(`#burger-btn`);
        await page._client.send('Network.enable');

        let tilesWereRequested = false;
        await page._client.on('Network.requestWillBeSent', event => {
            if (event.request.url.indexOf(`mapcache/aleksandrshumilov/tms/1.0.0/public.test_poly`) !== -1) {
                tilesWereRequested = true;
            }
        });

        await page.evaluate(`$('[data-gc2-layer-key="public.test_poly.the_geom"]').find('.check').trigger('click')`);
        expect(tilesWereRequested).to.be.true;
    });

    it('should keep layer and layer group order', async () => {
        const page = await browser.newPage();
        await page.goto(helpers.PAGE_URL);
        await page.emulate(helpers.EMULATED_SCREEN);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        await page.click(`#burger-btn`);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('#layer-slide').find('[data-toggle="collapse"]').eq(0).text()`)).to.equal(`Dar es Salaam Land Use and Informal Settlement Data Set`);
        expect(await page.evaluate(`$('#layer-slide').find('[data-toggle="collapse"]').eq(1).text()`)).to.equal(`Public group`);

        let e = await page.$('#layer-panel-UHVibGljIGdyb3Vw');
        let box = await e.boundingBox();
        let x = box.x + box.width / 2;
        let y = box.y + box.height / 2;
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x, y - 60);
        await page.mouse.up();
        await page.mouse.click(1, 1);
        await helpers.sleep(1000);

        await page.reload(helpers.PAGE_LOAD_TIMEOUT);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);
        await page.click(`#burger-btn`);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('#layer-slide').find('[data-toggle="collapse"]').eq(0).text()`)).to.equal(`Public group`);
        expect(await page.evaluate(`$('#layer-slide').find('[data-toggle="collapse"]').eq(1).text()`)).to.equal(`Dar es Salaam Land Use and Informal Settlement Data Set`);
    });
    */
});
