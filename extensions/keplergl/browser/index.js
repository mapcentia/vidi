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

/**
 * Translations
 */
const dict = require('./translations');

/**
 *
 * @type {*|exports|module.exports}
 */
var cloud;

/**
 *
 * @type {*|exports|module.exports}
 */
var utils;

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
        utils = o.utils;
        return this;
    },

    /**
     *
     */
    init: function () {
        utils.createMainTab(extensionId, utils.__('KeplerGL', dict), utils.__("KeplerGL", dict), require('./../../../browser/modules/height')().max);

        /**
         *
         */
        class KeplerGLComponent extends React.Component {
            constructor(props) {
                super(props);
                this.state = {};

                this.openModal = this.openModal.bind(this);
            }

            /**
             *
             */
            componentDidMount() {
                this.setState({});
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
                    </div>
                    <div>
                        <a className="btn btn-block" id="keplergl" href="#" data-toggle="modal" data-target="#keplergl-modal" onClick={this.openModal}>
                            <i className="fa fa-columns" aria-hidden="true"></i> {utils.__(`Open KeplerGL in modal`, dict)}
                        </a>
                    </div>
                </div>);

                /*
     
                */
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


