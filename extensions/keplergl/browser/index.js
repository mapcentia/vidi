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

const KeplerGLComponent = () => (
    <Provider store={store}>
      <App/>
    </Provider>
  );

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
var exId = 'keplegl';

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
        utils.createMainTab(exId, utils.__('KeplerGL', dict), utils.__("KeplerGL", dict), require('./../../../browser/modules/height')().max);


        const Root = () => (
            <Provider store={store}>
              <App/>
            </Provider>
          );


        /**
         *
         */
        class KeplerGLApp extends React.Component {

            constructor(props) {
                super(props);

                this.state = {
                };
            }

            /**
             *
             */
            componentDidMount() {
                this.setState({});
            }

            /**
             *
             * @returns {XML}
             */
            render() {
                return (
                    <div role="tabpanel">
                        <KeplerGLComponent/>
                    </div>
                );
            }
        }

        if (document.getElementById(exId)) {
            try {
                ReactDOM.render(
                    <KeplerGLApp />,
                    document.getElementById(exId)
                );
            } catch (e) {
                console.log(e);
            }
        } else {
            console.warn(`Unable to find the container for offlineMap extension (element id: ${exId})`);
        }
    }

};


