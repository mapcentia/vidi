/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

let fs = require('fs');
let express = require('express');
let router = express.Router();

const USE_KEY_VALUE_STORAGE = false;

const fileStorage = require('./fileStorage.js');

const TRACKER_COOKIE_NAME = `vidi-state-tracker`;

const throwError = (response, errorCode) => {
    response.status(400);
    response.json({ error: errorCode });
};


if (USE_KEY_VALUE_STORAGE) {


} else {
    /**
     * Listing available state snapshots
     */
    router.get('/api/state-snapshots', (request, response, next) => {
        fs.stat(fileStorage.storage, (error, stats) => {
            if (error) fs.writeFileSync(fileStorage.storage, `[]`);





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



            fileStorage.getSnapshots(browserId, userId).then(data => {
                response.json(data);
            }).catch(error => {
                console.log(error);
                throwError(response, 'UNABLE_TO_OPEN_DATABASE');
            });
        });
    });

    /**
     * Returning specific state snapshot
     */
    router.get('/api/state-snapshots/:id', (request, response, next) => {
        fs.stat(fileStorage.storage, (error, stats) => {
            if (error) fs.writeFileSync(fileStorage.storage, `[]`);

            /*
                Get specific state snapshot with identifier
            */
           fileStorage.getSnapshots(false, false, true).then(data => {
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
        fs.stat(fileStorage.storage, (error, stats) => {
            if (error) fs.writeFileSync(fileStorage.storage, `[]`);

            /*
                Update specific state snapshot with identifier, clear the browserId
                field and set userId field with the authorized user identifier
            */
           fileStorage.getSnapshots(false, false, true).then(data => {
                let searched = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].id === request.params.id) {
                        searched = data.splice(i, 1).pop();
                        break;
                    }
                }

                if (searched) {
                    let newElement = JSON.parse(JSON.stringify(searched));
                    newElement.anonymous = false;
                    newElement.browserId = false;
                    newElement.userId = 100;
                    data.push(newElement);

                    fileStorage.saveSnapshots(data).then(() => {
                        response.json({ status: 'success' });
                    }).catch(errorCode => {
                        throwError(response, errorCode);
                    });
                } else {
                    throwError(response, 'SNAPSHOT_WAS_NOT_FOUND');
                }
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
            if (request.body.anonymous === 'true' || request.body.anonymous === true) {
                if (TRACKER_COOKIE_NAME in request.cookies) {
                    fileStorage.appendToSnapshots(request.body, request.cookies[TRACKER_COOKIE_NAME]).then(id => {
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
                fileStorage.appendToSnapshots(request.body).then(id => {
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

    router.put('/api/state-snapshots', (request, response, next) => {
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

        if (`snapshot` in request.body) {
            fileStorage.getSnapshots(false, false, true).then(data => {
                let searched = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].id === request.body.id) {
                        searched = data.splice(i, 1).pop();
                        break;
                    }
                }

                let updateAccessGranted = false;
                if (searched) {
                    if (searched.browserId && searched.browserId.length > 0) {
                        if (searched.browserId === browserId) {
                            updateAccessGranted = true;
                        }
                    } else {
                        if (searched.userId === userId) {
                            updateAccessGranted = true;
                        }
                    }

                    if (updateAccessGranted) {
                        fileStorage.updateSnapshot(request.body).then(id => {
                            response.json({ id, status: 'success' });
                        }).catch(errorCode => {
                            throwError(response, errorCode);
                        });
                    } else {
                        throwError(response, 'ACCESS_DENIED');
                    }
                } else {
                    throwError(response, 'SNAPSHOT_WAS_NOT_FOUND');
                }
            }).catch(error => {
                console.log(error);
                throwError(response, 'UNABLE_TO_OPEN_DATABASE');
            });
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
       fileStorage.getSnapshots(false, false, true).then(data => {
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
                fileStorage.saveSnapshots(data).then(() => {
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
}

module.exports = router;

