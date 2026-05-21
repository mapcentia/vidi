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
}

module.exports = QueueStorage;
module.exports.LEGACY_PREFIX = LEGACY_PREFIX;
module.exports.INDEX_PREFIX = INDEX_PREFIX;
module.exports.ITEM_PREFIX = ITEM_PREFIX;
