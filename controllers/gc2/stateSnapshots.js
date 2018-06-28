let fs = require('fs');
let crypto = require('crypto');
let express = require('express');
let router = express.Router();

const TRACKER_COOKIE_NAME = `vidi-state-tracker`;
const storage = `./temporary-state-storage.json`;
const throwError = (response, errorCode) => {
    response.status(400);
    response.json({ error: errorCode });
};

const getSnapshots = (onlyBrowser = false, browserId = false, userId = 100) => {
    return new Promise((resolve, reject) => {
        fs.readFile(storage, (error, data) => {
            if (error) {
                console.log(error);
                reject(`UNABLE_TO_READ_FILE`);
            } else {
                let result = [];
                let parsedData = JSON.parse(data.toString());
                parsedData.map(item => {
                    if (!item.userId && !item.browserId) {
                        throw new Error(`Unable to detect to whom snapshot belongs`);
                    }

                    if (onlyBrowser) {
                        if (item.browserId && item.browserId.length > 0) {
                            result.push(item);
                        }
                    } else {
                        if (item.userId && item.userId === 100) {
                            result.push(item);
                        } else if (item.browserId) {
                            result.push(item);
                        }
                    }
                });

                resolve(result);
            }
        });
    });
};

const saveSnapshots = (snapshots) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(storage, JSON.stringify(snapshots), (error) => {
            if (error) {
                console.log(error);
                reject(`UNABLE_TO_WRITE_FILE`);
            } else {                        
                resolve();
            }
        });
    });
};

const appendToSnapshots = (snapshot, browserId) => {
    return new Promise((resolve, reject) => {
        getSnapshots().then(data => {
            let hash = crypto.randomBytes(20).toString('hex');
            snapshot.id = hash;

            let currentDate = new Date();
            snapshot.created_at = currentDate.toISOString();

            if (browserId) {
                snapshot.browserId = browserId;
            } else {
                snapshot.userId = 100; // @todo Provide GC2 user id (owner's)
            }

            data.push(snapshot);
            saveSnapshots(data).then(() => {
                resolve(hash);
            }).catch(errorCode => {
                reject(errorCode);
            });

        }).catch(errorCode => {
            reject(errorCode);
        });
    });
};

/**
 * Listing available state snapshots
 */
router.get('/api/state-snapshots', (request, response, next) => {
    fs.stat(storage, (error, stats) => {
        if (error) fs.writeFileSync(storage, `[]`);

        /*
            Get all state snapshots that have current browserId (taken from
            cookies) and (if user is authorized) userId
        */

        // Mock code <--
        let browserId = false;
        if (TRACKER_COOKIE_NAME in request.cookies) {
            browserId = request.cookies[TRACKER_COOKIE_NAME];
        }

        let userId = false;
        if (`connect.gc2` in request.cookies) {
            userId = 100;
        }
        // -->

        if (browserId && userId === false) {
            getSnapshots(browserId).then(data => {
                response.json(data);
            }).catch(error => {
                console.log(error);
                throwError(response, 'UNABLE_TO_OPEN_DATABASE');
            });
        } else if (browserId || userId) {
            getSnapshots().then(data => {
                response.json(data);
            }).catch(error => {
                console.log(error);
                throwError(response, 'UNABLE_TO_OPEN_DATABASE');
            });
        } else {
            throwError(response, 'NO_BROWSER_OR_USER_ID');
        }
    });
});

/**
 * Returning specific state snapshot
 */
router.get('/api/state-snapshots/:id', (request, response, next) => {
    fs.stat(storage, (error, stats) => {
        if (error) fs.writeFileSync(storage, `[]`);

        /*
            Get specific state snapshot with identifier
        */
        getSnapshots().then(data => {
            let result = false;
            data.map(item => {
                if (item.id === request.params.id) {
                    result = item;
                    return false;
                }
            });

            if (result) {
                response.json(result);
            } else {
                throwError(response, 'INVALID_SNAPSHOT_ID');
            }
        }).catch(error => {
            console.log(error);
            throwError(response, 'UNABLE_TO_OPEN_DATABASE');
        }); 
    });
});

/**
 * Update specific state snapshot
 */
router.put('/api/state-snapshots/:id', (request, response, next) => {
    fs.stat(storage, (error, stats) => {
        if (error) fs.writeFileSync(storage, `[]`);

        /*
            Update specific state snapshot with identifier, clear the browserId
            field and set userId field with the authorized user identifier
        */
        getSnapshots().then(data => {
            let searched = false;
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === request.params.id) {
                    searched = data.splice(i, 1).pop();
                    break;
                }
            }

            searched.browserId = false;
            searched.userId = 100;
            data.push(searched);
            saveSnapshots(data).then(() => {
                response.json({ status: 'success' });
            }).catch(errorCode => {
                throwError(response, errorCode);
            });
        }).catch(error => {
            console.log(error);
            throwError(response, 'UNABLE_TO_OPEN_DATABASE');
        }); 
    });
});

router.post('/api/state-snapshots', (request, response, next) => {
    if (`snapshot` in request.body) {

        /*
            If "anonymous" parameter is set to "true", then stored state snapshot should belong
            to the browser, so the browserId should be set. Otherwise, the created state snapshot
            belongs to current user and has its userId field set.
        */
       console.log('### request.body', request.body);
        if (request.body.anonymous === 'true' || request.body.anonymous === true) {
            if (TRACKER_COOKIE_NAME in request.cookies) {
                appendToSnapshots(request.body, request.cookies[TRACKER_COOKIE_NAME]).then(id => {
                    response.json({ id, status: 'success' });
                }).catch(errorCode => {
                    throwError(response, errorCode);
                });
            } else {
                throw new Error(`Cannot find ${TRACKER_COOKIE_NAME} in cookies`);
            }
        } else if (request.body.anonymous === 'false' || request.body.anonymous === false) {
            // @todo Push to GC2
            // By this moment user has to be authorized, otherwise 403 will be returned
            appendToSnapshots(request.body).then(id => {
                response.json({ id, status: 'success' });
            }).catch(errorCode => {
                throwError(response, errorCode);
            });
        } else {
            throwError(response, 'INVALID_SNAPSHOT_OWNERSHIP');
        }
    } else {
        throwError(response, 'MISSING_DATA');
    }
});

router.delete('/api/state-snapshots/:id', (request, response, next) => {
    // Mock code <--
    let browserId = false;
    if (TRACKER_COOKIE_NAME in request.cookies) {
        browserId = request.cookies[TRACKER_COOKIE_NAME];
    }

    let userId = false;
    if (`connect.gc2` in request.cookies) {
        userId = 100;
    }
    // -->

    /*
        Delete specific state snapshot with identifier
    */
    getSnapshots().then(data => {
        let snapshotIndex = -1;
        data.map((item, index) => {
            if (item.id === request.params.id) {
                if (item.browserId && item.browserId.length > 0) {
                    if (item.browserId === browserId) {
                        snapshotIndex = index;
                        return false;
                    }
                } else {
                    if (item.userId === userId) {
                        snapshotIndex = index;
                        return false;
                    }
                }
            }
        });

        if (snapshotIndex < 0) {
            throwError(response, 'UNABLE_TO_FIND_SNAPSHOT');
        } else {
            data.splice(snapshotIndex, 1);
            saveSnapshots(data).then(() => {
                response.json({ status: 'success' });
            }).catch(errorCode => {
                throwError(response, errorCode);
            });
        }
    }).catch(error => {
        console.log(error);
        throwError(response, 'UNABLE_TO_OPEN_DATABASE');
    });
});

module.exports = router;

