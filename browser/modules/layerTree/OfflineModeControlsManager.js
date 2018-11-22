/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

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

    // Remembering what layers have an only bbox area cached
    vectorLayersCachedWithingTheBBox = [];

    // Global application offline mode
    _globalApplicationOfflineMode = false;

    _layersWithPredictedLayerType = [];

    _apiBridgeInstance = false;

    constructor(metaObject) {
        meta = metaObject;
    }

    /**
     * Resets the controls manager
     * 
     * @returns {Promise}
     */
    reset() {
        return new Promise((resolve, reject) => {
            this.cachedLayers = [];
            this.offlineModeValues = {};
            this.vectorLayersCachedWithingTheBBox = [];
            resolve();
        });
    }

    getOfflineModeSettings() {
        return this.offlineModeValues;
    }

    /**
     * Sets cached layers
     * 
     * @returns {Promise}
     */
    setCachedLayers(cachedLayers) {
        return new Promise((resolve, reject) => {
            this.cachedLayers = cachedLayers;
            this.cachedLayers.map(cachedLayer => {
                this.offlineModeValues[cachedLayer.layerKey] = cachedLayer.offlineMode;
            });

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
                    if (parsedMeta && typeof parsedMeta === `object` && `layergroup` in layer && layer.layergroup) {
                        layerKeys.push({
                            layerKey: (layer.f_table_schema + '.' + layer.f_table_name),
                            geomColumn: layer.f_geometry_column
                        });
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

        let metaIsMissingTypeDefinition = false;
        let existingMeta = meta.getMetaData();
        let layerData = false;
        existingMeta.data.map(layer => {
            if (((layer.f_table_schema + '.' + layer.f_table_name) === layerKey) && layer.meta) {
                layerData = layer;
                let parsedMeta = JSON.parse(layer.meta);
                if (parsedMeta && typeof parsedMeta === `object`) {
                    if (`vidi_layer_type` in parsedMeta && ['v', 'tv', 'vt', 't'].indexOf(parsedMeta.vidi_layer_type) !== -1) {
                        if (parsedMeta.vidi_layer_type === 'v') {
                            isVectorLayer = true;
                        } else if (parsedMeta.vidi_layer_type === 't') {
                            isVectorLayer = false;
                        } else {
                            let layerRecord = $(`[data-gc2-layer-key="${layerKey}.${layer.f_geometry_column}"]`);
                            if ($(layerRecord).length === 1) {
                                let type = $(layerRecord).find('.js-show-layer-control').data('gc2-layer-type');
                                if (type === `vector`) {
                                    isVectorLayer = true;
                                } else if (type === `tile`) {
                                    isVectorLayer = false;
                                }
                            }                           
                        }
                    } else {
                        metaIsMissingTypeDefinition = true;
                    }
                }

                return false;
            }
        });

        if (isVectorLayer === -1) {
            if (this._layersWithPredictedLayerType.indexOf(layerKey) === -1) {
                this._layersWithPredictedLayerType.push(layerKey);
                if (metaIsMissingTypeDefinition) {
                    console.warn(`Unable to detect current layer type for ${layerKey}, fallback type: tile (meta does not have layer type definition)`);
                } else {
                    console.error(`Unable to detect current layer type for ${layerKey}, fallback type: tile`);
                }
            }

            isVectorLayer = false;
        }

        return isVectorLayer;
    }

    /**
     * Updates state of offline mode controls according to current application state
     * 
     * @returns {Promise}
     */
    updateControls() {
        return new Promise((resolve, reject) => {
            if (this._globalApplicationOfflineMode) {
                $('.js-app-is-pending-badge').remove();
                $('.js-app-is-online-badge').addClass('hidden');
                $('.js-app-is-offline-badge').removeClass('hidden');
            } else {
                $('.js-app-is-pending-badge').remove();
                $('.js-app-is-online-badge').removeClass('hidden');
                $('.js-app-is-offline-badge').addClass('hidden');
            }

            this._getAvailableLayersKeys().then(layerKeys => {

                /*
                    @todo Remove the try/catch
                */
                try{

                layerKeys.map(({layerKey, geomColumn }) => {
                    let layerRecord = $(`[data-gc2-layer-key="${layerKey}.${geomColumn}"]`);
                    if ($(layerRecord).length === 1) {
                        // Updating offline mode controls only for visible layer controls
                        if ($(layerRecord).is(`:visible`)) {
                            let isVectorLayer = this.isVectorLayer(layerKey);                           
                            if (isVectorLayer) {
                                let isAlreadyCached = false;
                                let cachedWithinTheBBox = false;
                                this.cachedLayers.map(cachedLayer => {
                                    if (cachedLayer.layerKey === layerKey) {
                                        isAlreadyCached = true;
                                        if (cachedLayer.bbox) {
                                            cachedWithinTheBBox = true;
                                        }

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

                                if (!cachedWithinTheBBox && this.vectorLayersCachedWithingTheBBox.indexOf(layerKey) !== -1) {
                                    cachedWithinTheBBox = true;
                                }

                                if (this._globalApplicationOfflineMode) {
                                    if (this._apiBridgeInstance) this._apiBridgeInstance.setOfflineModeForLayer(layerKey, true);
                                    this.setRecordDisabled(layerRecord, isVectorLayer);
                                } else {
                                    if (isAlreadyCached && isVectorLayer || isVectorLayer === false) {
                                        if (offlineMode) {
                                            if (this._apiBridgeInstance) this._apiBridgeInstance.setOfflineModeForLayer(layerKey, true);
                                            this.setRecordOffline(layerRecord, isVectorLayer, cachedWithinTheBBox);
                                        } else {
                                            if (this._apiBridgeInstance) this._apiBridgeInstance.setOfflineModeForLayer(layerKey, false);
                                            this.setRecordOnline(layerRecord, isVectorLayer, cachedWithinTheBBox);
                                        }
                                    }
                                }
                            }
                        }
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
     * @param {HTMLElement} layerRecord         Layer record HTML element
     * @param {Boolean}     isVectorLayer       Specifies if the layer is the vector one
     * @param {Boolean}     cachedWithinTheBBox Specifies if the layer is cached only within the specific bounding box
     * 
     * @returns {void}
     */
    setRecordOnline(layerRecord, isVectorLayer = true, cachedWithinTheBBox = false) {
        $(layerRecord).find(`.js-bbox`).prop(`disabled`, true);
        if (cachedWithinTheBBox) {
            $(layerRecord).find(`.js-bbox`).attr(`style`, ``);
            $(layerRecord).find(`.js-bbox`).css(`background-color`, `white`);
            $(layerRecord).find(`.js-bbox`).css(`color`, `goldenrod`);
        } else {
            $(layerRecord).find(`.js-bbox`).remove();
        }

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

        $(layerRecord).find(`.js-set-online,.js-set-offline,.js-refresh,.js-bbox`).css(`padding`, `4px`);
        $(layerRecord).find(`.js-set-online,.js-set-offline,.js-refresh,.js-bbox`).css(`min-width`, `20px`);
    }

    /**
     * Modifies the control according to the offline state 
     * 
     * @param {HTMLElement} layerRecord         Layer record HTML element
     * @param {Boolean}     isVectorLayer       Specifies if the layer is the vector one
     * @param {Boolean}     cachedWithinTheBBox Specifies if the layer is cached only within the specific bounding box
     * 
     * @returns {void}
     */
    setRecordOffline(layerRecord, isVectorLayer = true, cachedWithinTheBBox = false) {
        $(layerRecord).find(`.js-bbox`).prop(`disabled`, true);
        if (cachedWithinTheBBox) {
            $(layerRecord).find(`.js-bbox`).attr(`style`, ``);
            $(layerRecord).find(`.js-bbox`).css(`background-color`, `white`);
            $(layerRecord).find(`.js-bbox`).css(`color`, `goldenrod`);
        }

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

        $(layerRecord).find(`.js-set-online,.js-set-offline,.js-refresh,.js-bbox`).css(`padding`, `4px`);
        $(layerRecord).find(`.js-set-online,.js-set-offline,.js-refresh,.js-bbox`).css(`min-width`, `20px`);
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

        $(layerRecord).find(`.js-set-online,.js-set-offline,.js-refresh`).css(`padding`, `4px`);
        $(layerRecord).find(`.js-set-online,.js-set-offline,.js-refresh`).css(`min-width`, `20px`);
    }

    /**
     * Sets the offline mode value for specific layer
     * 
     * @param {String}  layerKey    Layer key
     * @param {Boolean} offlineMode Desired offline mode value
     * 
     * @returns {Promise}
     */
    setControlState(layerKey, offlineMode, bbox = false) {
        if (layerKey.indexOf(`.`) === -1) {
            throw new Error(`Invalid layer key was provided: ${layerKey}`);
        }

        layerKey = layerKey.replace(`v:`, ``);
        if (this.isVectorLayer(layerKey)) {
            this.offlineModeValues[`v:` + layerKey] = offlineMode;
        } else {
            this.offlineModeValues[layerKey] = offlineMode;
        }

        if (bbox && this.vectorLayersCachedWithingTheBBox.indexOf(layerKey) === -1) {
            this.vectorLayersCachedWithingTheBBox.push(layerKey);
        }

        this.updateControls();
    }
};

export default OfflineModeControlsManager;