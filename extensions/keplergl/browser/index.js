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
                    layers: false
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

            openModal(e) {
                setTimeout(() => {
                    let width = $(`#keplergl-modal-body`).width();
                    let height = $(`#keplergl-modal-body`).height();
                    if (width > 0 && height > 0) {
                        if (document.getElementById(modalContainerId)) {
                            try {
                                ReactDOM.render((<Provider store={store}>
                                        <App width={width} height={height}/>
                                    </Provider>),
                                    document.getElementById(modalContainerId));
                            } catch (e) {
                                console.log(e);
                            }
                        } else {
                            console.warn(`Unable to find the container for KeplerGL extension (element id: ${extensionId})`);
                        }
                    }
                }, 1000);
            }

            /**
             *
             * @returns {XML}
             */
            render() {
                return (<div role="tabpanel">
                    <div>
                        <CompactLayerTree layers={this.state.layers}/>
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


