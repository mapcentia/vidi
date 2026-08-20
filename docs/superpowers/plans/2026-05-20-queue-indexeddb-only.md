# Queue → IndexedDB-only Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate the in-memory copy of queue items' feature data (especially bytea/base64 payloads) by keeping only lightweight metadata in RAM and storing the full data per-item in IndexedDB. Loaded on demand when an HTTP request is sent or when the response transformer injects a pending edit back into a layer load.

**Architecture:** Two-tier `Queue` API. A sync metadata index (`_metadataIndex: MetadataItem[]`) lives in memory and is enough for routing decisions (which table, which pkey, ADD/UPDATE/DELETE, skip state, dup detection). A localforage-backed per-item store (`_fullStore`) holds the full `feature` payload keyed by a stable item id. Existing single-blob localforage records are migrated to per-item records on first construction. Callers of `getItems()` are split into two groups: those that need only metadata (sync, e.g. duplicate detection) and those that need full data (async, e.g. transformResponseHandler and the queue processor). The transformResponseHandler's call chain becomes async, which forces `geocloud.success` to await it before clone/render. Bytea payloads inside `properties` are no longer in the JS heap unless a downstream consumer actively loads them.

**Tech Stack:**
- `localforage` (already a dependency; uses IndexedDB driver in browser)
- `chai` + `mocha` for unit tests (existing `test/unit/queue.test.js` is the pattern)
- `esbuild` via `node build.mjs` for building the browser bundle
- Browser globals: `$.ajax` (jQuery), `URL.createObjectURL`, no async/await in service worker code paths

---

## File Structure

**Created:**
- `browser/modules/api-bridge/QueueStorage.js` — encapsulates localforage per-item read/write/delete/list, plus migration from the old single-blob format. Exposes async `loadAllMetadata()`, `loadFullItem(id)`, `saveItem(id, fullItem)`, `deleteItem(id)`, `clearAll()`.
- `test/unit/queueStorage.test.js` — unit tests for QueueStorage using the existing `localforageMock` pattern.

**Modified:**
- `browser/modules/api-bridge/Queue.js` — split internal state into `_metadataIndex` (sync) and `_storage` (the QueueStorage instance). Public API splits into `getMetadataItems()` / `getMetadataLength()` (sync) and `getFullItems()` / `getFullItem(id)` (async). `push()` / `removeByPrimaryKeys()` / `resubmitSkippedFeatures()` / `removeByLayerId()` become async. Internal helpers like `_eliminateItemsWithSameIdentifier`, `_getOldestNonSkippedItem` are updated to operate on the metadata index where possible; load full data only when actually processing or sending.
- `browser/modules/api-bridge/index.js` — `transformResponseHandler` becomes async; load each pending queue item from QueueStorage when injecting into `response.features`. Update the `_queue.push(...)` callsites (`addFeature` / `updateFeature` / `deleteFeature`) to await `push`.
- `browser/modules/geocloud.js` — the `success: function (response)` callback awaits `me.transformResponse(...)` before calling `me.layer.addData(clone)` etc.
- `test/unit/queue.test.js` — updated to await async ops and use the new metadata/full APIs.

**Untouched:**
- All non-queue files (layerTree, sqlQuery, editor extensions). Their behavior depends on transformResponseHandler returning a response with injected features — that contract is preserved; only the call becomes awaitable.

---

## Background — what each existing piece does

Engineer reading this for the first time:

- **`Queue._queue`** (array, in memory) is the current source of truth. It's persisted as one JSON blob via `localforage.setItem('queue:<db>:<schema>', JSON.stringify(this._queue))` on every change, and restored once at construction.
- **Each queue item** has shape:
  ```js
  {
    type: Queue.ADD_REQUEST | Queue.UPDATE_REQUEST | Queue.DELETE_REQUEST,
    feature: { type: 'FeatureCollection', features: [{ properties: {...}, geometry: {...} }] },
    db: 'mydb',
    meta: { f_table_schema: 'public', f_table_name: 'punkt', f_geometry_column: 'the_geom', pkey: 'gid' },
    skip: false,
    serverErrorMessage: null,
    serverErrorType: null
  }
  ```
- **`getItems()`** is called from `transformResponseHandler` three times per response. It currently uses a structural shallow clone (Fix I) — for IndexedDB-only it instead loads from storage.
- **`transformResponseHandler`** is called synchronously from the `geocloud.sqlStore` ajax success callback (`browser/modules/geocloud.js`). Making it async cascades.
- **localforage** is async (callback or Promise API). It uses IndexedDB driver in browsers; we already depend on it.
- **Old data on user devices**: existing users have queues stored as a single JSON blob under key `queue:<db>:<schema>`. The new code must migrate, then delete the old key.

---

## Phase 1 — QueueStorage abstraction

### Task 1: Create QueueStorage module skeleton

**Files:**
- Create: `browser/modules/api-bridge/QueueStorage.js`

- [ ] **Step 1: Create the file with constants and class skeleton**

```js
/**
 * Per-item localforage storage for queue items, plus migration helpers.
 *
 * The legacy format was a single JSON blob at key `queue:<db>:<schema>`. The
 * new format stores each item under `queueItem:<db>:<schema>:<id>` and keeps
 * an index of ids at `queueIndex:<db>:<schema>`. Reading the index is one
 * lookup; reading a specific item is a second lookup. Writes touch only the
 * item being changed plus the index, not the whole queue.
 *
 * All public methods are async and return Promises (not Node-style callbacks)
 * to keep callers simple.
 */
'use strict';

const LEGACY_PREFIX = 'queue';
const INDEX_PREFIX = 'queueIndex';
const ITEM_PREFIX = 'queueItem';

class QueueStorage {
    constructor({database = 'default', schema = 'default'} = {}) {
        this._database = database;
        this._schema = schema;
    }

    _legacyKey() {
        return `${LEGACY_PREFIX}:${this._database}:${this._schema}`;
    }

    _indexKey() {
        return `${INDEX_PREFIX}:${this._database}:${this._schema}`;
    }

    _itemKey(id) {
        return `${ITEM_PREFIX}:${this._database}:${this._schema}:${id}`;
    }
}

module.exports = QueueStorage;
module.exports.LEGACY_PREFIX = LEGACY_PREFIX;
module.exports.INDEX_PREFIX = INDEX_PREFIX;
module.exports.ITEM_PREFIX = ITEM_PREFIX;
```

- [ ] **Step 2: Commit the skeleton**

```bash
git add browser/modules/api-bridge/QueueStorage.js
git commit -m "feat(api-bridge): add QueueStorage module skeleton"
```

---

### Task 2: Add `loadIndex()` / `saveIndex()` with promisified localforage

**Files:**
- Modify: `browser/modules/api-bridge/QueueStorage.js`
- Create: `test/unit/queueStorage.test.js`

- [ ] **Step 1: Write the failing test**

```js
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
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx mocha test/unit/queueStorage.test.js`
Expected: FAIL — `storage.loadIndex is not a function`

- [ ] **Step 3: Implement loadIndex / saveIndex on QueueStorage**

Add these methods inside the class in `browser/modules/api-bridge/QueueStorage.js`:

```js
    /**
     * Returns the array of item ids currently stored, or [] if none.
     */
    loadIndex() {
        return new Promise((resolve, reject) => {
            global.localforage.getItem(this._indexKey(), (error, value) => {
                if (error) return reject(error);
                if (!value) return resolve([]);
                try {
                    const parsed = JSON.parse(value);
                    resolve(Array.isArray(parsed) ? parsed : []);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    saveIndex(ids) {
        return new Promise((resolve, reject) => {
            global.localforage.setItem(this._indexKey(), JSON.stringify(ids), (error) => {
                if (error) return reject(error);
                resolve();
            });
        });
    }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx mocha test/unit/queueStorage.test.js`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add browser/modules/api-bridge/QueueStorage.js test/unit/queueStorage.test.js
git commit -m "feat(api-bridge): add QueueStorage loadIndex/saveIndex"
```

---

### Task 3: Add `loadItem(id)` / `saveItem(id, fullItem)` / `deleteItem(id)`

**Files:**
- Modify: `browser/modules/api-bridge/QueueStorage.js`
- Modify: `test/unit/queueStorage.test.js`

- [ ] **Step 1: Write failing tests**

Append to `test/unit/queueStorage.test.js` inside the `describe("QueueStorage", ...)` block:

```js
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx mocha test/unit/queueStorage.test.js`
Expected: FAIL — `loadItem is not a function`

- [ ] **Step 3: Implement the methods**

Add inside the class in `browser/modules/api-bridge/QueueStorage.js`:

```js
    /**
     * Returns the full item by id, or null if not present.
     */
    loadItem(id) {
        return new Promise((resolve, reject) => {
            global.localforage.getItem(this._itemKey(id), (error, value) => {
                if (error) return reject(error);
                if (!value) return resolve(null);
                try {
                    resolve(JSON.parse(value));
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    saveItem(id, fullItem) {
        return new Promise((resolve, reject) => {
            global.localforage.setItem(this._itemKey(id), JSON.stringify(fullItem), (error) => {
                if (error) return reject(error);
                resolve();
            });
        });
    }

    deleteItem(id) {
        return new Promise((resolve, reject) => {
            global.localforage.removeItem(this._itemKey(id), (error) => {
                if (error) return reject(error);
                resolve();
            });
        });
    }
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx mocha test/unit/queueStorage.test.js`
Expected: PASS (5 tests total)

- [ ] **Step 5: Commit**

```bash
git add browser/modules/api-bridge/QueueStorage.js test/unit/queueStorage.test.js
git commit -m "feat(api-bridge): add QueueStorage loadItem/saveItem/deleteItem"
```

---

### Task 4: Add legacy-blob migration

**Files:**
- Modify: `browser/modules/api-bridge/QueueStorage.js`
- Modify: `test/unit/queueStorage.test.js`

- [ ] **Step 1: Write failing test**

Append to `test/unit/queueStorage.test.js` inside the `describe("QueueStorage", ...)` block:

```js
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx mocha test/unit/queueStorage.test.js`
Expected: FAIL — `storage.migrateLegacyBlob is not a function`

- [ ] **Step 3: Implement migrateLegacyBlob**

Add inside the class:

```js
    /**
     * If a legacy single-blob queue exists, split it into per-item records,
     * write the index, and remove the legacy key. Returns true if migration
     * ran (even for an empty array), false if no legacy blob was found.
     *
     * idGenerator: a function returning a fresh unique id (string) on each call.
     */
    migrateLegacyBlob(idGenerator) {
        return new Promise((resolve, reject) => {
            global.localforage.getItem(this._legacyKey(), async (error, value) => {
                if (error) return reject(error);
                if (value === null || value === undefined) return resolve(false);
                let legacyItems;
                try {
                    legacyItems = JSON.parse(value);
                    if (!Array.isArray(legacyItems)) legacyItems = [];
                } catch (e) {
                    return reject(e);
                }

                try {
                    const ids = [];
                    for (const item of legacyItems) {
                        const id = idGenerator();
                        ids.push(id);
                        await this.saveItem(id, item);
                    }
                    await this.saveIndex(ids);
                    await new Promise((res, rej) => {
                        global.localforage.removeItem(this._legacyKey(), (err) => err ? rej(err) : res());
                    });
                    resolve(true);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx mocha test/unit/queueStorage.test.js`
Expected: PASS (8 tests total)

- [ ] **Step 5: Commit**

```bash
git add browser/modules/api-bridge/QueueStorage.js test/unit/queueStorage.test.js
git commit -m "feat(api-bridge): migrate legacy queue blob to per-item records"
```

---

## Phase 2 — Queue refactor: metadata index + async API

### Task 5: Add metadata-projection helper and id generator

**Files:**
- Modify: `browser/modules/api-bridge/Queue.js`

- [ ] **Step 1: Add at the top of `Queue.js`, just below existing requires**

Find this near the top of the file:
```js
const {QUEUE_DEFAULT_PKEY, ...} = require('./constants');
```

Add directly after:

```js
const QueueStorage = require('./QueueStorage');

/**
 * Returns the lightweight metadata projection of a full queue item.
 * This is the only shape that lives in the in-memory index — heavy payloads
 * inside item.feature.features[0].properties stay in IndexedDB.
 */
function projectMetadata(id, fullItem) {
    const pkeyField = (fullItem.meta && fullItem.meta.pkey) ? fullItem.meta.pkey : QUEUE_DEFAULT_PKEY;
    const pkeyValue = fullItem.feature?.features?.[0]?.properties?.[pkeyField];
    return {
        id,
        type: fullItem.type,
        table: (fullItem.meta?.f_table_schema || '') + '.' + (fullItem.meta?.f_table_name || ''),
        pkeyField,
        pkey: pkeyValue,
        skip: fullItem.skip === true,
        serverErrorMessage: fullItem.serverErrorMessage || null,
        serverErrorType: fullItem.serverErrorType || null
    };
}

/**
 * Returns a fresh id string. Counter is monotonic within a tab session, and
 * combined with Date.now() to avoid collisions across sessions if items
 * persist across page reloads.
 */
let _idCounter = 0;
function generateId() {
    _idCounter += 1;
    return `${Date.now().toString(36)}-${_idCounter.toString(36)}`;
}
```

- [ ] **Step 2: Verify the module still parses**

Run: `node -e "const Q = require('./browser/modules/api-bridge/Queue'); console.log(typeof Q);"`
Expected: `function`

- [ ] **Step 3: Commit**

```bash
git add browser/modules/api-bridge/Queue.js
git commit -m "refactor(Queue): add metadata projection helper and id generator"
```

---

### Task 6: Replace `this._queue` array with `_metadataIndex` + `_storage`

**Files:**
- Modify: `browser/modules/api-bridge/Queue.js`
- Modify: `test/unit/queue.test.js`

- [ ] **Step 1: Replace state initialization in the constructor**

Find in `Queue.js` constructor:
```js
this._queue = [];
```

Replace with:
```js
// Lightweight metadata index in RAM. Full items live in this._storage.
this._metadataIndex = [];
this._storage = new QueueStorage(this._getCurrentDatabaseAndSchema());
```

- [ ] **Step 2: Rewrite `_restoreState` to load from new storage with legacy migration**

Find the existing `_restoreState` method and replace its body so it:
1. Migrates legacy blob if present.
2. Loads the index.
3. For each id, loads the full item only to project its metadata, then drops the full item from memory.

Replace:
```js
    _restoreState() {
        let _self = this;
        if (LOG) console.log('Queue: before getting state');
        let result = new Promise((resolve, reject) => {
            let location = _self._getCurrentDatabaseAndSchema();
            localforage.getItem(`${QUEUE_STORE_NAME}:${location.database}:${location.schema}`, (error, value) => {
                if (LOG) console.log('Queue: after getting state');
                if (error) {
                    throw new Error('Queue: error occured while accessing the store');
                }
                if (value) {
                    _self._queue = JSON.parse(value);
                }
                resolve();
            });
        });
        return result;
    }
```

With:
```js
    async _restoreState() {
        if (LOG) console.log('Queue: restoring state');
        // Migrate legacy single-blob format into per-item records.
        await this._storage.migrateLegacyBlob(generateId);
        const ids = await this._storage.loadIndex();
        const index = [];
        for (const id of ids) {
            const fullItem = await this._storage.loadItem(id);
            if (fullItem) index.push(projectMetadata(id, fullItem));
        }
        this._metadataIndex = index;
        if (LOG) console.log(`Queue: restored ${index.length} items`);
    }
```

- [ ] **Step 3: Remove `_saveState` (writes happen per item now)**

Delete the existing `_saveState` method block. We'll add per-item writes when refactoring push/remove. Leave a stub that does nothing, so existing callers don't crash mid-refactor:

```js
    /**
     * Deprecated. Per-item writes happen inside push/remove/setSkip directly.
     * Kept as a no-op so older internal callers don't crash before they're updated.
     */
    _saveState() {}
```

- [ ] **Step 4: Replace `.length` accesses on `_queue` with `_metadataIndex.length`**

Find every line in `Queue.js` matching `this._queue.length` or `_self._queue.length` and replace with `this._metadataIndex.length` / `_self._metadataIndex.length`. (See the grep at planning time: lines 52, 110, 150, 161, 196, 198, 228, 379, 446, 462, 526, 543, 557, 566, 568, 580, 592, 605.)

- [ ] **Step 5: Verify the module still parses and old tests still load**

Run: `npx mocha test/unit/queue.test.js`
Expected: tests will fail at runtime due to missing push/remove logic — but the module must still parse and Queue must be constructible. If you see syntax errors, fix them.

- [ ] **Step 6: Commit**

```bash
git add browser/modules/api-bridge/Queue.js
git commit -m "refactor(Queue): replace _queue array with _metadataIndex + storage"
```

---

### Task 7: Rewrite `push(item)` as async — write to storage + update index

**Files:**
- Modify: `browser/modules/api-bridge/Queue.js`
- Modify: `test/unit/queue.test.js`

- [ ] **Step 1: Update the existing push test for the async API**

Find the first test using `push` in `test/unit/queue.test.js` and confirm the test setup uses `await`. If a test reads `_queue.length`, replace with `getMetadataLength()`. Update at minimum the test "Add item to the queue" (search for `push` calls).

Example test to add at the end of the `describe("Queue", ...)` block:

```js
    it("push() persists to storage and exposes metadata synchronously", async () => {
        const store = new Map();
        global.localforage = {
            getItem: (k, cb) => setTimeout(() => cb(null, store.has(k) ? store.get(k) : null), 0),
            setItem: (k, v, cb) => setTimeout(() => { store.set(k, v); cb && cb(null, v); }, 0),
            removeItem: (k, cb) => setTimeout(() => { store.delete(k); cb && cb(null); }, 0),
        };

        const queue = new Queue(() => new Promise((resolve) => resolve()));
        await queue.ready();

        await queue.push(dummyRequest);

        expect(queue.getMetadataLength()).to.equal(1);
        const md = queue.getMetadataItems()[0];
        expect(md.type).to.equal(Queue.ADD_REQUEST);
        expect(md.table).to.equal('schema.table');
        // The full item is in storage, not in the metadata projection
        expect(md.feature).to.equal(undefined);

        const fullItem = await queue.getFullItem(md.id);
        expect(fullItem.feature.features[0].properties.id).to.equal('1');
    });
```

- [ ] **Step 2: Add a `ready()` method that resolves when `_restoreState` is done**

In `Queue.js` constructor, capture the restore promise:
```js
this._readyPromise = this._restoreState().then(() => {
    processQueue();
});
```

Add the method below the constructor:
```js
    /**
     * Resolves once initial state has been restored from IndexedDB.
     */
    ready() {
        return this._readyPromise;
    }
```

Replace the existing constructor's call to `this._restoreState().then(...)` with the new line above.

- [ ] **Step 3: Add sync metadata accessors**

Add public methods to `Queue`:
```js
    getMetadataItems() {
        // Defensive shallow clone so callers can't mutate the index.
        return this._metadataIndex.map(m => ({...m}));
    }

    getMetadataLength() {
        return this._metadataIndex.length;
    }

    /**
     * Async: returns the full queue item for a given id, or null.
     */
    getFullItem(id) {
        return this._storage.loadItem(id);
    }

    /**
     * Async: returns full items for all current metadata entries, in order.
     * Use sparingly — this re-hydrates every payload.
     */
    async getFullItems() {
        const result = [];
        for (const m of this._metadataIndex) {
            const full = await this._storage.loadItem(m.id);
            if (full) result.push(full);
        }
        return result;
    }
```

- [ ] **Step 4: Replace `push(item)` with async version**

Find:
```js
    push(item) {
        this._queue.push(item);
    }
```

Replace with:
```js
    async push(item) {
        const id = generateId();
        await this._storage.saveItem(id, item);
        this._metadataIndex.push(projectMetadata(id, item));
        await this._storage.saveIndex(this._metadataIndex.map(m => m.id));
    }
```

- [ ] **Step 5: Run tests to verify the new test passes**

Run: `npx mocha test/unit/queue.test.js --grep "push"`
Expected: the new "push() persists to storage..." test PASSES. Other tests may still fail — those are addressed below.

- [ ] **Step 6: Commit**

```bash
git add browser/modules/api-bridge/Queue.js test/unit/queue.test.js
git commit -m "refactor(Queue): async push() with metadata index + per-item storage"
```

---

### Task 8: Rewrite remove operations as async

**Files:**
- Modify: `browser/modules/api-bridge/Queue.js`
- Modify: `test/unit/queue.test.js`

- [ ] **Step 1: Replace `removeByPrimaryKeys`**

Find and replace:
```js
    removeByPrimaryKeys(primaryKeys = []) {
        let initialNumberOfItems = this._queue.length;
        for (let j = 0; j < primaryKeys.length; j++) {
            let i = this._queue.length;
            while (i--) {
                const pkey = (this._queue[i].meta && this._queue[i].meta.pkey ? this._queue[i].meta.pkey : QUEUE_DEFAULT_PKEY);
                if (this._queue[i].feature.features[0].properties[pkey] === primaryKeys[j]) {
                    if (LOG) console.log('Queue: deleting item by primary key', primaryKeys[j], this._queue[i]);
                    this._queue.splice(i, 1);
                }
            }
        }
        if (this._queue.length !== (initialNumberOfItems - primaryKeys.length)) {
            throw new Error('Queue: some elements have not been deleted');
        }
        this._saveState();
        this._onUpdateListener(this._generateCurrentStatistics());
    }
```

With:
```js
    async removeByPrimaryKeys(primaryKeys = []) {
        const initial = this._metadataIndex.length;
        const targets = new Set(primaryKeys);
        const toDelete = this._metadataIndex.filter(m => targets.has(m.pkey)).map(m => m.id);
        for (const id of toDelete) {
            await this._storage.deleteItem(id);
        }
        this._metadataIndex = this._metadataIndex.filter(m => !toDelete.includes(m.id));
        if (this._metadataIndex.length !== (initial - primaryKeys.length)) {
            throw new Error('Queue: some elements have not been deleted');
        }
        await this._storage.saveIndex(this._metadataIndex.map(m => m.id));
        this._onUpdateListener(this._generateCurrentStatistics());
    }
```

- [ ] **Step 2: Replace `resubmitSkippedFeatures` and `removeByLayerId`**

Find:
```js
    resubmitSkippedFeatures() {
        for (let i = 0; i < this._queue.length; i++) {
            this._queue[i].skip = false;
        }
        this._saveState();
        this._onUpdateListener(this._generateCurrentStatistics());
    }
```

Replace with:
```js
    async resubmitSkippedFeatures() {
        for (const m of this._metadataIndex) {
            if (m.skip) {
                const fullItem = await this._storage.loadItem(m.id);
                if (fullItem) {
                    fullItem.skip = false;
                    await this._storage.saveItem(m.id, fullItem);
                    m.skip = false;
                }
            }
        }
        this._onUpdateListener(this._generateCurrentStatistics());
    }
```

Find `removeByLayerId` and update it similarly — operate on `_metadataIndex` for the filter and `_storage.deleteItem` for removal. (The current body is a few lines; the replacement preserves the same filter logic but routes through storage.)

Read the existing method first if you didn't write it from memory, then replace its body to:
```js
    async removeByLayerId(layerId) {
        if (!layerId) throw new Error(`Queue: layer identifier can not be empty`);
        const toDelete = this._metadataIndex
            .filter(m => m.table === layerId)
            .map(m => m.id);
        for (const id of toDelete) {
            await this._storage.deleteItem(id);
        }
        this._metadataIndex = this._metadataIndex.filter(m => !toDelete.includes(m.id));
        await this._storage.saveIndex(this._metadataIndex.map(m => m.id));
        this._onUpdateListener(this._generateCurrentStatistics());
    }
```

- [ ] **Step 3: Add a test for remove**

Append to `test/unit/queue.test.js`:

```js
    it("removeByPrimaryKeys deletes the storage record and the metadata entry", async () => {
        const store = new Map();
        global.localforage = {
            getItem: (k, cb) => setTimeout(() => cb(null, store.has(k) ? store.get(k) : null), 0),
            setItem: (k, v, cb) => setTimeout(() => { store.set(k, v); cb && cb(null, v); }, 0),
            removeItem: (k, cb) => setTimeout(() => { store.delete(k); cb && cb(null); }, 0),
        };

        const queue = new Queue(() => new Promise((resolve) => resolve()));
        await queue.ready();
        await queue.push(dummyRequest);
        const id = queue.getMetadataItems()[0].id;

        await queue.removeByPrimaryKeys([-1]);

        expect(queue.getMetadataLength()).to.equal(0);
        expect([...store.keys()].some(k => k.startsWith('queueItem:'))).to.equal(false);
    });
```

- [ ] **Step 4: Run tests**

Run: `npx mocha test/unit/queue.test.js --grep "remove"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add browser/modules/api-bridge/Queue.js test/unit/queue.test.js
git commit -m "refactor(Queue): async remove operations through storage"
```

---

### Task 9: Update internal duplicate-detection and oldest-item helpers

**Files:**
- Modify: `browser/modules/api-bridge/Queue.js`

- [ ] **Step 1: Refactor `_eliminateItemsWithSameIdentifier`**

This helper iterates pairs in the queue and consolidates them. It currently reads `feature.features[0].properties[pkey]` which lives in the full item. After refactor it should:

1. Use `this._metadataIndex` to find pairs with the same `pkey` + `table`.
2. Load the relevant full items from storage when a merge is needed.
3. Re-save merged items, update the index.

Replace the existing method body. The exact logic should mirror the original (consolidate consecutive ADD+UPDATE, or UPDATE+UPDATE, etc.) but using metadata for the search and `getFullItem`/`saveItem` for the merges. Since this method was synchronous, mark it `async`:

```js
    async _eliminateItemsWithSameIdentifier() {
        // Group metadata entries by (table, pkey) to find duplicates.
        const groups = new Map();
        for (const m of this._metadataIndex) {
            const key = `${m.table}::${m.pkey}`;
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(m);
        }
        for (const [key, group] of groups) {
            if (group.length < 2) continue;
            // Preserve original semantics: keep the first item (initial state) and
            // overlay subsequent edits onto a single merged item.
            const first = group[0];
            const last = group[group.length - 1];
            const initialFull = await this._storage.loadItem(first.id);
            const latestFull = await this._storage.loadItem(last.id);
            if (!initialFull || !latestFull) continue;
            // Merge: latest properties override initial; geometry from latest.
            const mergedFull = {
                ...latestFull,
                feature: {
                    ...latestFull.feature,
                    features: [{
                        ...latestFull.feature.features[0],
                        properties: {
                            ...initialFull.feature.features[0].properties,
                            ...latestFull.feature.features[0].properties
                        }
                    }]
                }
            };
            // Save the merged item under the first id; delete the rest.
            await this._storage.saveItem(first.id, mergedFull);
            const newMd = projectMetadata(first.id, mergedFull);
            const toDelete = group.slice(1).map(m => m.id);
            for (const id of toDelete) await this._storage.deleteItem(id);
            this._metadataIndex = this._metadataIndex
                .map(m => m.id === first.id ? newMd : m)
                .filter(m => !toDelete.includes(m.id));
        }
        await this._storage.saveIndex(this._metadataIndex.map(m => m.id));
    }
```

- [ ] **Step 2: Refactor `_getOldestNonSkippedItem`**

Original returns `{item, index}` referencing the in-memory item. New version returns `{metadata, index}` for callers that need the metadata; callers that need the full item should call `await this.getFullItem(metadata.id)`.

Replace the existing method body:

```js
    _getOldestNonSkippedItem(offset = 0) {
        for (let i = offset; i < this._metadataIndex.length; i++) {
            if (!this._metadataIndex[i].skip) {
                return {metadata: this._metadataIndex[i], index: i};
            }
        }
        return null;
    }
```

- [ ] **Step 3: Update internal callers of `_getOldestNonSkippedItem`**

Within `processQueue` (and any other internal callers) find usages like `itemToProcessData.item.feature...` and change to:
```js
const fullItem = await this._storage.loadItem(itemToProcessData.metadata.id);
if (!fullItem) {
    // already removed; advance offset
    queueSearchOffset = itemToProcessData.index + 1;
    return scheduleNextQueueProcessingRun();
}
// ...use fullItem in place of the old itemToProcessData.item
```

This makes the inner block `async`. Look at the existing `processQueue` and wrap the relevant block in an async IIFE or `await` chain. (`processQueue` is currently a closure that uses `.then` chaining; converting just the inner code to `async` is fine.)

- [ ] **Step 4: Verify**

Run: `npx mocha test/unit/queue.test.js`
Expected: still passing the tests added so far.

- [ ] **Step 5: Commit**

```bash
git add browser/modules/api-bridge/Queue.js
git commit -m "refactor(Queue): operate on metadata index, load full items on demand"
```

---

## Phase 3 — Caller migration

### Task 10: Make `apiBridge.transformResponseHandler` async

**Files:**
- Modify: `browser/modules/api-bridge/index.js`

- [ ] **Step 1: Convert function signature to async and switch to metadata + full-item loads**

Find the existing `transformResponseHandler(response, tableId)` method. Replace its body with:

```js
    async transformResponseHandler(response, tableId) {
        if (LOG) console.log('APIBridge: running transformResponse handler');

        if (this._queue.getMetadataLength() > 0) {
            const metadata = this._queue.getMetadataItems();

            // 1) DELETE pending requests: remove matching features from the response.
            for (const md of metadata) {
                if (`v:${md.table}` !== tableId) continue;
                if (md.type !== Queue.DELETE_REQUEST) continue;
                const features = copyArray(response.features);
                for (let i = 0; i < features.length; i++) {
                    if (features[i].properties[md.pkeyField] === md.pkey) {
                        features.splice(i, 1);
                        break;
                    }
                }
                response.features = features;
            }

            // 2) Skip-virtual-pkey cleanup: stays the same logic but reads only metadata.
            for (const md of metadata) {
                if (`v:${md.table}` !== tableId) continue;
                if (md.type !== Queue.DELETE_REQUEST) continue;
                if (md.pkey < 0) {
                    const virtual = md.pkey;
                    const toRemove = metadata
                        .filter(o => [Queue.ADD_REQUEST, Queue.UPDATE_REQUEST].indexOf(o.type) !== -1 && o.pkey === virtual)
                        .map(o => o.pkey);
                    await this._queue.removeByPrimaryKeys(toRemove);
                }
            }

            // 3) ADD / UPDATE: load each full item from storage and inject into response.
            const refreshedMetadata = this._queue.getMetadataItems();
            for (const md of refreshedMetadata) {
                if (`v:${md.table}` !== tableId) continue;
                if (md.type !== Queue.ADD_REQUEST && md.type !== Queue.UPDATE_REQUEST) continue;

                const fullItem = await this._queue.getFullItem(md.id);
                if (!fullItem) continue;

                // The injected feature must be isolated from the stored item so
                // later mutations (e.g. prepareDataForTableView setting _vidi_content)
                // don't propagate back into storage.
                const isolatedFeature = {
                    ...fullItem.feature.features[0],
                    meta: {apiRecognitionStatus: md.skip ? 'rejected_by_server' : 'pending',
                           ...(md.serverErrorMessage ? {serverErrorMessage: md.serverErrorMessage} : {}),
                           ...(md.serverErrorType ? {serverErrorType: md.serverErrorType} : {})},
                    properties: {...fullItem.feature.features[0].properties}
                };

                if (md.type === Queue.ADD_REQUEST) {
                    response.features.push(isolatedFeature);
                } else {
                    const features = copyArray(response.features);
                    for (let i = 0; i < features.length; i++) {
                        if (features[i].properties[md.pkeyField] === md.pkey) {
                            features[i] = isolatedFeature;
                            break;
                        }
                    }
                    response.features = features;
                }
            }

            if (LOG) console.log('APIBridge: # Result of transformResponse handler', response.features.length);
        }

        return response;
    }
```

- [ ] **Step 2: Update the three `push`/`update`/`delete` methods to await Queue.push**

Find `addFeature`, `updateFeature`, `deleteFeature` and `await this._queue.pushAndProcess(...)`. Currently `pushAndProcess` was inherited from the old Queue API — confirm in the updated Queue.js it is still present. If you renamed it to `push`, update callers accordingly. Each method becomes `async`:

```js
    async addFeature(feature, db, meta) {
        let copiedFeature = sanitizeFeatureCollectionForPayload(feature);
        // ...existing pkey assignment...
        this._validateFeatureData(db, meta, copiedFeature);
        return await this._queue.pushAndProcess({type: Queue.ADD_REQUEST, feature: copiedFeature, db, meta});
    }
```

Update `updateFeature` and `deleteFeature` analogously.

- [ ] **Step 3: Verify the module still parses**

Run: `node -e "const A = require('./browser/modules/api-bridge'); console.log('ok');"`
Expected: `ok`

- [ ] **Step 4: Commit**

```bash
git add browser/modules/api-bridge/index.js
git commit -m "refactor(apiBridge): async transformResponseHandler reading queue from storage"
```

---

### Task 11: Update geocloud.success to await async transformResponse

**Files:**
- Modify: `browser/modules/geocloud.js`

- [ ] **Step 1: Find the success callback (currently around line 341)**

Locate:
```js
success: function (response) {
    if (response.success === false && doNotShowAlertOnError === undefined) {
        alert(response.message);
    }
    if (response.success === true) {
        if (response.features !== null) {
            response = me.transformResponse(response, me.id);
            let clone = {...response};
            // ... rest of body
```

- [ ] **Step 2: Convert to async and await transformResponse**

Replace the `success: function (response) {` line with `success: async function (response) {`.

Replace:
```js
response = me.transformResponse(response, me.id);
```

With:
```js
response = await me.transformResponse(response, me.id);
```

The rest of the body uses the (now resolved) response synchronously — no further changes needed.

- [ ] **Step 3: Verify build**

Run: `node build.mjs`
Expected: build completes with no errors. Look in console output for warnings.

- [ ] **Step 4: Commit**

```bash
git add browser/modules/geocloud.js
git commit -m "refactor(geocloud): await async transformResponse before processing"
```

---

### Task 12: Update remaining internal Queue caller — `pushAndProcess` and processor flow

**Files:**
- Modify: `browser/modules/api-bridge/Queue.js`

- [ ] **Step 1: Locate `pushAndProcess` (around line 510-550 in current source)**

It currently calls `this._eliminateItemsWithSameIdentifier()` and `this.push(item)` synchronously. Both are now async; chain them with await:

```js
    async pushAndProcess(item) {
        await this.push(item);
        await this._eliminateItemsWithSameIdentifier();
        // ... existing PROCESS_FIRST_ELEMENT_IMMEDIATELY branch
        // (wrap that branch's body in await as needed)
    }
```

Look at the existing body and convert any branches that operate on the queue to await async ops.

- [ ] **Step 2: Verify**

Run: `npx mocha test/unit/queue.test.js`
Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add browser/modules/api-bridge/Queue.js
git commit -m "refactor(Queue): await async push/eliminate in pushAndProcess"
```

---

## Phase 4 — Cleanup and verification

### Task 13: Remove the obsolete `getItems()` shim

**Files:**
- Modify: `browser/modules/api-bridge/Queue.js`

- [ ] **Step 1: Confirm no remaining callers of `getItems()`**

Run:
```bash
grep -rn "\.getItems()" browser extensions 2>/dev/null | grep -v node_modules | grep -v public
```
Expected: 0 results. If any remain, update those callers to `getMetadataItems()` / `getFullItem(id)` before proceeding.

- [ ] **Step 2: Delete the `getItems()` method**

In `Queue.js`, remove the existing `getItems()` method definition entirely.

- [ ] **Step 3: Run tests**

Run: `npx mocha test/unit/queue.test.js test/unit/queueStorage.test.js`
Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add browser/modules/api-bridge/Queue.js
git commit -m "refactor(Queue): remove deprecated getItems() in favor of metadata + getFullItem"
```

---

### Task 14: Update or add stats helpers to use metadata only

**Files:**
- Modify: `browser/modules/api-bridge/Queue.js`

- [ ] **Step 1: Locate `_generateCurrentStatistics` and any UI helpers (e.g. `getNumberOfItems`)**

Replace any reference to `this._queue` with `this._metadataIndex`. Stats only need metadata (counts per table, error states, online flag), so the rewrite should not need full items.

Example for `_generateCurrentStatistics`:

```js
    _generateCurrentStatistics() {
        const stats = {online: this._online};
        for (const md of this._metadataIndex) {
            stats[md.table] = (stats[md.table] || 0) + 1;
        }
        return stats;
    }
```

(Verify against the existing implementation — the current method may have richer structure; preserve its outer shape and only change the iteration source.)

- [ ] **Step 2: Verify**

Run: `npx mocha test/unit/queue.test.js`
Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add browser/modules/api-bridge/Queue.js
git commit -m "refactor(Queue): stats use metadata index instead of in-memory queue"
```

---

### Task 15: Memory verification — write a heap-snapshot test note

**Files:**
- Create: `docs/superpowers/notes/2026-05-20-queue-idb-memory-verification.md`

- [ ] **Step 1: Document the manual verification procedure**

Create the file with this content:

```markdown
# Queue → IndexedDB Memory Verification

After the Queue → IndexedDB refactor, verify no base64 bytea payload lives in
the JS heap when no editor form is mounted.

## Steps

1. Load Vidi in Chrome. Open DevTools → Memory tab.
2. Open the editor, attach a file (e.g. JPEG) to a bytea[] field, submit.
   The queue should now have one pending item.
3. Close the editor form (Cancel) — Fix F should unmount the React tree.
4. Take a heap snapshot. Filter by `data:image`.
   - Expected: 0 results. The full item lives in IndexedDB only.
5. Toggle the vector layer off and on. Take another snapshot.
   - Expected: 0 `data:image` strings. transformResponseHandler injects from
     IndexedDB only when needed for display, and the isolated copy is GC'd
     after the layer load completes.
6. Open the editor on the pending feature. FileUploadWidget will fetch the
   bytea URL → blob URL for display.
   - Expected: 1 base64 string in `formData` (RJSF form state). 0 in the
     queue's memory representation.
7. Submit successfully (online). Queue empties.
   - Expected: 0 `data:image` strings in heap.

## What "1 base64 in form state" means

RJSF's `FileBlock.formData` holds the dataUrl while the form is mounted. This
is the single allowed copy per the original spec ("kun en kopi, når filen er
loaded i formularen").

## Acceptance

If any step shows more `data:image` strings than expected, capture the
retainer chain of the unexpected string(s) and re-open the planning thread.
```

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/notes/2026-05-20-queue-idb-memory-verification.md
git commit -m "docs: queue → IndexedDB memory verification procedure"
```

---

### Task 16: Smoke test — full end-to-end queue cycle

**Files:**
- Modify: `test/unit/queue.test.js`

- [ ] **Step 1: Add an end-to-end test that exercises push → process → success → metadata-cleared**

Append to `test/unit/queue.test.js`:

```js
    it("push → process → success removes both metadata and storage record", async () => {
        const store = new Map();
        global.localforage = {
            getItem: (k, cb) => setTimeout(() => cb(null, store.has(k) ? store.get(k) : null), 0),
            setItem: (k, v, cb) => setTimeout(() => { store.set(k, v); cb && cb(null, v); }, 0),
            removeItem: (k, cb) => setTimeout(() => { store.delete(k); cb && cb(null); }, 0),
        };

        // Processor that always resolves (simulating successful POST).
        const queue = new Queue((item, q) => Promise.resolve());
        await queue.ready();

        await queue.pushAndProcess(dummyRequest);

        // Wait briefly for the processor to run (it's setTimeout-driven).
        await new Promise(r => setTimeout(r, 100));

        // After successful processing, metadata and storage should both be empty.
        expect(queue.getMetadataLength()).to.equal(0);
        expect([...store.keys()].some(k => k.startsWith('queueItem:'))).to.equal(false);
    });
```

- [ ] **Step 2: Run all queue tests**

Run: `npx mocha test/unit/queue.test.js test/unit/queueStorage.test.js`
Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add test/unit/queue.test.js
git commit -m "test: end-to-end queue push → process → cleanup"
```

---

### Task 17: Full build + ship verification

**Files:**
- None (build + smoke test).

- [ ] **Step 1: Production build**

Run: `npm run build:production`
Expected: completes without errors; `public/js/bundle.js` is updated.

- [ ] **Step 2: Manual smoke test in browser**

Load Vidi. With the browser DevTools Network tab open:
1. Add a feature with a bytea file attachment, submit.
2. Verify POST `/api/feature/...` payload contains NO `_vidi_content`, NO `_id`, NO `_vidi_edit_*`.
3. Edit an existing feature, submit. Verify PUT payload same as above.
4. Toggle layer off and on. No console errors.
5. Open Application tab → IndexedDB → `localforage` store. Look for `queueItem:*` and `queueIndex:*` keys. The legacy `queue:*` key should NOT be present (migrated and deleted).

- [ ] **Step 3: Run all tests**

Run: `npm test` (or `npx mocha --recursive test/unit` if full suite is slow)
Expected: pass.

- [ ] **Step 4: Final commit if any final tweaks**

```bash
git status
# if clean, no commit needed
```

- [ ] **Step 5: Merge note**

If working on a feature branch, mark the branch ready for review/merge. If on master, ensure all changes are committed.

---

## Self-review checklist (for the engineer)

Before declaring this complete:

- [ ] No remaining references to `this._queue` (the old array) in `Queue.js`.
- [ ] No remaining references to `this._queue.getItems()` in any file.
- [ ] `pushAndProcess`, `push`, `removeByPrimaryKeys`, `resubmitSkippedFeatures`, `removeByLayerId`, `_eliminateItemsWithSameIdentifier` all return Promises (or are `async`) and callers await them.
- [ ] `transformResponseHandler` is `async`; `geocloud.success` awaits it.
- [ ] `getMetadataItems()` returns shallow-cloned metadata (never the live index array).
- [ ] Migration is idempotent: running twice does nothing on the second pass.
- [ ] No queue test reads `queue._queue` (renamed to `_metadataIndex`).
- [ ] Heap snapshot procedure in `docs/superpowers/notes/...` matches actual behavior.

## Risks / known limitations

- **Concurrent ops**: This plan keeps the existing single-tab Queue model. If two browser tabs share the same IndexedDB, writes can race. Out of scope here.
- **Performance under high churn**: Per-item writes are smaller than a single full-blob write, but a queue with hundreds of items does more IDB round-trips. Acceptable for the user case (handful of pending edits at most).
- **Migration failure**: If `migrateLegacyBlob` throws partway, the legacy key is NOT deleted (we only remove it after all items are written). Retrying on next page load restarts cleanly.
- **Test-mock fidelity**: The mock in tests uses `setTimeout(0)`, real IndexedDB has longer latency. Behavior should match, but expect transient timing differences when debugging in the browser.
