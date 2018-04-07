'use strict';

const QUEUE_PROCESSING_INTERVAL = 5000;

const LOG = true;

// Types of queue items
const ADD_REQUEST = 0;
const UPDATE_REQUEST = 1;
const DELETE_REQUEST = 2;

/**
 * FIFO queue abstraction. Queue items are stored
 * in browser storage and do not depend on page reload
 */
class Queue {

    static get ADD_REQUEST() { return ADD_REQUEST; }
    static get UPDATE_REQUEST() { return UPDATE_REQUEST; }
    static get DELETE_REQUEST() { return DELETE_REQUEST; }

    constructor(processor) {
        if (!processor) {
            throw new Error('No processor for queue was specified');
        }

        let _self = this;
        this._locked = false;
        this._onUpdateListener = () => {};
        this._queue = [];
        this._processor = processor;

        const processQueue = () => {
            if (LOG) console.log('Queue interval, total items in queue:', _self._queue.length, _self._locked);

            const scheduleNextQueueProcessingRun = () => {
                setTimeout(() => {
                    processQueue();
                }, QUEUE_PROCESSING_INTERVAL);
            };

            if (_self._queue.length > 0 && _self._locked === false) {
                _self._locked = true;
                console.warn('Queue is not empty, trying to push changes');

                _self._dispatch().then(() => {
                    _self._locked = false;
                    scheduleNextQueueProcessingRun();
                }).catch(error => {
                    _self._locked = false;
                    scheduleNextQueueProcessingRun();
                });
            } else {
                scheduleNextQueueProcessingRun();
            }
        };

        processQueue();
    }

    /**
     * Generates current queue statistics
     */
    _generateCurrentStatistics() {
        let stats = {};

        for (let i = 0; i < this._queue.length; i++) {
            let currentItem = this._queue[i];
            console.log(item);
        }

/*
{
	"type": 0,
	"feature": {
		"type": "FeatureCollection",
		"features": [{
			"type": "Feature",
			"properties": {
				"id": null,
				"name": "aaa"
			},
			"geometry": {
				"type": "Point",
				"coordinates": [39.301057, -6.81959]
			}
		}]
	},
	"db": "aleksandrshumilov",
	"meta": {
		"f_table_schema": "public",
		"f_table_name": "test",
		"f_geometry_column": "the_geom",
		"coord_dimension": 2,
		"srid": 4326,
		"type": "POINT",
		"_key_": "public.test.the_geom",
		"f_table_abstract": null,
		"f_table_title": "Test point",
		"tweet": null,
		"editable": true,
		"created": "2018-04-05 10:44:48+00",
		"lastmodified": "2018-04-05 10:44:48+00",
		"authentication": "Write",
		"fieldconf": null,
		"meta_url": null,
		"layergroup": "Dar es Salaam Land Use and Informal Settlement Data Set",
		"def": null,
		"class": "[{\"name\":\"default\",\"id\":0,\"sortid\":10,\"expression\":\"\",\"class_minscaledenom\":\"\",\"class_maxscaledenom\":\"\",\"leader\":false,\"leader_gridstep\":\"\",\"leader_maxdistance\":\"\",\"leader_color\":\"\",\"color\":\"#99CC00\",\"outlinecolor\":\"#008000\",\"pattern\":\"\",\"linecap\":\"\",\"symbol\":\"\",\"size\":\"10\",\"width\":\"5\",\"angle\":\"\",\"style_opacity\":\"\",\"geomtransform\":\"\",\"maxsize\":\"\",\"overlaycolor\":\"\",\"overlayoutlinecolor\":\"\",\"overlaypattern\":\"\",\"overlaylinecap\":\"\",\"overlaysymbol\":\"\",\"overlaysize\":\"\",\"overlaywidth\":\"\",\"overlayangle\":\"\",\"overlaystyle_opacity\":\"\",\"overlaygeomtransform\":\"\",\"overlaymaxsize\":\"\",\"label\":false,\"label_text\":\"\",\"label_force\":false,\"label_minscaledenom\":\"\",\"label_maxscaledenom\":\"\",\"label_position\":\"\",\"label_size\":\"\",\"label_font\":\"\",\"label_fontweight\":\"\",\"label_color\":\"\",\"label_outlinecolor\":\"\",\"label_buffer\":\"\",\"label_repeatdistance\":\"\",\"label_angle\":\"\",\"label_backgroundcolor\":\"\",\"label_backgroundpadding\":\"\",\"label_offsetx\":\"\",\"label_offsety\":\"\",\"label_expression\":\"\",\"label_maxsize\":\"\",\"label_minfeaturesize\":\"\",\"label2\":false,\"label2_text\":\"\",\"label2_force\":false,\"label2_minscaledenom\":\"\",\"label2_maxscaledenom\":\"\",\"label2_position\":\"\",\"label2_size\":\"\",\"label2_font\":\"\",\"label2_fontweight\":\"\",\"label2_color\":\"\",\"label2_outlinecolor\":\"\",\"label2_buffer\":\"\",\"label2_repeatdistance\":\"\",\"label2_angle\":\"\",\"label2_backgroundcolor\":\"\",\"label2_backgroundpadding\":\"\",\"label2_offsetx\":\"\",\"label2_offsety\":\"\",\"label2_expression\":\"\",\"label2_maxsize\":\"\",\"label2_minfeaturesize\":\"\"}]",
		"wmssource": null,
		"baselayer": null,
		"sort_id": null,
		"tilecache": null,
		"data": null,
		"not_querable": null,
		"single_tile": null,
		"cartomobile": null,
		"filter": null,
		"bitmapsource": null,
		"privileges": null,
		"enablesqlfilter": null,
		"triggertable": null,
		"classwizard": null,
		"extra": null,
		"skipconflict": null,
		"roles": null,
		"elasticsearch": null,
		"uuid": "dac4c31a-c60c-4690-81df-e2dbe11dca57",
		"tags": null,
		"meta": null,
		"wmsclientepsgs": null,
		"featureid": null,
		"sort": null,
		"pkey": "gid",
		"versioning": false,
		"fields": {
			"gid": {
				"num": 1,
				"type": "integer",
				"full_type": "integer",
				"is_nullable": false
			},
			"id": {
				"num": 2,
				"type": "integer",
				"full_type": "integer",
				"is_nullable": true
			},
			"the_geom": {
				"num": 3,
				"type": "geometry",
				"full_type": "geometry(Point,4326)",
				"is_nullable": true,
				"geom_type": "Point",
				"srid": "4326"
			},
			"name": {
				"num": 4,
				"type": "character varying",
				"full_type": "character varying(255)",
				"is_nullable": true
			}
		}
	}
}
*/


    }

    /**
     * Reports current queue state to listener
     */
    setOnUpdate(listener) {
        this._onUpdateListener = listener;
    }

    /** 
     * Reports update to external listeners
     */
    _reportUpdate() {
        console.log(this._onUpdateListener);
        let stats = this._generateCurrentStatistics();
        this._onUpdateListener(stats);
    }

    /**
     * Restores previous queue state from browser storage
     */
    restorePreviousState() {}

    /**
     * Saves current queue state to disk
     */
    saveState() {}

    /**
     * Delete items that are mutually exclusive, for
     * example, requests to add feature A and delete 
     * feature A should be annihilated as it is pointless
     * to send them to server
     */
    houseKeeping() {}

    /**
     * Iterate over queue and perform request in FIFO manner
     * 
     * @param {Function} dispatcher Function that perfroms actual request
     */
    _dispatch() {

        if (LOG) console.log('Queue: _dispatch');

        let _self = this;
        //_self._reportUpdate();
        
        let result = new Promise((resolve, reject) => {
            const processOldestItem = () => {

                if (LOG) console.log('Queue: processOldest');

                new Promise((localResolve, localReject) => {
                    let oldestItem = Object.assign({}, _self._queue[(_self._queue.length - 1)]);
                    _self._processor(oldestItem).then((result) => {
                        let processedItem = _self._queue.shift();

                        if (LOG) console.log('Queue: item is processed', processedItem, result);
                        if (LOG) console.log('Queue: items left', _self._queue.length);

                        if (_self._queue.length === 0) {
                            //_self._reportUpdate();

                            resolve();
                        } else {
                            localResolve();
                        }
                    }).catch((error) => {

                        if (LOG) console.log('Queue: item was not processed', oldestItem);
                        if (LOG) console.log('Queue: stopping processing, items left', _self._queue.length);

                        //_self._reportUpdate();

                        localReject();
                    });
                }).then(processOldestItem.bind(null)).catch(reject);
            };

            processOldestItem();
        });

        return result;
    }

    /**
     * 
     * @param {*} item 
     * 
     * @return {Promise}
     */
    pushAndProcess(item) {
        
        if (LOG) console.log('Queue: pushAndProcess', item);

        if (!('type' in item) || [ADD_REQUEST, UPDATE_REQUEST, DELETE_REQUEST].indexOf(item.type) === -1) {
            throw new Error('Queue item has to have a certain type');
        }

        let _self = this;
        this.push(item);
        let result = new Promise((resolve, reject) => {
            /*
                If there is only one element in the queue (the one that
                was inserted just now) then try to process it and return
                result back. If there are more than one element in the queue,
                then older elements have to be processed first.
            */
            if (_self._queue.length === 1) {
                _self._locked = true;
                _self._dispatch().then(() => {
                    _self._locked = false;

                    resolve();
                }).catch(error => {
                    _self._locked = false;

                    console.warn('Request failed and was postponed');
                    resolve();
                });
            } else {
                resolve();
            }
        });

        return result;
    }


    /**
     * Add item to the queue
     */
    push(item) {
        this._queue.push(item);
    }

    /**
     * Returns queue length
     */
    get length() {}

};

module.exports = Queue;