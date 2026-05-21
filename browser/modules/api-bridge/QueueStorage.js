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
