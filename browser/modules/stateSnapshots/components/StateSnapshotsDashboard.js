/*
 * @author     Alexander Shumilov
 * @copyright  2013-2021 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const React = require('react');
import TitleFieldComponent from './../../shared/TitleFieldComponent';
import LoadingOverlay from './../../shared/LoadingOverlay';

const uuidv4 = require('uuid/v4');
const cookie = require('js-cookie');
const base64url = require('base64url');

const buttonStyle = {padding: `4px`, margin: `0px`};

const DEFAULT_API_URL = `/api/state-snapshots`;
const urlparser = require('./../../urlparser');
const noTracking = urlparser.urlVars["notracking"] === "true";

let jquery = require('jquery');
require('snackbarjs');

/**
 * State snapshots dashboard
 */
class StateSnapshotsDashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            apiUrl: (props.apiUrl ? props.apiUrl : DEFAULT_API_URL),
            browserOwnerSnapshots: [],
            userOwnerSnapshots: [],
            loading: false,
            authenticated: props.initialAuthenticated ? props.initialAuthenticated : false,
            updatedItemId: false,
            stateApplyingIsBlocked: false,
            imageLinkSizes: {}
        };

        this.applySnapshot = this.applySnapshot.bind(this);
        this.createSnapshot = this.createSnapshot.bind(this);
        this.deleteSnapshot = this.deleteSnapshot.bind(this);
        this.seizeSnapshot = this.seizeSnapshot.bind(this);
        this.seizeAllSnapshots = this.seizeAllSnapshots.bind(this);
        this.setImageLinkSize = this.setImageLinkSize.bind(this);
        this.copyToClipboard = this.copyToClipboard.bind(this);

        // Setting unique cookie if it have not been set yet
        if (!noTracking) {
            let options = {
                expires: 365
            }
            if (process.env.NODE_ENV === "production") {
                options.secure = true;
                options.sameSite = 'none';
            }
            let trackingCookie = uuidv4();
            if (!cookie.get('vidi-state-tracker')) {
                cookie.set('vidi-state-tracker', trackingCookie, options);
            }
        }
    }

    componentDidMount() {
        this.mounted = true;

        let _self = this;
        this.props.backboneEvents.get().on(`session:authChange`, (authenticated) => {
            if (this.mounted && _self.state.authenticated !== authenticated) {
                _self.setState({authenticated});
                _self.refreshSnapshotsList();
            }
        });

        // Figuring out if we are in a session. If so, don't refresh snapshots, because the session will also do this.
        // This way we only load snapshots once
        if (this.props.force) {
            _self.refreshSnapshotsList();
        } else {
            try {
                let session = require('../../../../extensions/session/browser');
                if (window.vidiConfig.enabledExtensions.includes('session')) {
                    (function poll() {
                        if (session.isStatusChecked()) {
                            if (!session.isAuthenticated()) {
                                _self.refreshSnapshotsList(); // Status is checked and we're not a session
                            }
                        } else {
                            setTimeout(() => poll(), 100)
                        }
                    }())
                } else {
                    _self.refreshSnapshotsList();
                }
            } catch (e) {
                _self.refreshSnapshotsList();
            }
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    /**
     * Returns the current meta settings of the snapshot
     *
     * Meta remembers current configuration (config, template), so when state snapshots panel, for example,
     * will be opened for the same browser but with different configuration, generated snapshot
     * links will be correct
     */
    getSnapshotMeta() {
        let result = {};
        let queryParameters = this.props.urlparser.urlVars;
        if (`config` in queryParameters && queryParameters.config) {
            result.config = queryParameters.config;
        }

        if (`tmpl` in queryParameters && queryParameters.tmpl) {
            result.tmpl = queryParameters.tmpl;
        }

        return result;
    }

    /**
     * Creates snapshot
     *
     * @param title
     * @param {Boolean} anonymous Specifies if the created snapshot belongs to browser or user
     */
    createSnapshot(title, anonymous = false) {
        let _self = this;

        _self.setState({loading: true});
        this.props.state.getState().then(state => {
            state.map = this.props.anchor.getCurrentMapParameters();
            state.meta = _self.getSnapshotMeta();
            let data = {
                title,
                anonymous,
                snapshot: state,
                database: vidiConfig.appDatabase,
                schema: vidiConfig.appSchema,
                host: this.props.urlparser.hostname
            };

            $.ajax({
                url: this.state.apiUrl + '/' + vidiConfig.appDatabase,
                method: 'POST',
                contentType: 'text/plain; charset=utf-8',
                dataType: 'text',
                data: base64url(JSON.stringify(data))
            }).then((response) => {
                _self.setState({loading: false});
                _self.refreshSnapshotsList();
                let obj = {"stateId": response.id, "data": data};
                window.parent.postMessage(obj, '*');
            }).catch(error => {
                console.error(error);
                _self.setState({loading: false});
                _self.refreshSnapshotsList();
            });
        });
    }

    /**
     * Applies snapshot
     *
     * @param {Object} item Applies snapshot
     */
    applySnapshot(item, ignoreInitZoomCenter) {
        if (this.props.onStateSnapshotApply) this.props.onStateSnapshotApply();

        this.setState({stateApplyingIsBlocked: true});
        this.props.state.applyState(item.snapshot, ignoreInitZoomCenter).then(() => {
            this.setState({stateApplyingIsBlocked: false});
        });
    }

    /**
     * Deletes snapshot
     *
     * @param {String} id Snapshot identifier
     */
    deleteSnapshot(id) {
        if (confirm(`${__(`Delete state snapshot`)}?`)) {
            let _self = this;
            $.ajax({
                url: `${this.state.apiUrl}/${vidiConfig.appDatabase}/${id}`,
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
     * @param data
     * @param title
     */
    updateSnapshot(data, title) {
        let _self = this;
        _self.setState({loading: true});
        this.props.state.getState().then(state => {
            state.map = this.props.anchor.getCurrentMapParameters();
            data.title = title;
            data.snapshot = state;
            data.snapshot.meta = _self.getSnapshotMeta();
            $.ajax({
                url: `${this.state.apiUrl}/${vidiConfig.appDatabase}/${data.id}`,
                method: 'PUT',
                contentType: 'text/plain; charset=utf-8',
                dataType: 'text',
                data: base64url(JSON.stringify(data))
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
        if (confirm(`${__(`Add local state snapshot to user's ones`)}?`)) {
            $.ajax({
                url: `${this.state.apiUrl}/${vidiConfig.appDatabase}/${item.id}/seize`,
                method: 'PUT',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8'
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
                    url: `${this.state.apiUrl}/${vidiConfig.appDatabase}/${item.id}`,
                    method: 'PUT',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify({anonymous: false})
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

        this.setState({loading: true});
        $.ajax({
            url: this.state.apiUrl + '/' + vidiConfig.appDatabase + '?ownerOnly=true',
            method: 'GET',
            dataType: 'text'
        }).then(data => {
            if (this.mounted) {
                let browserOwnerSnapshots = [];
                let userOwnerSnapshots = [];
                data = JSON.parse(base64url.decode(data));
                data.map(item => {
                    if (item.browserId) {
                        browserOwnerSnapshots.push(item);
                    } else if (item.userId) {
                        userOwnerSnapshots.push(item);
                    } else {
                        throw new Error(`Invalid state snapshot`);
                    }
                });

                _self.setState({browserOwnerSnapshots, userOwnerSnapshots, loading: false});
            }
        }, (jqXHR) => {
            if (jqXHR.responseJSON && jqXHR.responseJSON.error && jqXHR.responseJSON.error === `INVALID_OR_EMPTY_EXTERNAL_API_REPLY`) {
                console.error(`Seems like Vidi is unable to access key-value storage capabilities, please check if the GC2 supports it (state snapshots module will be disabled)`);
            }
        });
    }

    copyToClipboard(str) {
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        jquery.snackbar({
            content: "<span id=`conflict-progress`>" + __("Copied") + "</span>",
            htmlAllowed: true,
            timeout: 1000
        });
    }

    setImageLinkSize(value, id) {
        let sizesCopy = JSON.parse(JSON.stringify(this.state.imageLinkSizes));
        sizesCopy[id] = value;
        this.setState({imageLinkSizes: sizesCopy})
    }

    /**
     * Renders the component
     *
     * @returns {XML}
     */
    render() {
        let titles = {
            apply: __(`Apply state snapshot`),
            remove: __(`Delete state snapshot`),
            refresh: __(`Update state snapshot with current application state`),
            seize: __(`Add local state snapshot to user's ones`),
            localItems: __(`Local snapshots`),
            noLocalItems: __(`No local snapshots`),
            userItems: __(`User snapshots`),
            noUserItems: __(`No user snapshots`),
        };

        if (this.props.customSetOfTitles) {
            titles = {
                apply: __(`Start project`),
                remove: __(`Delete project`),
                refresh: __(`Refresh project`),
                seize: __(`Seize project`),
                localItems: __(`Local projects`),
                noLocalItems: __(`No local projects`),
                userItems: __(`User projects`),
                noUserItems: __(`No user projects`),
            };
        }

        let snapshotIdStyle = {
            fontFamily: `"Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace`,
            marginRight: `10px`
        };

        const generateSizeSelector = (item, value) => {
            let options = [];
            [`600x600`, `800x600`, `1024x768`, `1080x1080`, `1280x720`, `1920x1080`].map(size => {
                options.push(<option key={`${item.id}_size_key_${size}`} value={size}>{size}</option>);
            });

            return (<select style={{height: `25px`, padding: `0`}} className="form-control" value={value} onChange={(event) => {
                this.setImageLinkSize(event.target.value, item.id);
            }}>{options}</select>)
        };

        const createSnapshotRecord = (item, index, local = false) => {
            let date = new Date(item.updated_at || item.created_at); // updated_at is a newer property, which may not be present in older snapshots
            let dateFormatted = (`${date.getHours()}:${date.getMinutes()} ${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`);

            let importButton = false;
            if (local && this.state.authenticated) {
                importButton = (
                    <button type="button" className="btn btn-xs btn-primary" onClick={() => this.seizeSnapshot(item)}
                            style={buttonStyle}>
                        <i title={titles.seize} className="material-icons">person_add</i>
                    </button>);
            }

            let parameters = [];
            parameters.push(`state=${item.id}`);

            // Detecting not prioritized parameters from current URL
            let highPriorityConfigString = false, lowPriorityConfigString = false;
            let queryParameters = this.props.urlparser.urlVars;
            if (`config` in queryParameters && queryParameters.config) {
                lowPriorityConfigString = queryParameters.config;
            }

            if (item.snapshot && item.snapshot.meta) {
                if (item.snapshot.meta.config) {
                    highPriorityConfigString = item.snapshot.meta.config;
                }

                if (item.snapshot.meta.tmpl) {
                    parameters.push(`tmpl=${item.snapshot.meta.tmpl}`);
                }
            }

            let configParameter = ``;
            if (highPriorityConfigString) {
                configParameter = `config=${highPriorityConfigString}`;
                parameters.push(configParameter);
            } else if (lowPriorityConfigString) {
                configParameter = `config=${lowPriorityConfigString}`;
                parameters.push(configParameter);
            }

            let permaLink = `${window.location.origin}${this.props.anchor.getUri()}?${parameters.join(`&`)}`;

            let token = (item.token ? item.token : false);

            let titleLabel = (<span style={snapshotIdStyle} title={item.id}>{item.id.substring(0, 6)}</span>);
            if (item.title) {
                titleLabel = (
                    <span style={{marginRight: `10px`}} title={item.title}>{item.title.substring(0, 24)}</span>);
            }

            let updateSnapshotControl = (<button
                type="button"
                className="btn btn-xs btn-primary"
                onClick={() => this.enableUpdateSnapshotForm(item.id)}
                title={titles.refresh}
                style={buttonStyle}>
                <i className="material-icons">autorenew</i>
            </button>);
            if (this.state.updatedItemId === item.id) {
                let type = (local ? 'browserOwned' : 'userOwned')
                updateSnapshotControl = (<TitleFieldComponent
                    value={item.title}
                    onAdd={(newTitle) => {
                        this.updateSnapshot(item, newTitle)
                    }}
                    onCancel={() => {
                        this.setState({updatedItemId: false})
                    }}
                    type={type}/>);
            }

            let tokenField = false;
            if (token) {
                tokenField = (<div className="input-group form-group snapshot-copy-token" style={{paddingTop: `8px`}}>
                    <div style={{display: `flex`, width: `100%`}}>
                        <a className="input-group-addon" style={{cursor: `pointer`}} onClick={() => {
                            this.copyToClipboard(token)
                        }}><i className="material-icons" style={{fontSize: `18px`}}>content_copy</i>{__(`Copy token`)}</a>
                    </div>
                </div>);
            }

            let playButton = (<button
                type="button"
                className="btn btn-xs btn-primary"
                onClick={() => {
                    fetch(
                        `/api/state-snapshots/${vidiConfig.appDatabase}/${item.id}`
                    ).then((response) => response.text())
                        .then((data) => {
                            this.applySnapshot(JSON.parse(base64url.decode(data)), true);
                        });

                }}
                disabled={this.state.stateApplyingIsBlocked}
                title={titles.apply}
                style={buttonStyle}>
                <i className="material-icons">play_arrow</i></button>);

            let sizeValue = `1920x1080`;
            if (item.id in this.state.imageLinkSizes) sizeValue = this.state.imageLinkSizes[item.id];

            let selectSize = generateSizeSelector(item, sizeValue);
            let imageLink = `${window.location.origin}/api/static/${vidiConfig.appDatabase}/${vidiConfig.appSchema}/?state=${item.id}&width=${sizeValue.split(`x`)[0]}&height=${sizeValue.split(`x`)[1]}${configParameter ? `&${configParameter}` : ``}`;
            return (<div className="panel panel-default" key={index} style={{marginBottom: '8px'}}>
                <div className="panel-body" style={{padding: '8px'}}>
                    {this.props.playOnly ? (<div>
                        {titleLabel}
                        <span className="label label-default">{dateFormatted}</span>
                        {playButton}
                    </div>) : (<div>
                        {titleLabel}
                        <span className="label label-default">{dateFormatted}</span>
                        {playButton}
                        {updateSnapshotControl}
                        <button
                            type="button"
                            className="btn btn-xs btn-primary"
                            onClick={() => this.deleteSnapshot(item.id)}
                            title={titles.remove}
                            style={buttonStyle}>
                            <i className="material-icons">delete</i>
                        </button>
                        {importButton}
                    </div>)}
                    {this.props.playOnly ? false : (
                        <div style={{display: `flex`}}>
                            <div className="input-group form-group" style={{paddingTop: `8px`}}>
                                <div style={{display: `flex`, width: `100%`}}>
                                    <a className="input-group-addon" style={{cursor: `pointer`}} onClick={() => {
                                        this.copyToClipboard(permaLink)
                                    }}><i className="material-icons"
                                          style={{fontSize: `18px`}}>content_copy</i>{__(`Copy Vidi link`)}</a>
                                </div>
                            </div>
                            {tokenField}
                            <div className="input-group form-group snapshot-copy-png-link"
                                 style={{width: `100%`, paddingTop: `8px`}}>
                                <div style={{display: `flex`, width: `100%`}}>
                                    <div>
                                        <a className="input-group-addon" style={{cursor: `pointer`}} onClick={() => {
                                            this.copyToClipboard(imageLink)
                                        }}><i className="material-icons"
                                              style={{fontSize: `18px`}}>content_copy</i>{__(`Copy PNG link`)}</a>
                                    </div>
                                    <div style={{paddingLeft: `10px`, paddingRight: `10px`}}>{selectSize}</div>
                                </div>
                            </div>
                        </div>)}
                </div>
            </div>);
        };

        let browserOwnerSnapshots = false;
        if (!this.state.loading) {
            browserOwnerSnapshots = (<div style={{textAlign: `center`}}>
                {titles.noLocalItems}
            </div>);
        }

        let importAllIsDisabled = true;
        if (this.state.browserOwnerSnapshots && this.state.browserOwnerSnapshots.length > 0) {
            if (this.state.authenticated) importAllIsDisabled = false;

            browserOwnerSnapshots = [];
            this.state.browserOwnerSnapshots.map((item, index) => {
                browserOwnerSnapshots.push(createSnapshotRecord(item, index, true));
            });
        }

        let userOwnerSnapshots = (<div style={{textAlign: `center`}}>
            {titles.noUserItems}
        </div>);

        if (this.state.userOwnerSnapshots && this.state.userOwnerSnapshots.length > 0) {
            userOwnerSnapshots = [];
            this.state.userOwnerSnapshots.map((item, index) => {
                userOwnerSnapshots.push(createSnapshotRecord(item, index));
            });
        }

        let userOwnerSnapshotsPanel = false;
        if (this.state.authenticated) {
            let createNewSnapshotControl = false;
            if (this.props.readOnly) {
                if (this.props.showStateSnapshotTypes) {
                    createNewSnapshotControl = (<div>
                        <h4>
                            {titles.userItems}
                        </h4>
                    </div>);
                }
            } else {
                createNewSnapshotControl = (<div>
                    <h4>
                        {titles.userItems}
                        <TitleFieldComponent onAdd={(title) => {
                            this.createSnapshot(title)
                        }} type="userOwned"/>
                    </h4>
                </div>);
            }

            userOwnerSnapshotsPanel = (<div className="js-user-owned">
                {createNewSnapshotControl}
                <div>
                    <div>{userOwnerSnapshots}</div>
                </div>
            </div>);
        }

        let overlay = false;
        if (this.state.loading) {
            overlay = (<LoadingOverlay/>);
        }

        let createNewSnapshotControl = false;
        if (this.props.readOnly) {
            if (this.props.showStateSnapshotTypes) {
                createNewSnapshotControl = (<h4>
                    {titles.localItems}
                </h4>);
            }
        } else {
            createNewSnapshotControl = (<h4>
                {titles.localItems}
                <TitleFieldComponent onAdd={(title) => {
                    this.createSnapshot(title, true)
                }} type="browserOwned"/>
                <button className="btn btn-xs btn-primary" onClick={this.seizeAllSnapshots}
                        disabled={importAllIsDisabled} style={buttonStyle}>
                    <i className="material-icons">person_add</i>
                </button>
            </h4>);
        }

        return (<div>
            {overlay}
            <div>
                <div className="js-browser-owned">
                    <div className="form-group">{createNewSnapshotControl}</div>
                    <div>
                        <div>{browserOwnerSnapshots}</div>
                    </div>
                </div>
                {userOwnerSnapshotsPanel}
            </div>
        </div>);
    }
}

StateSnapshotsDashboard.defaultProps = {
    force: false,
    readOnly: false,
    playOnly: false,
    customSetOfTitles: false,
    showStateSnapshotTypes: true,
};

export default StateSnapshotsDashboard;
