/**
 * Centralized offline mode control management, deals with the presentation and logic
 */

const CONTAINER_CLASS = `js-toggle-layer-offline-mode-container`;

/*
The "offline mode" is both applicable to the offline editing of vector layer features and to the offline fetching
of vector layers (huge ones). Both features needs to be merged in one functionality.

Every layer can have following states:
|- not cached (offline mode is unavailable, control is blocked)
|- cached (loaded at least ones before or it exists in cache, offline mode is available and control is not blocked)
  |- user have not defined the offline mode (when the app goes offline - control goes offline, when the app goes online - control goes online)
  |- user have defined the offline mode
    |- offline mode was set to true (when app goes online, the control only unblocks)
    |- offline mode was set to false (when app goes online, the control unblocks and goes online as well)
*/

let meta = false;

class OfflineModeControlsManager {

    cachedLayers = [];

    // Keeping the offline mode control state for layes (user-defined)
    offlineModeValues = {};

    // Global application offline mode
    _globalApplicationOfflineMode = false;

    constructor(metaObject) {
        meta = metaObject;
    }

    setCachedLayers(cachedLayers) {
        return new Promise((resolve, reject) => {
            this.cachedLayers = cachedLayers;
            resolve();
        });
    }

    /*
        If application went offline, then put all layer offline mode selectors into the offline mode state and block them
        If application went online, then put all layer offline mode selectors into the online state, but if any selector was
        already altered by user, then keep it in the user-defined state
    */

    /**
     * Sets the offline mode value for all controls with respect to theirs previous state
     * 
     * @param {Boolean} offlineMode Desired offline mode value
     * 
     * @returns {Promise}
     */
    setAllControlsState(applicationIsOnline) {
        return new Promise((resolve, reject) => {
            this._globalApplicationOfflineMode = !applicationIsOnline;
            resolve();            
        });
    }

    _getAvailableVectorLayersKeys() {
        return new Promise((resolve, reject) => {
            let layerKeys = [];
            let existingMeta = meta.getMetaData();
            existingMeta.data.map(layer => {
                if (layer && layer.meta) {
                    let parsedMeta = JSON.parse(layer.meta);
                    if (parsedMeta && typeof parsedMeta === `object`) {           
                        if (`vidi_layer_type` in parsedMeta && ['v', 'tv', 'vt'].indexOf(parsedMeta.vidi_layer_type) !== -1) {

                            // @todo If this is the vt/tv layer then check what type is currently enabled

                            layerKeys.push(layer.f_table_schema + '.' + layer.f_table_name);
                        }
                    }
                }
            });

            resolve(layerKeys);
        });
    }

    /**
     * Updates state of offline mode controls according to current application state
     */
    updateControls() {

        console.log(`### updateControls`);

        return new Promise((resolve, reject) => {
            this._getAvailableVectorLayersKeys().then(layerKeys => {
                layerKeys.map(layerKey => {
                    let isAlreadyCached = false;
                    this.cachedLayers.map(cachedLayer => {
                        if (cachedLayer.layerKey === layerKey) {
                            isAlreadyCached = true;
                            return false;
                        }
                    });

                    let layerRecord = $(`[data-gc2-layer-key="${layerKey}.the_geom"]`);
                    if ($(layerRecord).length === 1) {
                        let offlineMode = false;
                        if (layerKey in this.offlineModeValues) {
                            offlineMode = this.offlineModeValues[layerKey];
                        }

                        if (this._globalApplicationOfflineMode) {
                            this.setRecordDisabled(layerRecord);   
                        } else {
                            if (isAlreadyCached) {
                                if (offlineMode) {
                                    this.setRecordOffline(layerRecord);
                                } else {
                                    this.setRecordOnline(layerRecord);
                                }
                            }
                        }
                    } else {
                        console.error(`Unable the find layer container for ${layerKey}`);
                        reject();
                    }
                });

                resolve();
            });
        });
    }

    setRecordOnline(layerRecord) {
        $(layerRecord).find(`.js-set-online`).prop(`disabled`, true);
        $(layerRecord).find(`.js-set-offline`).prop(`disabled`, false);
        $(layerRecord).find(`.js-refresh`).prop(`disabled`, true);

        $(layerRecord).find(`.js-set-online`).css(`background-color`, `#009688`);
        $(layerRecord).find(`.js-set-online`).css(`color`, `white`);
        $(layerRecord).find(`.js-set-offline`).attr(`style`, ``);
    }

    setRecordOffline(layerRecord) {
        $(layerRecord).find(`.js-set-online`).prop(`disabled`, false);
        $(layerRecord).find(`.js-set-offline`).prop(`disabled`, true);
        $(layerRecord).find(`.js-refresh`).prop(`disabled`, false);

        $(layerRecord).find(`.js-set-online`).attr(`style`, ``);
        $(layerRecord).find(`.js-set-offline`).css(`background-color`, `#009688`);
        $(layerRecord).find(`.js-set-offline`).css(`color`, `white`);
    }

    setRecordDisabled(layerRecord) {
        $(layerRecord).find(`.js-set-online`).prop(`disabled`, true);
        $(layerRecord).find(`.js-set-offline`).prop(`disabled`, true);
        $(layerRecord).find(`.js-refresh`).prop(`disabled`, true);

        $(layerRecord).find(`.js-set-online`).attr(`style`, ``);
        $(layerRecord).find(`.js-set-offline`).attr(`style`, ``);
    }

    /**
     * Sets the offline mode value for specific layer
     * 
     * @param {String}  layerKey    Layer key
     * @param {Boolean} offlineMode Desired offline mode value
     * 
     * @returns {Promise}
     */
    setControlState(layerKey, offlineMode) {
        if (layerKey.indexOf(`.`) === -1) {
            throw new Error(`Invalid layer key was provided: ${layerKey}`);
        }

        console.log(`### setControlState`, layerKey, offlineMode);

        this.offlineModeValues[layerKey] = offlineMode;
        this.updateControls();
    }

};

export default OfflineModeControlsManager;