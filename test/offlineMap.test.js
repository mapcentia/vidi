/**
 * Testing offlineMap extension
 */

const { expect } = require("chai");
const helpers = require("./helpers");

describe("OfflineMap", () => {
    it("should make the map area available offline", async () => {
        const page = await browser.newPage();

        await page.goto(helpers.PAGE_URL.replace('public/#osm/13/', 'public/#osm/17/'));
        await page.emulate(helpers.EMULATED_SCREEN);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        const logAllCachedTiles = `caches.open('vidi-static-cache').then(cache => {
            cache.keys().then(keys => {
                keys.map(item => {
                    console.log(item.url);
                });
            });
        });`;

        let numberOfAlreadyCachedTiles = 0;
        let numberOfCachedTiles = 0;
        let countingAlreadyCachedTiles = false;
        let countingNewlyCachedTiles = false;

        page.on(`console`, msg => {
            let message = msg.text();
            if (message.indexOf('a.tile.openstreetmap') !== -1 || message.indexOf('b.tile.openstreetmap') !== -1
                || message.indexOf('c.tile.openstreetmap') !== -1) {
                if (countingAlreadyCachedTiles) {
                    numberOfAlreadyCachedTiles++;
                } else if (countingNewlyCachedTiles) {
                    numberOfCachedTiles++;
                }
            }
        });

        await page.evaluate(`caches.delete('vidi-static-cache').then(result => { console.log(result); })`);
        await helpers.sleep(1000);
        countingAlreadyCachedTiles = true;
        await page.evaluate(logAllCachedTiles);
        await helpers.sleep(1000);

        // Open and fill the form
        await page.click(`#offline-map-btn`);
        await helpers.sleep(1000);
        await page.evaluate(`$('[href="#collapseOfflineMap1"]').trigger('click')`);
        await helpers.sleep(1000);
        await page.evaluate(`$($('#offline-map-dialog').find('.btn-primary')[0]).trigger('click')`);
        await helpers.sleep(1000);
        await page.focus('#offline-map-comment');
        await page.keyboard.type('Test offline map');
        await helpers.sleep(1000);
        
        // Select the caching area
        const e = await page.$('#map');
        const box = await e.boundingBox();
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(200, 200);
        await page.mouse.up();
        await helpers.sleep(1000);

        // Should change available zoom levels respectively to each other
        await page.select(`#offline-map-zoom_min`, '15');
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('#offline-map-zoom_min').find('option').length`)).to.equal(9);
        expect(await page.evaluate(`$('#offline-map-zoom_max').find('option').length`)).to.equal(4);

        await page.select(`#offline-map-zoom_max`, '16');
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('#offline-map-zoom_min').find('option').length`)).to.equal(7);
        expect(await page.evaluate(`$('#offline-map-zoom_max').find('option').length`)).to.equal(4);

        await page.select(`#offline-map-zoom_min`, '17');
        await page.select(`#offline-map-zoom_max`, '18');
        await helpers.sleep(1000);

        // Should change minimum zoom level according to latest map zoom change
        await page.click('#zoom-out-btn');
        await helpers.sleep(1000);
        await page.click('#zoom-out-btn');
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('#offline-map-zoom_min').val()`)).to.equal('15');

        await page.click('#zoom-in-btn');
        await helpers.sleep(1000);
        await page.click('#zoom-in-btn');
        await helpers.sleep(1000);

        expect(await page.evaluate(`$('#offline-map-zoom_min').val()`)).to.equal('17');

        // Save map
        await page.evaluate(`$($('#offline-map-dialog').find('.btn-primary')[2]).trigger('click')`);
        await helpers.sleep(5000);
        await helpers.sleep(5000);

        // Check if all tiles were saved
        let result = await page.evaluate(`$('#offline-map-dialog').find('h4').text()`);
        expect(result.indexOf(`Done`) !== -1).to.be.true;

        // Check if newly saved map is displayed
        await page.evaluate(`$('[href="#collapseOfflineMap1"]').trigger('click')`);
        await helpers.sleep(1000);
        expect(await page.evaluate(`$('#collapseOfflineMap2').find('td').length`)).to.equal(3);
        expect(await page.evaluate(`$($('#collapseOfflineMap2').find('td')[1]).text()`)).to.equal(`Test offline map`);;

        // Check if map tiles are stored in cache
        countingAlreadyCachedTiles = false;
        countingNewlyCachedTiles = true;
        await page.evaluate(logAllCachedTiles);
        await helpers.sleep(1000);
        expect(numberOfAlreadyCachedTiles).to.equal(0);
        expect(numberOfCachedTiles > 0).to.be.true;

        // @todo Should show saved maps in new tab
        /*
        //await page.goto(helpers.PAGE_URL.replace('public/#osm/13/', 'public/#osm/17/'));
        await page.reload();
        await page.emulate(helpers.EMULATED_SCREEN);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        // Check if previously saved map is restored
        await page.click(`#offline-map-btn`);
        await helpers.sleep(1000);
        await page.evaluate(`$('[href="#collapseOfflineMap2"]').trigger('click')`);
        await helpers.sleep(1000);

        await page.screenshot({ path: 'test.png' });
        */
    });
});
