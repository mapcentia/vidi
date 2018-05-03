/**
 * Test cases to cover.
 */
describe('Service worker', () => {
    describe('should handle lifecycle events', () => {});
    describe('should detect available space', () => {});
    describe('should prefetch specific files', () => {});
    describe('should cache loaded tiles when caching is enabled', () => {});
    describe('should always query the API first regardless of exisitng cache', () => {});
    describe('should process the connection-check.ico in special way', () => {});
    describe('should process the ignored extensions in special way', () => {});
    describe('should process the ignored URLs in special way', () => {});
    describe('should substitute request URLs for specific resources', () => {});
});

describe('Offline map', () => {
    describe('should determine current zoom level', () => {});
    describe('should validate available zoom levels upon input', () => {});
    describe('should enable the tile caching', () => {});
    describe('should store created map area', () => {});
    describe('should refetch tiles for created map area', () => {});
    describe('should delete created map area', () => {});
    describe('should not be affected by page reload', () => {});
});

describe('Layers module', () => {
    describe('should group layers', () => {});
    describe('should display the layer when checkbox is clicked', () => {});
    describe('should display the active / available status for each layer group', () => {});
    describe('should change the displayed layer type when type selector is clicked', () => {});
    describe('should alter the page URL when layers are turned on and off', () => {});
    describe('should warn user if invalid layers are provided in the page URL', () => {});
    describe('should display the online status', () => {});
    describe('should have the Force offline mode switch turned on after application is back online', () => {});
    describe('should have the Force offline mode switch turned on and locked if application is offline', () => {});
    describe('should add features to tile layer', () => {});
    describe('should add features to vector layer', () => {});
    describe('should update features of layer', () => {});
    describe('should delete features of layer', () => {});
    describe('should warn user of not displaying feature changes in offline mode', () => {});
    describe('should restore original feature data after editing cancellation', () => {});
    describe('should correctly show layer and forced offline mode status after the layers panel reaload', () => {});
});

// @todo Remove before real test implementation
describe('Array', () => {
    describe('#indexOf()', () => {
        it('should return -1 when the value is not present', () => {
            assert.equal(-1, [1, 2, 3].indexOf(4));
        });
    });
});