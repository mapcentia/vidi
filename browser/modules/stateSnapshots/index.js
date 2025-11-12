/*
 * @author     Alexander Shumilov
 * @copyright  2013-2021 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';


import StateSnapshotsDashboard from './components/StateSnapshotsDashboard';
import {createRoot} from "react-dom/client";

let anchor, state, urlparser, backboneEvents;
const API_URL = `/api/state-snapshots`;
const exId = `state-snapshots`;
let customSetOfTitles = false;
let extensions;
const base64url = require('base64url');

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
        const React = require('react');

        if (vidiConfig.enabledExtensions.indexOf(`watsonc`) > -1) {
            customSetOfTitles = true;
        }

        if (document.getElementById(exId)) {
            try {
                createRoot(document.getElementById(exId)).render(<StateSnapshotsDashboard
                    anchor={anchor}
                    customSetOfTitles={customSetOfTitles}
                    state={state}
                    urlparser={urlparser}
                    backboneEvents={backboneEvents}/>
                );
            } catch (e) {
                console.log(e);
            }
        } else {
            console.warn(`Unable to find the container for state snapshots extension (element id: ${exId})`);
        }

        // Dirty hack so Bootstrap doesn't add focusin listners.
        // The focusin will focus the first input element when clicking the map.
        // It's placed here, so the MultiSelect tag widgets not are effected by the hack
        const current = document.addEventListener;
        document.addEventListener = function (type, listener) {
            if (type === "focusin") {
                //do nothing
            } else {
                let args = [];
                args[0] = type;
                args[1] = listener;
                current.apply(this, args);
            }
        };
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
        return new Promise((resolve) => {
            $.ajax({
                url: `${API_URL}/${vidiConfig.appDatabase}/${id}`,
                method: 'GET',
                accept: 'text/plain; charset=utf-8',
            }).then((data) => {
                resolve(JSON.parse(base64url.decode(data)));
            }).catch(error => {
                resolve(false);
            });
        });
    }
};
