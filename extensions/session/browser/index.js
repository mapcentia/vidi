/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2025 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

let utils;
let backboneEvents;
let layerTree;
let sessionInstance = false;
let userName = null;
let isStatusChecked = false;
let exId = `login-modal-body`;
const config = require('./../../../config/config.js');
const urlparser = require('./../../../browser/modules/urlparser');
const urlVars = urlparser.urlVars;
const cookie = require('js-cookie');
const React = require("react");

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {
    set: function (o) {
        utils = o.utils;
        backboneEvents = o.backboneEvents;
        layerTree = o.layerTree;
        return this;
    },
    init: function () {
        let parent = this;
        let React = require('react');
        let ReactDOM = require('react-dom');

        const modal = new bootstrap.Offcanvas('#login-modal');

        document.querySelector(".sign-in-btn")?.classList.remove("d-none");

        // Check if signed in
        //===================
        class Status extends React.Component {
            render() {
                return <h6>
                   <span className={"badge bg-" + this.props.alertClass + " text-nowrap"}>
                        {this.props.statusText}
                    </span>
                </h6>
            }
        }

        class Session extends React.Component {
            constructor(props) {
                super(props);

                this.state = {
                    sessionScreenName: "",
                    sessionPassword: "",
                    statusText: __("Type your user name and password"),
                    alertClass: "info",
                    btnText: __("Sign in"),
                    auth: false
                };

                this.validateForm = this.validateForm.bind(this);
                this.handleChange = this.handleChange.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);
            }

            validateForm() {
                return this.state.sessionScreenName.length > 0 && this.state.sessionPassword.length > 0 || this.state.auth;
            }

            handleChange(event) {
                this.setState({
                    [event.target.id]: event.target.value
                });
            }

            handleSubmit(event) {
                let me = this;
                event.preventDefault();
                if (!me.state.auth) {
                    let dataToAuthorizeWith = {
                        "user": me.state.sessionScreenName,
                        "password": me.state.sessionPassword,
                        "schema": "public"
                    };

                    if (vidiConfig.appDatabase) {
                        dataToAuthorizeWith.database = vidiConfig.appDatabase;
                    }

                    $.ajax({
                        dataType: 'json',
                        url: "/api/session/start",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        scriptCharset: "utf-8",
                        data: JSON.stringify(dataToAuthorizeWith),
                        success: function (data) {
                            backboneEvents.get().trigger(`session:authChange`, true);
                            me.setState({statusText: `Signed in as ${data.screen_name} (${data.email})`});
                            me.setState({alertClass: "success"});
                            me.setState({btnText: __("Sign out")});
                            me.setState({auth: true});
                            $(".gc2-session-lock").show();
                            $(".gc2-session-unlock").hide();
                            $(".gc2-session-btn-text").html(data.screen_name)
                            userName = data.screen_name;
                            parent.update();
                            // Close the off canvas
                            setTimeout(() => modal.hide(), 400);
                        },

                        error: function () {
                            me.setState({statusText: __("Wrong user name or password")});
                            me.setState({alertClass: "danger"});
                        }
                    });
                } else {
                    $.ajax({
                        dataType: 'json',
                        url: "/api/session/stop",
                        type: "GET",
                        success: function () {
                            backboneEvents.get().trigger(`session:authChange`, false);

                            me.setState({statusText: __("Not signed in")});
                            me.setState({alertClass: "info"});
                            me.setState({btnText: __("Sign in")});
                            me.setState({auth: false});
                            $(".gc2-session-lock").hide();
                            $(".gc2-session-unlock").show();
                            $(".gc2-session-btn-text").html(__("Sign in"))
                            userName = null;
                            parent.update();
                        },
                        error: function (error) {
                            console.error(error.responseJSON);
                        }
                    });
                }
            }

            componentDidMount() {
                let me = this;

                $.ajax({
                    dataType: 'json',
                    url: "/api/session/status",
                    type: "GET",
                    success: function (data) {
                        if (data.status.authenticated) {
                            backboneEvents.get().trigger(`session:authChange`, true);
                            me.setState({sessionScreenName: data.status.screen_name});
                            me.setState({statusText: `${__("Signed in as")} ${data.status.screen_name} (${data.status.email})`});
                            me.setState({alertClass: "success"});
                            me.setState({btnText: __("Sign out")});
                            me.setState({auth: true});
                            $(".gc2-session-lock").show();
                            $(".gc2-session-unlock").hide();
                            userName = data.status.screen_name;
                            $(".gc2-session-btn-text").html(userName);
                            // True if auto login happens. When reload meta
                            if (data?.screen_name && data?.status?.authenticated) {
                                // Wait for layer tree to be built before reloading
                                (function poll() {
                                    if (!layerTree.isBeingBuilt()) {
                                        backboneEvents.get().trigger("refresh:meta");
                                    } else {
                                        setTimeout(() => poll(), 100)
                                    }
                                }())
                            }
                        } else {
                            backboneEvents.get().trigger(`session:authChange`, false);

                            $(".gc2-session-lock").hide();
                            $(".gc2-session-unlock").show();
                        }
                        isStatusChecked = true;
                    },
                    error: function (error) {
                        console.error(error.responseJSON);
                    }
                });
            }

            authenticated() {
                return this.state.auth;
            }

            render() {
                return (
                    <div className="login">
                        <form onSubmit={this.handleSubmit}>
                            <Status statusText={this.state.statusText} alertClass={this.state.alertClass}/>
                            <div className="row g-3 align-items-center">
                                <div className="col-4"
                                     style={{
                                         display: this.state.auth ? 'none' : 'block',
                                         minWidth: '250px'
                                     }}>
                                    <input
                                        id="sessionScreenName"
                                        className="form-control"
                                        defaultValue={this.state.sessionScreenName}
                                        onChange={this.handleChange}
                                        placeholder={__("User name")}
                                    />
                                </div>
                                <div className="col-4"
                                     style={{
                                         display: this.state.auth ? 'none' : 'block',
                                         minWidth: '250px'
                                     }}>
                                    <input
                                        id="sessionPassword"
                                        className="form-control"
                                        defaultValue={this.state.sessionPassword}
                                        onChange={this.handleChange}
                                        type="password"
                                        placeholder={__("Password")}
                                    />
                                </div>
                                <div className="col-2">
                                    <button
                                        type="submit"
                                        disabled={!this.validateForm()}
                                        className="btn btn-outline-primary text-nowrap"
                                    >
                                        {this.state.btnText}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                );
            }
        }

        if (document.getElementById(exId)) {
            sessionInstance = ReactDOM.render(<Session/>, document.getElementById(exId));
        } else {
            console.warn(`Unable to find the container for session extension (element id: ${exId})`);
        }
    },

    isAuthenticated() {
        if (sessionInstance) {
            return sessionInstance.authenticated();
        } else {
            return false;
        }
    },

    update: function () {
        backboneEvents.get().trigger("refresh:auth");
        backboneEvents.get().trigger("refresh:meta");
    },

    getUserName: function () {
        return userName;
    },

    isStatusChecked: () => {
        return isStatusChecked;
    }

};

