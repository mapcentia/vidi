/**
 * State snapshots manager
 * 
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

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
 * @type {*|exports|module.exports}
 */
var urlparser;

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
        cloud = o.cloud;
        urlparser = o.urlparser;
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
                    remoteSnapshots: []
                };

                //this.setExtent = this.setExtent.bind(this);
            }

            /**
             *
             */
            componentDidMount() {
                let _self = this;
                setTimeout(() => {
                    let date = new Date('10-4-2018');
                    this.setState({
                        localSnapshots: [{
                            id: `p08rjw3mj2m05d75z9z0`,
                            created_at: date.toISOString()
                        }, {
                            id: `pb018r5cvwxnsumwv8zb`,
                            created_at: date.toISOString()
                        }],
                        remoteSnapshots: [{
                            id: `i4fq3gwj1kevdau2lxnj`,
                            created_at: date.toISOString()
                        }, {
                            id: `vot9ag2gix9lwkn0dht8`,
                            created_at: date.toISOString()
                        }]

                    });
                }, 1000);
            }

            /**
             *
             */
            componentWillUnmount() {
            }

            /**
             *
             * @returns {XML}
             */
            render() {
                let snapshotIdStyle = {
                    fontFamily: `"Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace`
                };

                let snapshotRecordRecordStyle = {
                    padding: '4px',
                    marginBottom: '4px',
                    border: '1px solid grey'
                };

                const drawSnapshotRecord = (item, index) => {
                    let date = new Date(item.created_at.toString());
                    let dateFormatted = (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear();
                    return (<div className="panel panel-default" key={index} style={{marginBottom: '8px'}}>
                        <div className="panel-body" style={{padding: '5px'}}>
                            <span style={snapshotIdStyle}>{item.id}</span> {item.created_at}
                        </div>
                    </div>);
                };

                let localSnapshots = (<div><p>{__(`No snapshots`)}</p><p>{__(`Create one`)}?</p></div>);
                if (this.state.localSnapshots && this.state.localSnapshots.length > 0) {
                    localSnapshots = [];
                    this.state.localSnapshots.map((item, index) => {
                        localSnapshots.push(drawSnapshotRecord(item, index));
                    });
                }

                let remoteSnapshots = (<div><p>{__(`No snapshots`)}</p><p>{__(`Create one`)}?</p></div>);
                if (this.state.remoteSnapshots && this.state.remoteSnapshots.length > 0) {
                    remoteSnapshots = [];
                    this.state.remoteSnapshots.map((item, index) => {
                        remoteSnapshots.push(drawSnapshotRecord(item, index));
                    });
                }

                return (<div>
                    <div>
                        <div>
                            <h4>
                                {__(`Local snapshots`)} 
                                <button className="btn btn-xs btn-primary">
                                    <i className="material-icons">add</i>
                                </button>
                                <button className="btn btn-xs btn-primary">
                                    <i className="material-icons">save</i>
                                </button>
                            </h4>
                        </div>
                        <div>
                            <div>{localSnapshots}</div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <h4>
                                {__(`Remote snapshots`)}
                                <button className="btn btn-xs btn-primary">
                                    <i className="material-icons">add</i>
                                </button>
                            </h4>
                        </div>
                        <div>
                            <div>{remoteSnapshots}</div>
                        </div>
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

};