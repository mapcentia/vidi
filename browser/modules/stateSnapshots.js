/**
 * State snapshots manager
 * 
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

const md5 = require(`md5`);

const translations = {
    "State snapshots": {
        "da_DK": "# State snapshots",
        "en_US": "# State snapshots"
    },
    "Local snapshots": {
        "da_DK": "# Local snapshots",
        "en_US": "# Local snapshots"
    },
    "User snapshots": {
        "da_DK": "# User snapshots",
        "en_US": "# User snapshots"
    },
    "No snapshots": {
        "da_DK": "# No snapshots",
        "en_US": "# No snapshots"
    },
    "Create one": {
        "da_DK": "# Create one",
        "en_US": "# Create one"
    },
    "Save current application state": {
        "da_DK": "# Save current application state",
        "en_US": "# Save current application state"
    },
    "Delete snapshot": {
        "da_DK": "# Delete snapshot",
        "en_US": "# Delete snapshot"
    },
    "Add local state snapshots to user's ones": {
        "da_DK": "# Add local state snapshots to user's ones",
        "en_US": "# Add local state snapshots to user's ones"
    },
    "Add local state snapshot to user's ones": {
        "da_DK": "# Add local state snapshot to user's ones",
        "en_US": "# Add local state snapshot to user's ones"
    },
    "copy link": {
        "da_DK": "# copy link",
        "en_US": "# copy link"
    }
};

const API_URL = `/api/state-snapshots`;

/**
 * @type {*|exports|module.exports}
 */
var cloud, anchor, utils, state, urlparser, backboneEvents;

let _self = false;

const exId = `state-snapshots-dialog-content`;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = module.exports = {
    /**
     *
     * @param o
     * @returns {exports}
     */
    set: function (o) {
        anchor = o.anchor;
        cloud = o.cloud;
        state = o.state;
        urlparser = o.urlparser;
        backboneEvents = o.backboneEvents;
        utils = o.utils;

        _self = this;
        return this;
    },

    /**
     * Module initialization
     */
    init: function () {
        /**
         *
         */
        var React = require('react');

        /**
         *
         */
        var ReactDOM = require('react-dom');

        /**
         *
         * @type {{Info: {da_DK: string, en_US: string}}}
         */
        var dict = translations;

        /**
         *
         * @param txt
         * @returns {*}
         * @private
         */
        var __ = function (txt) {
            if (dict[txt][window._vidiLocale]) {
                return dict[txt][window._vidiLocale];
            } else {
                return txt;
            }
        };

        /**
         *
         */
        class StateSnapshots extends React.Component {

            constructor(props) {
                super(props);

                this.state = {
                    browserOwnerSnapshots: [],
                    userOwnerSnapshots: [],
                    loading: false,
                    authenticated: false
                };

                this.applySnapshot = this.applySnapshot.bind(this);
                this.createSnapshot = this.createSnapshot.bind(this);
                this.deleteSnapshot = this.deleteSnapshot.bind(this);
                this.seizeSnapshot = this.seizeSnapshot.bind(this);               
                this.seizeAllSnapshots = this.seizeAllSnapshots.bind(this);
                this.copyToClipboard = this.copyToClipboard.bind(this);
            }

            /**
             *
             */
            componentDidMount() {
                let _self = this;
                this.refreshSnapshotsList();

                backboneEvents.get().on(`session:authChange`, (authenticated) => {
                    if (this.state.authenticated !== authenticated) {
                        this.setState({ authenticated });
                    }
                });
            }

            /**
             * Creates snapshot
             * 
             * @param {Boolean} browserOwned Specifies if the created snapshot belongs to browser or user
             */
            createSnapshot(browserOwned = false) {
                if (confirm(`${__(`Save current application state`)}?`)) {
                    state.getState().then(state => {
                        if ('modules' in state === false) {
                            throw new Error(`No modules data in state`);
                        }

                        state.map = anchor.getCurrentMapParameters();

                        let _self = this;
                        $.ajax({
                            url: API_URL,
                            method: 'POST',
                            dataType: 'json',
                            data: {
                                anonymous: browserOwned,
                                snapshot: state
                            }
                        }).then(() => {
                            _self.refreshSnapshotsList();
                        });
                    });
                }
            }

            /**
             * Applies snapshot
             * 
             * @param {Object} item Applies snapshot
             */
            applySnapshot(item) {
                state.applyState(item.snapshot);
            }

            /**
             * Deletes snapshot
             * 
             * @param {String} id Snapshot identifier
             */
            deleteSnapshot(id) {
                if (confirm(`${__(`Delete snapshot`)}?`)) {
                    let _self = this;
                    $.ajax({
                        url: `${API_URL}/${id}`,
                        method: 'DELETE',
                        dataType: 'json'
                    }).then(data => {
                        _self.refreshSnapshotsList();
                    });
                }
            }

            /**
             * Makes state snapshot belong to user, not browser
             */
            seizeSnapshot(item) {
                let _self = this;
                if (confirm(`${__(`Add local state snapshot to user's ones`)}?`)) {
                    $.ajax({
                        url: `${API_URL}/${item.id}`,
                        method: 'PUT',
                        dataType: 'json',
                        data: { anonymous: false }
                    }).then(data => {
                        _self.refreshSnapshotsList();
                    });
                }
            }

            /**
             * Makes all state snapshots belong to user, not browser
             */
            seizeAllSnapshots() {
                if (confirm(`${__(`Add local state snapshots to user's ones`)}?`)) {
                    let _self = this;
                    let promises = [];
                    this.state.browserOwnerSnapshots.map(item => {
                        promises.push($.ajax({
                            url: `${API_URL}/${item.id}`,
                            method: 'PUT',
                            dataType: 'json',
                            data: { anonymous: false }
                        }));
                    });

                    Promise.all(promises).then(() => {
                        _self.refreshSnapshotsList();
                    });
                }
            }


            /**
             * Retrives state snapshots list from server
             */
            refreshSnapshotsList() {
                let _self = this;

                this.setState({ loading: true });
                
                $.getJSON(API_URL).then(data => {
                    let browserOwnerSnapshots = [];
                    let userOwnerSnapshots = [];
                    data.map(item => {
                        if (item.browserId) {
                            browserOwnerSnapshots.push(item);
                        } else if (item.userId) {
                            userOwnerSnapshots.push(item);
                        } else {
                            throw new Error(`Invalid state snapshot`);
                        }
                    });

                    _self.setState({ browserOwnerSnapshots, userOwnerSnapshots, loading: false });
                });
            }

            copyToClipboard (str) {
                const el = document.createElement('textarea');
                el.value = str;
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
            }

            /**
             * Renders the component
             * 
             * @returns {XML}
             */
            render() {
                let snapshotIdStyle = {
                    fontFamily: `"Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace`,
                    marginRight: `10px`
                };

                let snapshotRecordRecordStyle = {
                    padding: '4px',
                    marginBottom: '4px',
                    border: '1px solid grey'
                };

                let buttonStyle = {
                    padding: `4px`,
                    margin: `0px`
                };

                const createSnapshotRecord = (item, index, local = false) => {
                    let date = new Date(item.created_at);
                    let dateFormatted = (`${date.getHours()}:${date.getMinutes()} ${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`);

                    let importButton = false;
                    if (local && this.state.authenticated) {
                        importButton = (<button type="button" className="btn btn-xs btn-primary" onClick={() => this.seizeSnapshot(item)} style={buttonStyle}>
                            <i className="material-icons">person_add</i>
                        </button>);
                    }

                    let permaLink = `${window.location.origin}${anchor.getUri()}?state=${item.id}`;

                    return (<div className="panel panel-default" key={index} style={{marginBottom: '8px'}}>
                        <div className="panel-body" style={{padding: '8px'}}>
                            <div>
                                <span style={snapshotIdStyle} title={item.id}>{item.id.substring(0, 10)}</span>
                                <span className="label label-default">{dateFormatted}</span>
                                <button
                                    type="button"
                                    className="btn btn-xs btn-primary"
                                    onClick={() => { this.applySnapshot(item); }}
                                    style={buttonStyle}>
                                    <i className="material-icons">play_arrow</i>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-xs btn-primary"
                                    onClick={() => this.deleteSnapshot(item.id)}
                                    style={buttonStyle}>
                                    <i className="material-icons">delete</i>
                                </button>
                                {importButton}
                            </div>
                            <div>
                                <div className="input-group">
                                    <a className="input-group-addon" onClick={ () => { this.copyToClipboard(permaLink) }}>{__(`copy link`)}</a>
                                    <input className="form-control" type="text" defaultValue={permaLink}/>
                                </div>
                            </div>
                        </div>
                    </div>);
                };

                let browserOwnerSnapshots = (<div style={{textAlign: `center`}}>
                    <a onClick={() => { this.createSnapshot(true) }}>{__(`No snapshots`)}. {__(`Create one`)}?</a>
                </div>);

                let importAllIsDisabled = true;
                if (this.state.browserOwnerSnapshots && this.state.browserOwnerSnapshots.length > 0) {
                    if (this.state.authenticated) importAllIsDisabled = false;

                    browserOwnerSnapshots = [];
                    this.state.browserOwnerSnapshots.map((item, index) => {
                        browserOwnerSnapshots.push(createSnapshotRecord(item, index, true));
                    });
                }

                let userOwnerSnapshots = (<div style={{textAlign: `center`}}>
                    <a onClick={() => { this.createSnapshot() }}>{__(`No snapshots`)}. {__(`Create one`)}?</a>
                </div>);
                if (this.state.userOwnerSnapshots && this.state.userOwnerSnapshots.length > 0) {
                    userOwnerSnapshots = [];
                    this.state.userOwnerSnapshots.map((item, index) => {
                        userOwnerSnapshots.push(createSnapshotRecord(item, index));
                    });
                }

                let userOwnerSnapshotsPanel = false;
                if (this.state.authenticated) {
                    userOwnerSnapshotsPanel = (<div>
                        <div>
                            <h4>
                                {__(`User snapshots`)}
                                <button className="btn btn-xs btn-primary" onClick={() => { this.createSnapshot() }} style={buttonStyle}>
                                    <i className="material-icons">add</i>
                                </button>
                            </h4>
                        </div>
                        <div>
                            <div>{userOwnerSnapshots}</div>
                        </div>
                    </div>);
                }

                let overlay = false;
                if (this.state.loading) {
                    overlay = (<div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'white',
                        opacity: '0.7',
                        zIndex:  '1000'
                    }}></div>);
                }

                return (<div>
                    {overlay}
                    <div>
                        <div>
                            <div>
                                <h4>
                                    {__(`Local snapshots`)} 
                                    <button className="btn btn-xs btn-primary" onClick={() => { this.createSnapshot(true) }} style={buttonStyle}>
                                        <i className="material-icons">add</i>
                                    </button>
                                    <button className="btn btn-xs btn-primary" onClick={this.seizeAllSnapshots} disabled={importAllIsDisabled} style={buttonStyle}>
                                        <i className="material-icons">person_add</i>
                                    </button>
                                </h4>
                            </div>
                            <div>
                                <div>{browserOwnerSnapshots}</div>
                            </div>
                        </div>
                        {userOwnerSnapshotsPanel}
                    </div>
                </div>);
            }
        }

        if (document.getElementById(exId)) {
            utils.createMainTab(exId, __("State snapshots"), __("State snapshots"), require('./height')().max);
            try {
                ReactDOM.render(<StateSnapshots/>, document.getElementById(exId));
            } catch (e) {
                console.log(e);
            }
        } else {
            console.warn(`Unable to find the container for offlineMap extension (element id: ${exId})`);
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
            $.getJSON(`${API_URL}/${id}`).done((data) => {
                resolve(data);
            }).fail(() => {
                resolve(false);
            });
        });

        return result;
    }
};