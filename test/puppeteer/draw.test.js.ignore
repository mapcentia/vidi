/**
 * Testing layerTree module
 */

const { expect } = require("chai");
const helpers = require("./../helpers");

describe('Draw', () => {
    it('should allow drawing features and restoring them switching base layers', async () => {
        const page = await browser.newPage();
        await page.goto(`${helpers.PAGE_URL.replace('8082', '8081')}`);
        await page.emulate(helpers.EMULATED_SCREEN);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        page.on('dialog', async dialog => {
            await dialog.accept('Test');
        });

        await page.evaluate(`$('[class="floatRight cursorPointer fa fa-reorder"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('[href="#draw-content"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('#draw-btn').trigger('click')`);
        await helpers.sleep(1000);

        // Draw one-segement line
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
        await page.click(`.leaflet-draw-draw-circlemarker`);
        await helpers.sleep(1000);
        await page.mouse.move(400, 400);
        await page.mouse.down();
        await page.mouse.up();

        // Draw marker
        await page.click(`.leaflet-draw-draw-marker`);
        await helpers.sleep(1000);
        await page.mouse.move(300, 300);
        await page.mouse.down();
        await page.mouse.up();

        // Save drawings in snapshot
        await page.evaluate(`$('[href="#state-snapshots-dialog-content-content"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.type(`.js-browser-owned input`, `test snapshot title`);
        await helpers.sleep(2000);
        await page.evaluate(`$('#state-snapshots-dialog-content').find('h4').first().find('button').first().trigger('click')`);
        await helpers.sleep(2000);

        await page.reload();
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        await page.evaluate(`$('[class="floatRight cursorPointer fa fa-reorder"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('[href="#state-snapshots-dialog-content-content"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$('#state-snapshots-dialog-content').find('.panel-default').eq(0).find('button').first().trigger('click')`);
        await helpers.sleep(2000);

        await page.evaluate(`$('[href="#draw-content"]').trigger('click')`);
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('path[class="leaflet-interactive"]').length`) > 0).to.be.true;
        expect(await page.evaluate(`$('[class="leaflet-marker-icon leaflet-zoom-animated leaflet-interactive"]').length`)).to.be.equal(1);
        expect(await page.evaluate(`$('[data-uniqueid]').length`)).to.be.equal(2);
    });
});
