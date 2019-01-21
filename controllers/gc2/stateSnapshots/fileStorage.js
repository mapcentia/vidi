/*
 * @author     Alexander Shumilov
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

let fs = require('fs');
let crypto = require('crypto');

const FILE_STORAGE_PATH = `./temporary-state-storage.json`;

const appendToSnapshots = (snapshot, browserId) => {
    return new Promise((resolve, reject) => {
        getSnapshots(false, false, true).then(data => {
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
}

const updateSnapshot = (snapshot) => {
    return new Promise((resolve, reject) => {
        if (`title` in snapshot === false || !snapshot.title
            || `id` in snapshot === false || !snapshot.id
            || `snapshot` in snapshot === false || !snapshot.snapshot) {
            reject(`INCOMPLETE_DATA_WAS_PROVIDED`);
        } else {
            getSnapshots(false, false, true).then(data => {
                let itemWasUpdated = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].id === snapshot.id) {
                        let item = data.splice(i, 1).pop();
                        item.title = snapshot.title;
                        item.snapshot = snapshot.snapshot;

                        itemWasUpdated = true;
                        data.push(item);
                        break;
                    }
                }

                if (itemWasUpdated) {
                    saveSnapshots(data).then(() => {
                        resolve();
                    }).catch(errorCode => {
                        reject(errorCode);
                    });
                } else {
                    reject(`UNABLE_TO_FIND_STATE_SNAPSHOT`);
                }
            }).catch(errorCode => {
                reject(errorCode);
            });
        }
    });
};

const getSnapshots = (browserId = false, userId = false, all = false) => {
    return new Promise((resolve, reject) => {
        fs.readFile(FILE_STORAGE_PATH, (error, data) => {
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

                    if (all) {
                        result.push(item);
                    } else {
                        if (browserId && item.browserId && item.browserId === browserId) {
                            result.push(item);
                        } else if (userId && item.userId && item.userId === userId) {
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
        fs.writeFile(FILE_STORAGE_PATH, JSON.stringify(snapshots), (error) => {
            if (error) {
                console.log(error);
                reject(`UNABLE_TO_WRITE_FILE`);
            } else {                        
                resolve();
            }
        });
    });
};

/**
 * FileStorage for state snapshots
 */
module.exports = {
    storage: FILE_STORAGE_PATH,
    getSnapshots,
    saveSnapshots,
    appendToSnapshots,
    updateSnapshot
};