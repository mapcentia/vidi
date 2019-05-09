/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

let config = require('./../../config/config');
let express = require('express');
let router = express.Router();
const uuid = require('uuid/v1');
const request = require('request');
const shared = require('./shared');

const TRACKER_COOKIE_NAME = `vidi-state-tracker`;

if (!config.gc2.host) throw new Error(`Unable to get the GC2 host from config`);
const API_LOCATION = config.gc2.host + `/api/v2/keyvalue`;

/**
 * Return identifiers of the currently authenticated user
 * 
 * @returns {Object}
 */
const getCurrentUserIdentifiers = (request) => {
    let browserId = false;
    if (TRACKER_COOKIE_NAME in request.cookies) {
        browserId = request.cookies[TRACKER_COOKIE_NAME];
    }

    let userId = false;
    if (`gc2UserName` in request.session && request.session.gc2UserName) {
        userId = request.session.gc2UserName;
    }

    return { browserId, userId };
};

/*
How state snapshot is stored in the key-value storage:

{
    // Snapshot identifier, used as a key in storage
    id: "state_snapshot_123",
    // Optional title
    title: "abc",
    // Database
    database: "test",
    // Schema
    schema: "schema",
    // Host
    host: "https://example.com/",
    // Property that specifies owner of the snapshot
    browserId: "123" || userId: "123",
    // Snapshot body
    body: {
        map: { ... }
        modules: { ... }
    }
}

*/

/**
 * List available state snapshots
 */
router.get('/api/state-snapshots/:dataBase', (req, res, next) => {
    let { browserId, userId } = getCurrentUserIdentifiers(req);

    request({
        method: 'GET',
        encoding: 'utf8',
        uri: API_LOCATION + `/` + req.params.dataBase
    }, (error, response) => {
        if (error) {
            shared.throwError(res, 'INVALID_OR_EMPTY_EXTERNAL_API_REPLY', { error });
            return;
        }

        let parsedBody = false;
        try {
            let localParsedBody = JSON.parse(response.body);
            parsedBody = localParsedBody;
        } catch (e) {}

        if (parsedBody) {
            // Filter by browser and user ownership
            let results = [];
            parsedBody.data.map(item => {
                let parsedSnapshot = JSON.parse(item.value);
                if (parsedSnapshot.anonymous || parsedSnapshot.browserId && parsedSnapshot.browserId === browserId ||
                    parsedSnapshot.userId && parsedSnapshot.userId === userId) {
                    results.push(parsedSnapshot);
                }
            });

            res.send(results);
        } else {
            shared.throwError(res, 'INVALID_OR_EMPTY_EXTERNAL_API_REPLY', {
                body: response.body,
                url: API_LOCATION + `/` + req.params.dataBase
            });
        }
    });
});

/**
 * Get specific state snapshots
 */
router.get('/api/state-snapshots/:dataBase/:id', (req, res, next) => {
    let { browserId, userId } = getCurrentUserIdentifiers(req);

    request({
        method: 'GET',
        encoding: 'utf8',
        uri: API_LOCATION + `/` + req.params.dataBase + '/' + req.params.id
    }, (error, response) => {
        let parsedBody = false;
        try {
            let localParsedBody = JSON.parse(response.body);
            parsedBody = localParsedBody;
        } catch (e) {}

        if (parsedBody) {
            let result = false;
            let parsedSnapshot = JSON.parse(parsedBody.data.value);
            if (parsedSnapshot.anonymous || parsedSnapshot.browserId && parsedSnapshot.browserId === browserId ||
                parsedSnapshot.userId && parsedSnapshot.userId === userId) {
                result = parsedSnapshot;
            }

            if (result === false) {
                res.status(404);
                res.json({ error: `NOT_FOUND` });
            } else {
                res.send(result);
            }
        } else {
            shared.throwError(res, 'INVALID_OR_EMPTY_EXTERNAL_API_REPLY', { body: response.body });
        }
    });
});

/**
 * Generates token for state snapshot
 * 
 * @param {Object} stateSnapshot Tokenized state snapshot
 * 
 * @returns {String}
 */
const generateToken = (stateSnapshot) => {
    let stateSnapshotCleanedUpCopy = Object.assign({}, stateSnapshot);

    // Delete the token property, so the token itself is not encoded
    if (stateSnapshotCleanedUpCopy.token !== undefined) {
        delete stateSnapshotCleanedUpCopy.token;
    }

    // No need to carry the "snapshot" property
    stateSnapshotCleanedUpCopy.snapshot = false;

    // Specifying "config" and "tmpl" options at higher level
    if (stateSnapshot.snapshot.meta && stateSnapshot.snapshot.meta.config) stateSnapshotCleanedUpCopy.config = stateSnapshot.snapshot.meta.config;
    if (stateSnapshot.snapshot.meta && stateSnapshot.snapshot.meta.tmpl) stateSnapshotCleanedUpCopy.tmpl = stateSnapshot.snapshot.meta.tmpl;

    let token = Buffer.from(JSON.stringify(stateSnapshotCleanedUpCopy)).toString('base64');
    return token;
};

/**
 * Create state snapshot
 */
router.post('/api/state-snapshots/:dataBase', (req, res, next) => {
    if (`snapshot` in req.body) {
        let { browserId, userId } = getCurrentUserIdentifiers(req);

        let save = false;
        let stateSnapshotCopy = JSON.parse(JSON.stringify(req.body));
        if ((req.body.anonymous === 'true' || req.body.anonymous === true) && browserId) {
            stateSnapshotCopy.browserId = browserId;
            save = true;
        } else if ((req.body.anonymous === 'false' || req.body.anonymous === false) && userId) {
            stateSnapshotCopy.userId = userId;
            save = true;
        } else {
            shared.throwError(res, 'INVALID_SNAPSHOT_OWNERSHIP');
        }

        if (save) {
            let generatedKey = `state_snapshot_` + uuid();
            let currentDate = new Date();
            stateSnapshotCopy.id = generatedKey;
            stateSnapshotCopy.created_at = currentDate.toISOString();

            if (!stateSnapshotCopy.host || !stateSnapshotCopy.database || !stateSnapshotCopy.schema) {
                shared.throwError(res, 'MISSING_DATA');
            } else {
                let token = generateToken(stateSnapshotCopy);
                stateSnapshotCopy.token = token;

                request({
                    method: 'POST',
                    encoding: 'utf8',
                    uri: API_LOCATION + `/` + req.params.dataBase + `/` + generatedKey,
                    form: JSON.stringify(stateSnapshotCopy)
                }, (error, response) => {
                    let parsedBody = false;
                    try {
                        let localParsedBody = JSON.parse(response.body);
                        parsedBody = localParsedBody;
                    } catch (e) {}

                    if (parsedBody) {
                        if (parsedBody.success) {
                            res.json({
                                id: generatedKey,
                                token: token,
                                status: 'success'
                            });
                        } else {
                            shared.throwError(res, parsedBody.message);
                        }
                    } else {
                        shared.throwError(res, 'INVALID_OR_EMPTY_EXTERNAL_API_REPLY', { body: response.body });
                    } 
                });
            }
        }
    } else {
        shared.throwError(res, 'MISSING_DATA');
    }
});

/**
 * Seize state snapshot
 */
router.put('/api/state-snapshots/:dataBase/:stateSnapshotKey/seize', (req, res, next) => {
    let { browserId, userId } = getCurrentUserIdentifiers(req);
    if (userId && browserId) {
        // Get the specified state snapshot
        request({
            method: 'GET',
            encoding: 'utf8',
            uri: API_LOCATION + `/` + req.params.dataBase + `/` + req.params.stateSnapshotKey,
        }, (error, response) => {
            if (response.body.data === false) {
                shared.throwError(res, 'INVALID_SNAPSHOT_ID');
            } else {
                let parsedBody = false;
                try {
                    let localParsedBody = JSON.parse(response.body);
                    parsedBody = localParsedBody;
                } catch (e) {}
    
                if (parsedBody) {
                    let parsedSnapshotData = JSON.parse(parsedBody.data.value);
                    parsedSnapshotData.browserId = false;
                    parsedSnapshotData.anonymous = false;
                    parsedSnapshotData.userId = userId;
                    request({
                        method: 'PUT',
                        encoding: 'utf8',
                        uri: API_LOCATION + `/` + req.params.dataBase + `/` + req.params.stateSnapshotKey,
                        form: JSON.stringify(parsedSnapshotData)
                    }, (error, response) => {
                        res.send({ status: 'success' });
                    });
                } else {
                    shared.throwError(res, 'INVALID_OR_EMPTY_EXTERNAL_API_REPLY', { body: response.body });
                }
            }
        });
    } else {
        shared.throwError(res, 'UNABLE_TO_GET_USER_IDENTIFIERS');
    }
});

/**
 * Update state snapshot
 */
router.put('/api/state-snapshots/:dataBase/:stateSnapshotKey', (req, res, next) => {
    if (`snapshot` in req.body) {
        let { browserId, userId } = getCurrentUserIdentifiers(req);
        // Get the specified state snapshot
        request({
            method: 'GET',
            encoding: 'utf8',
            uri: API_LOCATION + `/` + req.params.dataBase + `/` + req.params.stateSnapshotKey,
        }, (error, response) => {
            if (response.body.data === false) {
                shared.throwError(res, 'INVALID_SNAPSHOT_ID');
            } else {
                let parsedBody = false;
                try {
                    let localParsedBody = JSON.parse(response.body);
                    parsedBody = localParsedBody;
                } catch (e) {}
    
                if (parsedBody) {
                    let parsedSnapshotData = JSON.parse(parsedBody.data.value);
                    if (`browserId` in parsedSnapshotData && parsedSnapshotData.browserId === browserId ||
                        `userId` in parsedSnapshotData && parsedSnapshotData.userId === userId) {
                        parsedSnapshotData.snapshot = req.body.snapshot;
                        if (req.body.title) parsedSnapshotData.title = req.body.title;

                        let token = generateToken(parsedSnapshotData);
                        parsedSnapshotData.token = token;
                        request({
                            method: 'PUT',
                            encoding: 'utf8',
                            uri: API_LOCATION + `/` + req.params.dataBase + `/` + req.params.stateSnapshotKey,
                            form: JSON.stringify(parsedSnapshotData)
                        }, (error, response) => {
                            res.send({ status: 'success' });
                        });
                    } else {
                        shared.throwError(res, 'ACCESS_DENIED');
                    }
                } else {
                    shared.throwError(res, 'INVALID_OR_EMPTY_EXTERNAL_API_REPLY', { body: response.body });
                }
            }
        });
    } else {
        shared.throwError(res, 'MISSING_DATA');
    }
});

/**
 * Delete state snapshot
 */
router.delete('/api/state-snapshots/:dataBase/:stateSnapshotKey', (req, res, next) => {
    let { browserId, userId } = getCurrentUserIdentifiers(req);
    // Get the specified state snapshot
    request({
        method: 'GET',
        encoding: 'utf8',
        uri: API_LOCATION + `/` + req.params.dataBase + `/` + req.params.stateSnapshotKey,
    }, (error, response) => {
        if (response.body.data === false) {
            shared.throwError(res, 'INVALID_SNAPSHOT_ID');
        } else {
            let parsedBody = false;
            try {
                let localParsedBody = JSON.parse(response.body);
                parsedBody = localParsedBody;
            } catch (e) {}

            if (parsedBody && parsedBody.data.value) {
                let parsedSnapshotData = JSON.parse(parsedBody.data.value);
                if (`browserId` in parsedSnapshotData && parsedSnapshotData.browserId === browserId ||
                    `userId` in parsedSnapshotData && parsedSnapshotData.userId === userId) {
                    request({
                        method: 'DELETE',
                        encoding: 'utf8',
                        uri: API_LOCATION + `/` + req.params.dataBase + `/` + req.params.stateSnapshotKey,
                    }, (error, response) => {
                        res.send({ status: 'success' });
                    });
                } else {
                    shared.throwError(res, 'ACCESS_DENIED');
                }
            } else {
                shared.throwError(res, 'INVALID_OR_EMPTY_EXTERNAL_API_REPLY', { body: response.body });
            }
        }
    });
});

module.exports = router;
