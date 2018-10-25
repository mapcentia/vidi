/**
 * Centralized offline mode control management, deals with the presentation and logic
 */

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

/*
    @todo Process case when applied state wants vector layer to be offline, but it is not cached by the moment, so it should be either loaded
    or the state expectation should be ignored.
*/

class OfflineModeControlsManager {

    cachedLayers = [];

    // Keeping the offline mode control state for layes (user-defined)
    offlineModeValues = {};

    // Global application offline mode
    _globalApplicationOfflineMode = false;

    _apiBridgeInstance = false;

    constructor(metaObject) {
        meta = metaObject;
    }

    applyOfflineModeSettings(settings) {
        console.log(`### got to apply ${settings}`);
    }

    getOfflineModeSettings() {
        return this.offlineModeValues;
    }

    setCachedLayers(cachedLayers) {
        return new Promise((resolve, reject) => {
            this.cachedLayers = cachedLayers;
            resolve();
        });
    }

    /**
     * Sets the offline mode value for all controls with respect to theirs previous state
     * 
     * @param {Boolean} offlineMode Desired offline mode value
     * 
     * @returns {Promise}
     */
    setAllControlsState(applicationIsOnline, apiBridgeInstance) {

        console.log(`### setAllControlsState`);

        this._apiBridgeInstance = apiBridgeInstance;
        return new Promise((resolve, reject) => {
            if (applicationIsOnline) {
                $(`.js-set-all-layer-offline-mode-container`).show();
            } else {
                $(`.js-set-all-layer-offline-mode-container`).hide();
            }

            this._globalApplicationOfflineMode = !applicationIsOnline;
            resolve();            
        });
    }

    _getAvailableLayersKeys() {
        return new Promise((resolve, reject) => {
            let layerKeys = [];
            let existingMeta = meta.getMetaData();
            existingMeta.data.map(layer => {
                if (layer && layer.meta) {
                    let parsedMeta = JSON.parse(layer.meta);
                    if (parsedMeta && typeof parsedMeta === `object`) {
                        layerKeys.push(layer.f_table_schema + '.' + layer.f_table_name);
                    }
                }
            });

            resolve(layerKeys);
        });
    }

    /**
     * Checks if the specified layer is vector, accounting the chosen layer type
     * in case of both tile and vector availability for layer.
     * 
     * @param {String} layerKey Layer key
     * 
     * @returns {Boolean}
     * 
     * @throws {Error}
     */
    isVectorLayer(layerKey) {
        let isVectorLayer = -1;

        let existingMeta = meta.getMetaData();
        existingMeta.data.map(layer => {
            if (((layer.f_table_schema + '.' + layer.f_table_name) === layerKey) && layer.meta) {
                let parsedMeta = JSON.parse(layer.meta);
                if (parsedMeta && typeof parsedMeta === `object`) {
                    if (`vidi_layer_type` in parsedMeta && ['v', 'tv', 'vt', 't'].indexOf(parsedMeta.vidi_layer_type) !== -1) {
                        if (parsedMeta.vidi_layer_type === 'v') {
                            isVectorLayer = true;
                        } else if (parsedMeta.vidi_layer_type === 't') {
                            isVectorLayer = false;
                        } else {
                            let layerRecord = $(`[data-gc2-layer-key="${layerKey}.the_geom"]`);
                            if ($(layerRecord).length === 1) {
                                let type = $(layerRecord).find('.js-show-layer-control').data('gc2-layer-type');
                                if (type === `vector`) {
                                    isVectorLayer = true;
                                } else if (type === `tile`) {
                                    isVectorLayer = false;
                                }
                            } else {
                                throw new Error(`Unable the find layer container for ${layerKey}`);
                            }                           
                        }
                    }
                }
            }
        });

        if (isVectorLayer === -1) {
            throw new Error(`Unable to detect current layer type for ${layerKey}`);
        }

        return isVectorLayer;
    }

    /**
     * Updates state of offline mode controls according to current application state
     * 
     * @returns {Promise}
     */
    updateControls() {

        console.log(`### updateControls`);

        return new Promise((resolve, reject) => {
            this._getAvailableLayersKeys().then(layerKeys => {

                /*
                    @todo Remove the try/catch
                */
                try{

                layerKeys.map(layerKey => {
                    let layerRecord = $(`[data-gc2-layer-key="${layerKey}.the_geom"]`);
                    if ($(layerRecord).length === 1) {
                        let isVectorLayer = this.isVectorLayer(layerKey);

                        let isAlreadyCached = false;
                        this.cachedLayers.map(cachedLayer => {
                            if (cachedLayer.layerKey === layerKey) {
                                isAlreadyCached = true;
                                return false;
                            }
                        });

                        let offlineMode = false;
                        let requestedLayerKey = (this.isVectorLayer(layerKey) ? (`v:` + layerKey) : layerKey);
                        if (requestedLayerKey in this.offlineModeValues) {
                            if ([true, false].indexOf(this.offlineModeValues[requestedLayerKey]) !== -1) {
                                offlineMode = this.offlineModeValues[requestedLayerKey];
                            } else {
                                throw new Error(`Invalid offline mode for ${requestedLayerKey}`);
                            }
                        }

                        if (this._globalApplicationOfflineMode) {
                            $('.js-app-is-online-badge').addClass('hidden');
                            $('.js-app-is-offline-badge').removeClass('hidden');
                            $('.js-app-is-pending-badge').remove();

                            if (this._apiBridgeInstance) this._apiBridgeInstance.setOfflineModeForLayer(layerKey, true);
                            this.setRecordDisabled(layerRecord, isVectorLayer);
                        } else {
                            $('.js-app-is-online-badge').removeClass('hidden');
                            $('.js-app-is-offline-badge').addClass('hidden');
                            $('.js-app-is-pending-badge').remove();

                            if (isAlreadyCached && isVectorLayer || isVectorLayer === false) {
                                if (offlineMode) {
                                    if (this._apiBridgeInstance) this._apiBridgeInstance.setOfflineModeForLayer(layerKey, true);
                                    this.setRecordOffline(layerRecord, isVectorLayer);
                                } else {
                                    if (this._apiBridgeInstance) this._apiBridgeInstance.setOfflineModeForLayer(layerKey, false);
                                    this.setRecordOnline(layerRecord, isVectorLayer);
                                }
                            }
                        }
                    } else {
                        console.error(`Unable the find layer container for ${layerKey}`);
                        reject();
                    }
                });

                resolve();

                }catch(e){console.log(e)};

            });
        });
    }

    /**
     * Modifies the control according to the online state 
     * 
     * @param {HTMLElement} layerRecord   Layer record HTML element
     * @param {Boolean}     isVectorLayer Specifies if the layer is the vector one
     * 
     * @returns {void}
     */
    setRecordOnline(layerRecord, isVectorLayer = true) {
        $(layerRecord).find(`.js-set-online`).prop(`disabled`, true);
        $(layerRecord).find(`.js-set-offline`).prop(`disabled`, false);
        $(layerRecord).find(`.js-refresh`).prop(`disabled`, true);

        $(layerRecord).find(`.js-set-online`).css(`background-color`, `#009688`);
        $(layerRecord).find(`.js-set-online`).css(`color`, `white`);
        $(layerRecord).find(`.js-set-offline`).attr(`style`, ``);

        if (isVectorLayer) {
            $(layerRecord).find(`.js-refresh`).show();
        } else {
            $(layerRecord).find(`.js-refresh`).hide();
        }
    }

    /**
     * Modifies the control according to the offline state 
     * 
     * @param {HTMLElement} layerRecord   Layer record HTML element
     * @param {Boolean}     isVectorLayer Specifies if the layer is the vector one
     * 
     * @returns {void}
     */
    setRecordOffline(layerRecord, isVectorLayer = true) {
        $(layerRecord).find(`.js-set-online`).prop(`disabled`, false);
        $(layerRecord).find(`.js-set-offline`).prop(`disabled`, true);
        $(layerRecord).find(`.js-refresh`).prop(`disabled`, false);

        $(layerRecord).find(`.js-set-online`).attr(`style`, ``);
        $(layerRecord).find(`.js-set-offline`).css(`background-color`, `#009688`);
        $(layerRecord).find(`.js-set-offline`).css(`color`, `white`);

        if (isVectorLayer) {
            $(layerRecord).find(`.js-refresh`).show();
        } else {
            $(layerRecord).find(`.js-refresh`).hide();
        }
    }

    /**
     * Modifies the control according to the disabled state 
     * 
     * @param {HTMLElement} layerRecord   Layer record HTML element
     * @param {Boolean}     isVectorLayer Specifies if the layer is the vector one
     * 
     * @returns {void}
     */
    setRecordDisabled(layerRecord, isVectorLayer = true) {
        $(layerRecord).find(`.js-set-online`).prop(`disabled`, true);
        $(layerRecord).find(`.js-set-offline`).prop(`disabled`, true);
        $(layerRecord).find(`.js-refresh`).prop(`disabled`, true);

        $(layerRecord).find(`.js-set-online`).attr(`style`, ``);
        $(layerRecord).find(`.js-set-offline`).attr(`style`, ``);

        if (isVectorLayer) {
            $(layerRecord).find(`.js-refresh`).show();
        } else {
            $(layerRecord).find(`.js-refresh`).hide();
        }
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

        if (this.isVectorLayer(layerKey)) {
            this.offlineModeValues[`v:` + layerKey] = offlineMode;
        } else {
            this.offlineModeValues[layerKey] = offlineMode;
        }

        this.updateControls();
    }
};

export default OfflineModeControlsManager;