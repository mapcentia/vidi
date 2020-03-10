/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

/**
 *
 * @type {*|exports|module.exports}
 */
var utils;

var backboneEvents;
var sessionInstance = false;


var exId = `login-modal-body`;
var autoLogin = false; // Auto login is insecure and sets cookie with login creds.
var autoLoginMaxAge = null;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {
    set: function (o) {
        utils = o.utils;
        backboneEvents = o.backboneEvents;
        return this;
    },
    init: function () {

        var parent = this;

        /**
         *
         */
        var React = require('react');

        /**
         *
         */
        var ReactDOM = require('react-dom');

        if (typeof config.extensionConfig !== "undefined" && typeof config.extensionConfig.session !== "undefined") {
            if (typeof config.extensionConfig.session.autoLogin !== "undefined") {
                autoLogin = config.extensionConfig.session.autoLogin;
            }
            if (typeof config.extensionConfig.session.autoLoginMaxAge !== "undefined") {
                autoLoginMaxAge = config.extensionConfig.session.autoLoginMaxAge;
            }
        }

        // Check if signed in
        // sign in if autoLogin is set to true
        //===================

        $.ajax({
            dataType: 'json',
            url: "/api/session/status",
            type: "GET",
            data: "autoLogin=" + autoLogin + "&autoLoginMaxAge=" + autoLoginMaxAge,
            scriptCharset: "utf-8",
            success: function (data) {
                if (data.status.authenticated) {
                    
                    // inserted by LKM
                    //parent.update();
                    
                    //parent.update();
                    backboneEvents.get().trigger(`refresh:auth`);
                    backboneEvents.get().trigger(`session:authChange`, true);
                    $(".gc2-session-lock").show();
                    $(".gc2-session-unlock").hide();
                } else {
                    backboneEvents.get().trigger(`session:authChange`, false);
                    $(".gc2-session-lock").hide();
                    $(".gc2-session-unlock").show();
                }
            },
            error: function (error) {
                console.error(error.responseJSON);
            }
        });

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
                    statusText: "Type your user name and password",
                    alertClass: "alert-info",
                    btnText: "Sign in",
                    auth: false
                };

                this.validateForm = this.validateForm.bind(this);
                this.handleChange = this.handleChange.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);

                this.padding = {
                    padding: "12px"
                };
                this.sessionLoginBtn = {
                    width: "100%"
                };

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
                    let dataToAuthorizeWith = "u=" + me.state.sessionScreenName + "&p=" + me.state.sessionPassword + "&s=public";
                    if (vidiConfig.appDatabase) {
                        dataToAuthorizeWith += "&d=" + vidiConfig.appDatabase;
                    }

                    $.ajax({
                        dataType: 'json',
                        url: "/api/session/start",
                        type: "POST",
                        data: dataToAuthorizeWith,
                        success: function (data) {
                            backboneEvents.get().trigger(`session:authChange`, true);
                            me.setState({statusText: `Signed in as ${data.screen_name} (${data.email})`});
                            me.setState({alertClass: "alert-success"});
                            me.setState({btnText: "Log out"});
                            me.setState({auth: true});
                            $(".gc2-session-lock").show();
                            $(".gc2-session-unlock").hide();
                            parent.update();
                        },

                        error: function (error) {
                            me.setState({statusText: "Wrong user name or password"});
                            me.setState({alertClass: "alert-danger"});
                        }
                    });
                } else {
                    $.ajax({
                        dataType: 'json',
                        url: "/api/session/stop",
                        type: "GET",
                        success: function (data) {
                            backboneEvents.get().trigger(`session:authChange`, false);

                            me.setState({statusText: "Not signed in"});
                            me.setState({alertClass: "alert-info"});
                            me.setState({btnText: "Sign in"});
                            me.setState({auth: false});
                            $(".gc2-session-lock").hide();
                            $(".gc2-session-unlock").show();
                            parent.update();
                        },
                        error: function (error) {
                            console.error(error.responseJSON);
                        }
                    });
                }
            }

            componentDidMount() {
                var me = this;

                $.ajax({
                    dataType: 'json',
                    url: "/api/session/status",
                    type: "GET",
                    success: function (data) {
                        if (data.status.authenticated) {                            
                            backboneEvents.get().trigger(`session:authChange`, true);

                            me.setState({sessionScreenName: data.status.screen_name});
                            me.setState({statusText: `Signed in as ${data.status.screen_name} (${data.status.email})`});
                            me.setState({alertClass: "alert-success"});
                            me.setState({btnText: "Sign out"});
                            me.setState({auth: true});
                            $(".gc2-session-lock").show();
                            $(".gc2-session-unlock").hide();
                        } else {
                            backboneEvents.get().trigger(`session:authChange`, false);

                            $(".gc2-session-lock").hide();
                            $(".gc2-session-unlock").show();
                        }

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
                return (<div style={this.padding}>
                    <Status statusText={this.state.statusText} alertClass={this.state.alertClass}/>
                    <div className="login">
                        <form onSubmit={this.handleSubmit}>
                            <div style={{display: this.state.auth ? 'none' : 'inline'}}>
                                <div className="form-group">
                                    <label htmlFor="session-email">User name</label>
                                    <input
                                        id="sessionScreenName"
                                        className="form-control"
                                        defaultValue={this.state.sessionScreenName}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="session-password">Password</label>
                                    <input
                                        id="sessionPassword"
                                        className="form-control"
                                        defaultValue={this.state.sessionPassword}
                                        onChange={this.handleChange}
                                        type="password"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={!this.validateForm()}
                                className="btn btn-raised"
                                style={this.sessionLoginBtn}
                            >
                                {this.state.btnText}
                            </button>
                        </form>
                    </div>
                </div>);
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
    }
};

