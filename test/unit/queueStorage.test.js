/**
 * Testing QueueStorage class
 */
'use strict';

const {expect} = require('chai');
const QueueStorage = require('./../../browser/modules/api-bridge/QueueStorage');

// In-memory localforage mock that mimics the async API
function makeLocalforageMock(initial = {}) {
    const store = new Map(Object.entries(initial));
    return {
        store,
        getItem: (key, cb) => setTimeout(() => cb(null, store.has(key) ? store.get(key) : null), 0),
        setItem: (key, value, cb) => setTimeout(() => { store.set(key, value); cb && cb(null, value); }, 0),
        removeItem: (key, cb) => setTimeout(() => { store.delete(key); cb && cb(null); }, 0),
        keys: (cb) => setTimeout(() => cb(null, [...store.keys()]), 0),
    };
}

describe("QueueStorage", () => {
    describe("loadIndex / saveIndex", () => {
        it("returns empty array when no index exists yet", async () => {
            global.localforage = makeLocalforageMock();
            const storage = new QueueStorage({database: 'd', schema: 's'});
            const ids = await storage.loadIndex();
            expect(ids).to.deep.equal([]);
        });

        it("round-trips an array of ids", async () => {
            global.localforage = makeLocalforageMock();
            const storage = new QueueStorage({database: 'd', schema: 's'});
            await storage.saveIndex(['a', 'b', 'c']);
            const ids = await storage.loadIndex();
            expect(ids).to.deep.equal(['a', 'b', 'c']);
        });
    });

    describe("loadItem / saveItem / deleteItem", () => {
        it("returns null for unknown id", async () => {
            global.localforage = makeLocalforageMock();
            const storage = new QueueStorage({database: 'd', schema: 's'});
            expect(await storage.loadItem('missing')).to.equal(null);
        });

        it("round-trips an item", async () => {
            global.localforage = makeLocalforageMock();
            const storage = new QueueStorage({database: 'd', schema: 's'});
            const item = {type: 1, feature: {features: [{properties: {gid: 1}}]}};
            await storage.saveItem('id1', item);
            const loaded = await storage.loadItem('id1');
            expect(loaded).to.deep.equal(item);
        });

        it("deleteItem removes the record", async () => {
            global.localforage = makeLocalforageMock();
            const storage = new QueueStorage({database: 'd', schema: 's'});
            await storage.saveItem('id1', {x: 1});
            await storage.deleteItem('id1');
            expect(await storage.loadItem('id1')).to.equal(null);
        });
    });
});
