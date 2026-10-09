/**
 * Testing layerTree module
 */

const { expect } = require("chai");
const helpers = require("./../helpers");

describe('Draw', () => {
    it('should allow drawing features and restoring them switching base layers', async () => {
        let page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL_DEFAULT}`);
        await page.emulate(helpers.EMULATED_SCREEN);
        page = await helpers.waitForPageToLoad(page);

        page.on('dialog', async dialog => {
            await dialog.accept('Test');
        });

        await page.evaluate(`$('[class="floatRight cursorPointer fa fa-reorder"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('[href="#draw-content"]').trigger('click')`);
        await helpers.sleep(1000);

        // Draw one-segement line
        expect(await page.evaluate(`$('.leaflet-draw-draw-polyline').length`) === 1).to.be.true;
        await page.click(`.leaflet-draw-draw-polyline`);
        await helpers.sleep(1000);
        await page.mouse.move(100, 100);
        await page.mouse.down();
        await page.mouse.up();
        await page.mouse.move(200, 200);
        await page.mouse.down();
        await page.mouse.up();
        await helpers.sleep(1000);
        await page.mouse.down();
        await page.mouse.up();

        // Draw circle marker
        expect(await page.evaluate(`$('.leaflet-draw-draw-circlemarker').length`) === 1).to.be.true;
        await page.click(`.leaflet-draw-draw-circlemarker`);
        await helpers.sleep(1000);
        await page.mouse.move(400, 400);
        await page.mouse.down();
        await page.mouse.up();

        // Draw marker
        expect(await page.evaluate(`$('.leaflet-draw-draw-marker').length`) === 1).to.be.true;
        await page.click(`.leaflet-draw-draw-marker`);
        await helpers.sleep(1000);
        await page.mouse.move(300, 300);
        await page.mouse.down();
        await page.mouse.up();

        // Save drawings in snapshot
        await helpers.sleep(1000);
        await page.evaluate(`$('[href="#state-snapshots-content"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.type(`.js-browser-owned input`, `test snapshot title`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots').find('h4').first().find('button').first().trigger('click')`);
        await helpers.sleep(2000);

        await page.reload();
        page = await helpers.waitForPageToLoad(page);

        await page.evaluate(`$('[class="floatRight cursorPointer fa fa-reorder"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('[href="#state-snapshots-content"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('#state-snapshots').find('.panel-default').eq(0).find('button').first().trigger('click')`);
        await helpers.sleep(2000);

        await page.evaluate(`$('[href="#draw-content"]').trigger('click')`);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('path[class="leaflet-interactive"]').length`) > 0).to.be.true;
        expect(await page.evaluate(`$('[class="leaflet-marker-icon leaflet-zoom-animated leaflet-interactive"]').length`)).to.be.equal(1);
        expect(await page.evaluate(`$('[data-uniqueid]').length`)).to.be.equal(2);
    });
});
