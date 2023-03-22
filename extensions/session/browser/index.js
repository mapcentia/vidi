/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2021 MapCentia ApS
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

        if (typeof urlVars.session === "string") {
            const MAXAGE = (config.sessionMaxAge || 86400) / 86400; // In days
            // Try to remove existing cookie
            document.cookie = 'connect.gc2=; Max-Age=0; path=/; domain=' + location.host;
            cookie.set("connect.gc2", urlVars.session, {expires: MAXAGE});
        }

        // Check if signed in
        //===================
        class Status extends React.Component {
            render() {
                return <div className={"alert alert-dismissible " + this.props.alertClass} role="alert">
                    {this.props.statusText}
                </div>
            }
        }

        class Session extends React.Component {
            constructor(props) {
                super(props);

                this.state = {
                    sessionScreenName: "",
                    sessionPassword: "",
                    statusText: __("Type your user name and password"),
                    alertClass: "alert-info",
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
                            me.setState({alertClass: "alert-success"});
                            me.setState({btnText: __("Sign out")});
                            me.setState({auth: true});
                            $(".gc2-session-lock").show();
                            $(".gc2-session-unlock").hide();
                            $(".gc2-session-btn-text").html(data.screen_name)
                            userName = data.screen_name;
                            parent.update();
                        },

                        error: function () {
                            me.setState({statusText: __("Wrong user name or password")});
                            me.setState({alertClass: "alert-danger"});
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
                            me.setState({alertClass: "alert-info"});
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
                            me.setState({alertClass: "alert-success"});
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
                    <div className="w-100 d-flex justify-content-center">
                        <div className="w-100" style={{maxWidth: "650px"}}>
                            <Status statusText={this.state.statusText} alertClass={this.state.alertClass}/>
                            <div className="login">
                                <form onSubmit={this.handleSubmit}>
                                    <div style={{display: this.state.auth ? 'none' : 'inline'}}>
                                        <div className="form-floating mb-3">
                                            <input
                                                id="sessionScreenName"
                                                className="form-control"
                                                defaultValue={this.state.sessionScreenName}
                                                onChange={this.handleChange}
                                                placeholder={__("User name")}
                                            />
                                            <label htmlFor="sessionScreenName">{__("User name")}</label>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input
                                                id="sessionPassword"
                                                className="form-control"
                                                defaultValue={this.state.sessionPassword}
                                                onChange={this.handleChange}
                                                type="password"
                                                placeholder={__("Password")}
                                            />
                                            <label htmlFor="sessionPassword">{__("Password")}</label>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!this.validateForm()}
                                        className="btn btn-outline-primary w-100"
                                    >
                                        {this.state.btnText}
                                    </button>
                                </form>
                            </div>
                        </div>
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

