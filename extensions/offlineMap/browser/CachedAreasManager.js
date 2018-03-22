const uuidv1 = require('uuid/v1');

/**
 * Managing cached map areas stored in browser storage
 * 
 * @todo Check intergity between the locaForage and the Cache Storage
 */

const STORAGE_KEY = 'vidi-cached-areas';
const MIN_POSSIBLE_ZOOM = 0;
const MAX_POSSIBLE_ZOOM = 20;

class CachedAreasManager {
    constructor() {
        this.areas = {};
        localforage.getItem(STORAGE_KEY).then((data) => {
            if (!data) {
                localforage.setItem(STORAGE_KEY, {}).catch(error => {
                    throw new Error(error);
                });
            }
        }).catch(error => {
            throw new Error(error);
        });
    }

    /**
     * Adds map area to the store
     * 
     * @return {Promise} 
     */
    add({ tileURLs, zoomMin, zoomMax, comment = '' }) {
        let result = new Promise((resolve, reject) => {
            if (!(zoomMin > MIN_POSSIBLE_ZOOM && zoomMin < MAX_POSSIBLE_ZOOM) ) {
                throw new Error(`Invalid minimal zoom`);
            }
    
            if (!(zoomMax > MIN_POSSIBLE_ZOOM && zoomMax < MAX_POSSIBLE_ZOOM) ) {
                throw new Error(`Invalid maximal zoom`);
            }
    
            if (zoomMin > zoomMax) {
                throw new Error(`Minimal zoom can not be bigger than maximal zoom`);
            }
    
            if (!tileURLs || !(tileURLs.length > 0)) {
                throw new Error(`There have to be at least one tile URL`);
            }
    
            comment = comment.toString();
            const id = uuidv1();
    
            localforage.getItem(STORAGE_KEY).then((data) => {
                data[id] = { tileURLs, zoomMin, zoomMax, comment, created_at: new Date() };
                localforage.setItem(STORAGE_KEY, data).then(() => {
                    resolve();
                });
            });
        });

        return result;
    }

    /**
     * Returns all stored map areas
     * 
     * @return {Promise} 
     */
    getAll() {
        return localforage.getItem(STORAGE_KEY);
    }

    delete() {
        console.log('CAM: here we delete');
    }
}

module.exports = CachedAreasManager;