/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import document from 'global/document';
import {Provider} from 'react-redux';
import {render} from 'react-dom';
import store from './src/store';
import App from './src/app';

const CompactLayerTree = require('./components/CompactLayerTree');

/**
 *
 * @type {*|exports|module.exports}
 */
var cloud, meta, backboneEvents, utils;

/**
 *
 * @type {*|exports|module.exports}
 */
var urlparser = require('./../../../browser/modules/urlparser');

/**
 * @type {string}
 */
var db = urlparser.db;

/**
 *
 * @type {string}
 */
var extensionId = 'keplergl-container';
var modalContainerId = 'keplergl-modal-body';

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */

module.exports = {

    /**
     *
     * @param o
     * @returns {exports}
     */
    set: function (o) {
        cloud = o.cloud;
        meta = o.meta;
        backboneEvents = o.backboneEvents;
        utils = o.utils;
        return this;
    },

    /**
     *
     */
    init: function () {
        utils.createMainTab(extensionId, 'KeplerGL', 'KeplerGL', require('./../../../browser/modules/height')().max);

        /**
         *
         */
        class KeplerGLComponent extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    layers: false,
                    selectedLayers: []
                };

                this.openModal = this.openModal.bind(this);
            }

            /**
             *
             */
            componentDidMount() {
                let _self = this;
                backboneEvents.get().on(`ready:meta`, () => {
                    _self.setState({
                        layers: meta.getMetaData()
                    });
                });
            }

            /**
             * Called when imported layers are changed
             */
            onSelectedLayersChange(selectedLayers) {
                this.setState({
                    selectedLayers
                });
            }

            openModal(e) {
                $(`#keplergl-modal-body`).empty();

                console.log(this.state.layers);

                let localDataStores = [];
                let fetchPromises = [];
                this.state.selectedLayers.map(layerKey => {
                    let correspondingLayer = false;
                    if (`data` in this.state.layers && this.state.layers.data) {
                        this.state.layers.data.map(item => {
                            if (item.f_table_schema + '.' + item.f_table_name === layerKey) {
                                correspondingLayer = item;
                            }
                        });
                    }

                    if (correspondingLayer) {
                        let sql = `SELECT * FROM ${layerKey}`;
                        if (correspondingLayer.type === `POINT`) {
                            sql = `SELECT *, st_x(the_geom) as lon, st_y(the_geom) as lat FROM ${layerKey}`;
                        }

                        let fetchPromise = new Promise((resolve, reject) => {
                            localDataStores[`keplergl:${layerKey}`] = new geocloud.sqlStore({
                                jsonp: false,
                                method: "POST",
                                host: "",
                                db: db,
                                uri: "/api/sql",
                                clickable: true,
                                id: layerKey,
                                name: layerKey,
                                lifetime: 0,
                                sql,
                                onLoad: (layer) => {
                                    resolve({
                                        layerKey,
                                        meta: correspondingLayer,
                                        layer
                                    });
                                }
                            });
    
                            localDataStores[`keplergl:${layerKey}`].load();
                        });
    
                        fetchPromises.push(fetchPromise);
                    } else {
                        throw new Error(`Unable to find corresponding meta layer`);
                    }
                });

                Promise.all(fetchPromises).then((results) => {
                    setTimeout(() => {
                        let width = $(`#keplergl-modal-body`).width();
                        let height = $(`#keplergl-modal-body`).height();
                        $(`#keplergl-modal-body`).empty();
                        if (width > 0 && height > 0) {
                            if (document.getElementById(modalContainerId)) {
                                try {
                                    ReactDOM.render((<Provider store={store}>
                                            <App width={width} height={height} data={results}/>
                                        </Provider>),
                                        document.getElementById(modalContainerId));
                                } catch (e) {
                                    console.log(e);
                                }
                            } else {
                                console.warn(`Unable to find the container for KeplerGL extension (element id: ${extensionId})`);
                            }
                        }
                    }, 500);
                });
            }

            /**
             *
             * @returns {XML}
             */
            render() {
                return (<div role="tabpanel">
                    <div>
                        <CompactLayerTree layers={this.state.layers} onSelectedLayersChange={this.onSelectedLayersChange.bind(this)}/>
                    </div>
                    <div>
                        <a className="btn btn-block" id="keplergl" href="#" data-toggle="modal" data-target="#keplergl-modal" onClick={this.openModal}>
                            <i className="fa fa-columns" aria-hidden="true"></i> {__(`Open KeplerGL in modal`)}
                        </a>
                    </div>
                </div>);
            }
        }

        if (document.getElementById(extensionId)) {
            try {
                ReactDOM.render(
                    <KeplerGLComponent />,
                    document.getElementById(extensionId)
                );
            } catch (e) {
                console.log(e);
            }
        } else {
            console.warn(`Unable to find the container for KeplerGL extension (element id: ${extensionId})`);
        }
    }

};


