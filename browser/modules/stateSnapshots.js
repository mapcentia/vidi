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
    "Remote snapshots": {
        "da_DK": "# Remote snapshots",
        "en_US": "# Remote snapshots"
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
    "Delete state": {
        "da_DK": "# Delete state",
        "en_US": "# Delete state"
    },
    "Import all local states to server": {
        "da_DK": "# Import all local states to server",
        "en_US": "# Import all local states to server"
    },
    "Import local state to server": {
        "da_DK": "# Import local state to server",
        "en_US": "# Import local state to server"
    },
};

/**
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
 * @type {*|exports|module.exports}
 */
var state;

/**
 * @type {*|exports|module.exports}
 */
var urlparser;

/**
 * @type {*|exports|module.exports}
 */
var backboneEvents;

let _self = false;

const exId = `state-snapshots-dialog-content`;

const STORAGE_KEY = `vidi-state-snapshots`;

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
        console.log('State snapshots manager was initialized');

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
                    localSnapshots: [],
                    remoteSnapshots: [],
                    loading: false,
                    authenticated: false
                };

                this.apiUrl = `/api/state-snapshots`;

                this.onCreateLocalHandler = this.onCreateLocalHandler.bind(this);
                this.onCreateRemoteHandler = this.onCreateRemoteHandler.bind(this);
                this.onImporHandler = this.onImporHandler.bind(this);
                this.onImporAllHandler = this.onImporAllHandler.bind(this);
                this.onApplyHandler = this.onApplyHandler.bind(this);
                this.onDeleteLocalHandler = this.onDeleteLocalHandler.bind(this);
                this.onDeleteRemoteHandler = this.onDeleteRemoteHandler.bind(this);
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

            createRemoteSnapshot(snapshot) {
                let _self = this;
                $.ajax({
                    url: this.apiUrl,
                    method: 'POST',
                    dataType: 'json',
                    data: { snapshot }
                }).then(data => {
                    _self.refreshSnapshotsList();
                });
            }

            createLocalSnapshot(snapshot) {
                let _self = this;
                localforage.getItem(STORAGE_KEY).then((data) => {
                    let currentDateTime = new Date();
                    let timestamp = Math.round(currentDateTime.getTime() / 1000);
                    let hash = md5(timestamp);
                    data.push({
                        id: hash,
                        created_at: currentDateTime.toISOString(),
                        snapshot
                    });

                    localforage.setItem(STORAGE_KEY, data).then(() => {
                        _self.refreshSnapshotsList();
                    }).catch(error => {
                        throw new Error(error);
                    });
                });
            }

            getCurrentApplicationState() {
                return new Promise((resolve, reject) => {
                    if (confirm(`${__(`Save current application state`)}?`)) {
                        state.getState().then(state => {
                            console.log('###', state);
                            resolve(state);
                        });
                    } else {
                        reject();
                    }
                });
            }

            onCreateLocalHandler() {
                this.getCurrentApplicationState().then((state) => this.createLocalSnapshot(state));
            }

            onCreateRemoteHandler() {
                this.getCurrentApplicationState().then((state) => this.createRemoteSnapshot(state));
            }

            onApplyHandler(item) {
                state.applyState(item.snapshot).then(() => {});
            }

            onDeleteLocalHandler(id, ask = true) {
                let _self = this;
                let result = false;
                if (ask === false || confirm(`${__(`Delete state`)}?`)) {
                    result = new Promise((resolve, reject) => {
                        localforage.getItem(STORAGE_KEY).then((data) => {
                            for (let i = (data.length); i--; i >= 0) {
                                if (data[i].id === id) {
                                    data.splice(i, 1);
                                }
                            }

                            localforage.setItem(STORAGE_KEY, data).then(() => {
                                _self.refreshSnapshotsList();
                            }).catch(error => {
                                throw new Error(error);
                            });
                        });
                    });
                }

                return result;
            }

            onDeleteRemoteHandler(id) {
                if (confirm(`${__(`Delete state`)}?`)) {
                    let _self = this;
                    $.ajax({
                        url: `${this.apiUrl}/${id}`,
                        method: 'DELETE',
                        dataType: 'json'
                    }).then(data => {
                        _self.refreshSnapshotsList();
                    });
                }
            }

            onImporHandler(item) {
                let _self = this;
                if (confirm(`${__(`Import local state to server`)}?`)) {
                    $.ajax({
                        url: this.apiUrl,
                        method: 'POST',
                        dataType: 'json',
                        data: { snapshot: item.snapshot }
                    }).then(data => {
                        _self.onDeleteLocalHandler(item.id, false).then(() => {
                            _self.refreshSnapshotsList();
                        });
                    });
                }
            }

            onImporAllHandler() {
                if (confirm(`${__(`Import all local states to server`)}?`)) {
                    let _self = this;
                    let promises = [];
                    this.state.localSnapshots.map(item => {
                        console.log(`## import`, item);
                        promises.push($.ajax({
                            url: this.apiUrl,
                            method: 'POST',
                            dataType: 'json',
                            data: { snapshot: item.snapshot }
                        }));
                    });

                    Promise.all(promises).then(() => {
                        _self.resetLocalSnapshotStorage().then(() => {
                            _self.refreshSnapshotsList();
                        });
                    });
                }
            }

            resetLocalSnapshotStorage() {
                return localforage.setItem(STORAGE_KEY, []);
            }

            refreshSnapshotsList() {
                let _self = this;

                this.setState({ loading: true });

                // Getting locally stored snapshots
                localforage.getItem(STORAGE_KEY).then((data) => {
                    let localSnapshots = false;
                    if (data) {
                        localSnapshots = data;
                    } else {
                        this.resetLocalSnapshotStorage();
                    }

                    let remoteSnapshots = false;
                    if (this.state.authenticated) {
                        $.getJSON(this.apiUrl).then(data => {
                            if (data) {
                                remoteSnapshots = data;
                            }

                            _self.setState({ localSnapshots, remoteSnapshots, loading: false });
                        });
                    } else {
                        _self.setState({ localSnapshots, remoteSnapshots: [], loading: false });
                    }
                }).catch(error => {
                    throw new Error(error);
                });
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
                    let dateFormatted = (`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`);

                    let importButton = false;
                    if (local) {
                        importButton = (<button type="button" className="btn btn-xs btn-primary" onClick={() => this.onImporHandler(item)} style={buttonStyle}>
                            <i className="material-icons">save</i>
                        </button>);
                    }

                    let deleteHandler = (local ? () => this.onDeleteLocalHandler(item.id) : () => this.onDeleteRemoteHandler(item.id));
                    return (<div className="panel panel-default" key={index} style={{marginBottom: '8px'}}>
                        <div className="panel-body" style={{padding: '8px'}}>
                            <span style={snapshotIdStyle} title={item.id}>{item.id.substring(0, 10)}</span>
                            <span className="label label-default">{dateFormatted}</span>
                            <button
                                type="button"
                                className="btn btn-xs btn-primary"
                                onClick={() => { this.onApplyHandler(item); }}
                                style={buttonStyle}>
                                <i className="material-icons">play_arrow</i>
                            </button>
                            <button
                                type="button"
                                className="btn btn-xs btn-primary"
                                onClick={deleteHandler}
                                style={buttonStyle}>
                                <i className="material-icons">delete</i>
                            </button>
                            {importButton}
                        </div>
                    </div>);
                };

                let localSnapshots = (<div style={{textAlign: `center`}}>
                    <a onClick={this.onCreateLocalHandler}>{__(`No snapshots`)}. {__(`Create one`)}?</a>
                </div>);

                let importAllIsDisabled = true;
                if (this.state.localSnapshots && this.state.localSnapshots.length > 0) {
                    importAllIsDisabled = false;
                    localSnapshots = [];
                    this.state.localSnapshots.map((item, index) => {
                        localSnapshots.push(createSnapshotRecord(item, index, true));
                    });
                }

                let remoteSnapshots = (<div style={{textAlign: `center`}}>
                    <a onClick={this.onCreateRemoteHandler}>{__(`No snapshots`)}. {__(`Create one`)}?</a>
                </div>);
                if (this.state.remoteSnapshots && this.state.remoteSnapshots.length > 0) {
                    remoteSnapshots = [];
                    this.state.remoteSnapshots.map((item, index) => {
                        remoteSnapshots.push(createSnapshotRecord(item, index));
                    });
                }

                let remoteSnapshotsPanel = false;
                if (this.state.authenticated) {
                    remoteSnapshotsPanel = (<div>
                        <div>
                            <h4>
                                {__(`Remote snapshots`)}
                                <button className="btn btn-xs btn-primary" onClick={this.onCreateRemoteHandler} style={buttonStyle}>
                                    <i className="material-icons">add</i>
                                </button>
                            </h4>
                        </div>
                        <div>
                            <div>{remoteSnapshots}</div>
                        </div>
                    </div>);
                }

                return (<div>
                    <div>
                        <div>
                            <h4>
                                {__(`Local snapshots`)} 
                                <button className="btn btn-xs btn-primary" onClick={this.onCreateLocalHandler} style={buttonStyle}>
                                    <i className="material-icons">add</i>
                                </button>
                                <button className="btn btn-xs btn-primary" onClick={this.onImporAllHandler} disabled={importAllIsDisabled} style={buttonStyle}>
                                    <i className="material-icons">save</i>
                                </button>
                            </h4>
                        </div>
                        <div>
                            <div>{localSnapshots}</div>
                        </div>
                    </div>
                    {remoteSnapshotsPanel}
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

};