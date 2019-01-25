/**
 * Communicating with the service workied via MessageChannel interface
 *
 * @returns {Promise}
 */
const queryServiceWorker = (data) => {
    return new Promise((resolve, reject) => {
        if (navigator.serviceWorker.controller) {
            let messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = (event) => {
                if (event.data.error) {
                    reject(event.data.error);
                } else {
                    resolve(event.data);
                }
            };

            navigator.serviceWorker.controller.postMessage(data, [messageChannel.port2]);
        } else {
            console.error(`Unable to query service worker as it is not registered yet`);
            reject();
        }
    });
};

/**
 * Applies opacity to the specific layer
 *
 * @returns {void}
 */
const applyOpacityToLayer = (opacity, layerKey, cloud) => {
    for (let key in cloud.get().map._layers) {
        if (`id` in cloud.get().map._layers[key] && cloud.get().map._layers[key].id) {
            if (cloud.get().map._layers[key].id === layerKey) {
                cloud.get().map._layers[key].setOpacity(opacity);
                backboneEvents.get().trigger(`${MODULE_NAME}:opacityChange`);
            }
        }
    }
};

/**
 * Returns list of currently enabled layers
 * 
 * @returns {Array}
 */
const getActiveLayers = () => {
    let activeLayerIds = [];
    $('*[data-gc2-layer-type]').each((index, item) => {
        let isEnabled = $(item).is(':checked');
        if (isEnabled) {
            if ($(item).data('gc2-layer-type') === 'tile') {
                activeLayerIds.push($(item).data('gc2-id'));
            } else {
                activeLayerIds.push('v:' + $(item).data('gc2-id'));
            }
        }
    });

    activeLayerIds = activeLayerIds.filter((v, i, a) => {
        return a.indexOf(v) === i
    });

    return activeLayerIds;
};

/**
 * Calculates layer order using the current markup
 *
 * @returns {Array}
 */
const calculateOrder = () => {
    let layerTreeOrder = [];

    $(`[id^="layer-panel-"]`).each((index, element) => {
        let id = $(element).attr(`id`).replace(`layer-panel-`, ``);
        let children = [];

        const processLayerRecord = (layerElement) => {
            let layerKey = $(layerElement).data(`gc2-layer-key`);
            let splitLayerKey = layerKey.split('.');
            if (splitLayerKey.length !== 3) {
                throw new Error(`Invalid layer key (${layerKey})`);
            }

            return {
                id: `${splitLayerKey[0]}.${splitLayerKey[1]}`,
                type: GROUP_CHILD_TYPE_LAYER
            };
        };

        $(`#${$(element).attr(`id`)}`).find(`#collapse${id}`).children().each((layerIndex, layerElement) => {
            if ($(layerElement).data(`gc2-layer-key`)) {
                // Processing layer record
                children.push(processLayerRecord(layerElement));
            } else if ($(layerElement).data(`gc2-subgroup-id`)) {
                // Processing subgroup record
                let subgroupDescription = {
                    id: $(layerElement).data(`gc2-subgroup-id`),
                    type: GROUP_CHILD_TYPE_GROUP,
                    children: []
                };

                $(layerElement).find(`.js-subgroup-children`).children().each((subgroupLayerIndex, subgroupLayerElement) => {
                    subgroupDescription.children.push(processLayerRecord(subgroupLayerElement));
                });

                children.push(subgroupDescription);
            } else {
                throw new Error(`Unable to detect the group child element`);
            }
        });

        let readableId = atob(id);
        if (readableId) {
            layerTreeOrder.push({id: readableId, children});
        } else {
            throw new Error(`Unable to decode the layer group identifier (${id})`);
        }
    });

    return layerTreeOrder;
};

module.exports = {
    queryServiceWorker,
    applyOpacityToLayer,
    getActiveLayers,
    calculateOrder
};