/*
 * @author     Alexander Shumilov
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import StateSnapshotsDashboard from './components/StateSnapshotsDashboard';

/**
 * @type {*|exports|module.exports}
 */
var anchor, state, urlparser, backboneEvents;

const API_URL = `/api/state-snapshots`;

const exId = `state-snapshots`;

let customSetOfTitles = false;

let extensions;

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
        anchor = o.anchor;
        state = o.state;
        urlparser = o.urlparser;
        backboneEvents = o.backboneEvents;
        extensions = o.extensions;
        return this;
    },

    /**
     * Module initialization
     */
    init: function () {
        var React = require('react');
        var ReactDOM = require('react-dom');

        if (vidiConfig.enabledExtensions.indexOf(`watsonc`) > -1) {
            customSetOfTitles = true;
        }

        if (document.getElementById(exId)) {
            try {
                ReactDOM.render(<StateSnapshotsDashboard
                    anchor={anchor}
                    customSetOfTitles={customSetOfTitles}
                    state={state}
                    urlparser={urlparser}
                    backboneEvents={backboneEvents}/>, document.getElementById(exId));
            } catch (e) {
                console.log(e);
            }
        } else {
            console.warn(`Unable to find the container for state snapshots extension (element id: ${exId})`);
        }
    },

    /**
     * Fetches state snapshot by its identifier
     * 
     * @param {String} id State snapshot identifier
     * 
     * @return {Promise}
     */
    getSnapshotByID: (id) => {
        if (!id) {
            throw new Error(`Snapshot identifier was not provided`);
        }

        let result = new Promise((resolve, reject) => {
            $.getJSON(`${API_URL}/${vidiConfig.appDatabase}/${id}`).done((data) => {
                resolve(data);
            }).fail(() => {
                resolve(false);
            });
        });

        return result;
    }
};