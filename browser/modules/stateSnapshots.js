/**
 * State snapshots manager
 * 
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

const md5 = require(`md5`);

const dict = {
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
    "Update state snapshot with current application state": {
        "da_DK": "# Update state snapshot with current application state",
        "en_US": "# Update state snapshot with current application state"
    },
    "Apply state snapshot": {
        "da_DK": "# Apply state snapshot",
        "en_US": "# Apply state snapshot"
    },
    "Delete state snapshot": {
        "da_DK": "# Delete state snapshot",
        "en_US": "# Delete state snapshot"
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
    },
    "New title": {
        "da_DK": "# New title",
        "en_US": "# New title"
    },
    "Description": {
        "da_DK": "# Save and share the current state of the application",
        "en_US": "# Save and share the current state of the application",
    }
};

const API_URL = `/api/state-snapshots`;

/**
 * @type {*|exports|module.exports}
 */
var cloud, anchor, utils, state, print, urlparser, serializeLayers, backboneEvents;

/**
 *
 * @type {exports|module.exports}
 */
const uuidv4 = require('uuid/v4');

const cookie = require('js-cookie');

let _self = false;

const exId = `state-snapshots-dialog-content`;

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
        cloud = o.cloud;
        state = o.state;
        print = o.print;
        urlparser = o.urlparser;
        serializeLayers = o.serializeLayers;
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

        utils.createMainTab(exId, utils.__("State snapshots", dict), utils.__("Description", dict), require('./../../browser/modules/height')().max);

        let buttonStyle = {
            padding: `4px`,
            margin: `0px`
        };

        /**
         * Title field for state snapshot
         */
        class StateSnapshotTitleField extends React.Component {
            constructor(props) {
                super(props);
                if (props.type !== `userOwned` && props.type !== `browserOwned`) {
                    throw new Error(`Invalid type options`);
                }
                
                this.state = {
                    title: (props.value ? props.value : ``)
                }
            }

            onChange(event) {
                this.setState({ title: event.target.value });
            }

            onSave(event) {
                this.props.onAdd(this.state.title);
                this.setState({ title: '' });
            }

            render() {
                let cancelControl = false;
                if (this.props.onCancel) {
                    cancelControl = (<button
                        className="btn btn-xs btn-primary"
                        onClick={this.props.onCancel}
                        style={buttonStyle}>
                        <i className="material-icons">cancel</i>
                    </button>);
                }

                return (<div className="input-group" style={{ width: '50%', display: 'inline-table', paddingLeft: '8px' }}>
                    <input value={this.state.title} type="text" className="form-control" placeholder={utils.__("New title", dict)} onChange={this.onChange.bind(this)}/>
                    <span className="input-group-btn" style={{ padding: '6px', verticalAlign: 'top' }}>
                        <button
                            className="btn btn-xs btn-primary"
                            onClick={this.onSave.bind(this)}
                            disabled={!this.state.title}
                            style={buttonStyle}>
                            <i className="material-icons">save</i>
                        </button>
                        {cancelControl}
                    </span>
                </div>);
            }
        }


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
                    authenticated: false,
                    updatedItemId: false,
                    stateApplyingIsBlocked: false
                };

                this.applySnapshot = this.applySnapshot.bind(this);
                this.createSnapshot = this.createSnapshot.bind(this);
                this.deleteSnapshot = this.deleteSnapshot.bind(this);
                this.seizeSnapshot = this.seizeSnapshot.bind(this);               
                this.seizeAllSnapshots = this.seizeAllSnapshots.bind(this);
                this.copyToClipboard = this.copyToClipboard.bind(this);

                // Setting unique cookie if it have not been set yet
                let trackingCookie = uuidv4();
                if (cookie.get('vidi-state-tracker')) {
                    trackingCookie = cookie.get('vidi-state-tracker');
                } else {
                    cookie.set('vidi-state-tracker', trackingCookie);
                }
            }

            /**
             *
             */
            componentDidMount() {
                let _self = this;
                backboneEvents.get().on(`session:authChange`, (authenticated) => {
                    if (this.state.authenticated !== authenticated) {
                        this.setState({ authenticated });
                        this.refreshSnapshotsList();
                    }
                });

                this.refreshSnapshotsList();
            }

            /**
             * Creates snapshot
             * 
             * @param {Boolean} anonymous Specifies if the created snapshot belongs to browser or user
             */
            createSnapshot(title, anonymous = false) {
                let _self = this;

                _self.setState({ loading: true });
                state.getState().then(state => {
                    if ('modules' in state === false) {
                        throw new Error(`No modules data in state`);
                    }

                    state.map = anchor.getCurrentMapParameters();
                    $.ajax({
                        url: API_URL,
                        method: 'POST',
                        dataType: 'json',
                        data: {
                            title,
                            anonymous,
                            snapshot: state
                        }
                    }).then(() => {
                        _self.setState({ loading: false });
                        _self.refreshSnapshotsList();
                    });
                });
            }

            /**
             * Applies snapshot
             * 
             * @param {Object} item Applies snapshot
             */
            applySnapshot(item) {
                this.setState({ stateApplyingIsBlocked: true });
                state.applyState(item.snapshot).then(() => {
                    this.setState({ stateApplyingIsBlocked: false });
                });
            }

            /**
             * Deletes snapshot
             * 
             * @param {String} id Snapshot identifier
             */
            deleteSnapshot(id) {
                if (confirm(`${utils.__(`Delete state snapshot`, dict)}?`)) {
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
             * Updates snapshot
             * 
             * @param {String} id Snapshot identifier
             */
            updateSnapshot(data, title) {
                let _self = this;

                _self.setState({ loading: true });
                state.getState().then(state => {
                    if ('modules' in state === false) {
                        throw new Error(`No modules data in state`);
                    }

                    state.map = anchor.getCurrentMapParameters();

                    data.title = title;
                    data.snapshot = state;
                    $.ajax({
                        url: API_URL,
                        method: 'PUT',
                        dataType: 'json',
                        data
                    }).then(data => {
                        _self.refreshSnapshotsList();
                        _self.setState({
                            updatedItemId: false,
                            loading: false
                        });
                    });
                });
            }

            /**
             * Enables updat form for snapshot
             * 
             * @param {String} id Snapshot identifier
             */
            enableUpdateSnapshotForm(id) {
                this.setState({
                    updatedItemId: id
                });
            }

            /**
             * Makes state snapshot belong to user, not browser
             */
            seizeSnapshot(item) {
                let _self = this;
                if (confirm(`${utils.__(`Add local state snapshot to user's ones`, dict)}?`)) {
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
                if (confirm(`${utils.__(`Add local state snapshots to user's ones`, dict)}?`)) {
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

                    let titleLabel = (<span style={snapshotIdStyle} title={item.id}>{item.id.substring(0, 6)}</span>);
                    if (item.title) {
                        titleLabel = (<span style={{marginRight: `10px`}} title={item.title}>{item.title.substring(0, 24)}</span>);
                    }

                    let updateSnapshotControl = (<button
                        type="button"
                        className="btn btn-xs btn-primary"
                        onClick={() => this.enableUpdateSnapshotForm(item.id)}
                        title={utils.__(`Update state snapshot with current application state`, dict)}
                        style={buttonStyle}>
                        <i className="material-icons">autorenew</i>
                    </button>);
                    if (this.state.updatedItemId === item.id) {
                        let type = (local ? 'browserOwned' : 'userOwned')
                        updateSnapshotControl = (<StateSnapshotTitleField
                            value={item.title}
                            onAdd={(newTitle) => { this.updateSnapshot(item, newTitle) }}
                            onCancel={() => { this.setState({ updatedItemId: false }) }}
                            type={type}/>);
                    }

                    return (<div className="panel panel-default" key={index} style={{marginBottom: '8px'}}>
                        <div className="panel-body" style={{padding: '8px'}}>
                            <div>
                                {titleLabel}
                                <span className="label label-default">{dateFormatted}</span>
                                <button
                                    type="button"
                                    className="btn btn-xs btn-primary"
                                    onClick={() => { this.applySnapshot(item); }}
                                    disabled={this.state.stateApplyingIsBlocked}
                                    title={utils.__(`Apply state snapshot`, dict)}
                                    style={buttonStyle}>
                                    <i className="material-icons">play_arrow</i>
                                </button>
                                {updateSnapshotControl}
                                <button
                                    type="button"
                                    className="btn btn-xs btn-primary"
                                    onClick={() => this.deleteSnapshot(item.id)}
                                    title={utils.__(`Delete state snapshot`, dict)}
                                    style={buttonStyle}>
                                    <i className="material-icons">delete</i>
                                </button>
                                {importButton}
                            </div>
                            <div>
                                <div className="input-group">
                                    <a className="input-group-addon" onClick={ () => { this.copyToClipboard(permaLink) }}>{utils.__(`copy link`, dict)}</a>
                                    <input className="form-control" type="text" defaultValue={permaLink}/>
                                </div>
                            </div>
                        </div>
                    </div>);
                };

                let browserOwnerSnapshots = (<div style={{textAlign: `center`}}>
                    {utils.__(`No snapshots`, dict)}
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
                    {utils.__(`No snapshots`, dict)}
                </div>);
                if (this.state.userOwnerSnapshots && this.state.userOwnerSnapshots.length > 0) {
                    userOwnerSnapshots = [];
                    this.state.userOwnerSnapshots.map((item, index) => {
                        userOwnerSnapshots.push(createSnapshotRecord(item, index));
                    });
                }

                let userOwnerSnapshotsPanel = false;
                if (this.state.authenticated) {
                    userOwnerSnapshotsPanel = (<div className="js-user-owned">
                        <div>
                            <h4>
                                {utils.__(`User snapshots`, dict)}
                                <StateSnapshotTitleField onAdd={(title) => { this.createSnapshot(title) }} type="userOwned"/>
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
                        <div className="js-browser-owned">
                            <div>
                                <h4>
                                    {utils.__(`Local snapshots`, dict)} 
                                    <StateSnapshotTitleField onAdd={(title) => { this.createSnapshot(title, true) }} type="browserOwned"/>
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