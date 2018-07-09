/**
 * Testing offlineMap extension
 */

const { expect } = require("chai");
const helpers = require("./../helpers");

describe("OfflineMap", () => {
    it("should make the map area available offline", async () => {
        const isTileRequest = (message) => {
            return (message.indexOf('a.tile.openstreetmap') !== -1 || message.indexOf('b.tile.openstreetmap') !== -1
            || message.indexOf('c.tile.openstreetmap') !== -1);
        }

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
            if (isTileRequest(message)) {
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

        await page.reload();
        await helpers.sleep(5000);

        // Open and fill the form
        await page.click(`#offline-map-btn`);
        await helpers.sleep(2000);
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
        await helpers.sleep(10000);

        // Check if all tiles were saved
        let result = await page.evaluate(`$('#offline-map-dialog').find('h4').text()`);
        expect(result.indexOf(`Done`) !== -1).to.be.true;

        // Check if newly saved map is displayed
        await page.evaluate(`$('[href="#collapseOfflineMap1"]').trigger('click')`);
        await helpers.sleep(1000);
        expect(await page.evaluate(`$('#collapseOfflineMap2').find('td').length`)).to.equal(3);
        expect(await page.evaluate(`$($('#collapseOfflineMap2').find('td')[1]).text()`)).to.equal(`Test offline map`);

        // Check if map tiles are stored in cache
        countingAlreadyCachedTiles = false;
        countingNewlyCachedTiles = true;
        await page.evaluate(logAllCachedTiles);
        await helpers.sleep(1000);
        expect(numberOfAlreadyCachedTiles).to.equal(0);
        expect(numberOfCachedTiles > 0).to.be.true;

        // Checking if map is truly stored across all tabs
        const newPage = await browser.newPage();
        await newPage.goto(helpers.PAGE_URL.replace('public/#osm/13/', 'public/#osm/17/'));
        await newPage.emulate(helpers.EMULATED_SCREEN);
        await helpers.sleep(helpers.PAGE_LOAD_TIMEOUT);

        // Check if previously saved map is restored
        await newPage.click(`#offline-map-btn`);
        await helpers.sleep(2000);
        expect(await newPage.evaluate(`$('#collapseOfflineMap2').find('td').length`)).to.equal(3);
        expect(await newPage.evaluate(`$($('#collapseOfflineMap2').find('td')[1]).text()`)).to.equal(`Test offline map`);

        // Check if stored area can be displayed on map
        await newPage.evaluate(`$($('#collapseOfflineMap2').find('button')[0]).trigger('click')`);
        await helpers.sleep(1000);
        expect(await newPage.evaluate(`$('.leaflet-interactive').length`)).to.equal(1);
        await helpers.sleep(1000);
        await newPage.evaluate(`$($('#collapseOfflineMap2').find('button')[0]).trigger('click')`);
        await helpers.sleep(1000);
        expect(await newPage.evaluate(`$('.leaflet-interactive').length`)).to.equal(0);
        await helpers.sleep(1000);

        // Accepting the dialog
        newPage.on('dialog', (dialog) => {
            dialog.accept();
        });

        // Check if stored area can be refreshed
        let numberOfRequestedTiles = 0;
        await newPage._client.on('Network.requestWillBeSent', event => {
            if (isTileRequest(event.request.url)) {
                numberOfRequestedTiles++;
            }
        });

        await newPage.evaluate(`$($('#collapseOfflineMap2').find('button')[1]).trigger('click')`);
        await helpers.sleep(4000);
        collectStats = false;
        expect(numberOfRequestedTiles > 0).to.be.true;

        // Check if stored area can be deleted
        let numberOfAlreadyCachedTilesForNewPage = 0;
        let numberOfCachedTilesForNewPage = 0;
        let countingAlreadyCachedTilesForNewPage = false;
        let countingNewlyCachedTilesForNewPage = false;

        newPage.on(`console`, msg => {
            let message = msg.text();
            if (isTileRequest(message)) {
                if (countingAlreadyCachedTilesForNewPage) {
                    numberOfAlreadyCachedTilesForNewPage++;
                } else if (countingNewlyCachedTilesForNewPage) {
                    numberOfCachedTilesForNewPage++;
                }
            }
        });

        countingAlreadyCachedTilesForNewPage = true;
        await newPage.evaluate(logAllCachedTiles);
        await helpers.sleep(1000);

        await newPage.evaluate(`$($('#collapseOfflineMap2').find('button')[2]).trigger('click')`);
        await helpers.sleep(4000);
        expect(await newPage.evaluate(`$('#collapseOfflineMap2').find('td').length`)).to.equal(0);

        countingAlreadyCachedTilesForNewPage = false;
        countingNewlyCachedTilesForNewPage = true;
        await newPage.evaluate(logAllCachedTiles);
        await helpers.sleep(1000);

        expect(numberOfAlreadyCachedTilesForNewPage > 0).to.be.true;
        expect(numberOfCachedTilesForNewPage).to.equal(0);
    });
});
