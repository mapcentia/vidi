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

    describe("migrateLegacyBlob", () => {
        it("returns false when no legacy blob exists", async () => {
            global.localforage = makeLocalforageMock();
            const storage = new QueueStorage({database: 'd', schema: 's'});
            expect(await storage.migrateLegacyBlob(() => 'gen-id')).to.equal(false);
        });

        it("migrates a legacy array into per-item records and an index, then removes the legacy key", async () => {
            const lf = makeLocalforageMock({
                'queue:d:s': JSON.stringify([
                    {type: 1, feature: {features: [{properties: {gid: 1}}]}},
                    {type: 2, feature: {features: [{properties: {gid: 2}}]}}
                ])
            });
            global.localforage = lf;

            let counter = 0;
            const storage = new QueueStorage({database: 'd', schema: 's'});
            const migrated = await storage.migrateLegacyBlob(() => `id-${++counter}`);

            expect(migrated).to.equal(true);
            expect(lf.store.has('queue:d:s')).to.equal(false);
            expect(JSON.parse(lf.store.get('queueIndex:d:s'))).to.deep.equal(['id-1', 'id-2']);
            expect(JSON.parse(lf.store.get('queueItem:d:s:id-1'))).to.deep.equal({type: 1, feature: {features: [{properties: {gid: 1}}]}});
            expect(JSON.parse(lf.store.get('queueItem:d:s:id-2'))).to.deep.equal({type: 2, feature: {features: [{properties: {gid: 2}}]}});
        });

        it("is a no-op when the legacy blob is empty array", async () => {
            const lf = makeLocalforageMock({'queue:d:s': '[]'});
            global.localforage = lf;
            const storage = new QueueStorage({database: 'd', schema: 's'});
            const migrated = await storage.migrateLegacyBlob(() => 'gen');
            expect(migrated).to.equal(true);
            expect(lf.store.has('queue:d:s')).to.equal(false);
            expect(JSON.parse(lf.store.get('queueIndex:d:s'))).to.deep.equal([]);
        });
    });
});
