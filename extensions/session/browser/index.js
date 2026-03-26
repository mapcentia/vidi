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
let properties = null;
let isStatusChecked = false;
let anchor;
let exId = `login-modal-body`;
const React = require("react");
const {createRoot} = require("react-dom/client");
let authWin;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {
    set: function (o) {
        let parent = this;
        utils = o.utils;
        backboneEvents = o.backboneEvents;
        layerTree = o.layerTree;
        anchor = o.anchor;
        window.addEventListener("message", (event) => {
            if (event.data.type === 'gc2-auth-complete') {
                const data = event.data.data;
                backboneEvents.get().trigger(`session:authChange`, true);
                if (sessionInstance) {
                    sessionInstance.setState({
                        statusText: `${__("Signed in as")} ${data.screen_name} (${data.email})`,
                        alertClass: "success",
                        btnText: __("Sign out"),
                        auth: true
                    });
                }
                $(".gc2-session-lock").show();
                $(".gc2-session-unlock").hide();
                $(".gc2-session-btn-text").html(data.screen_name)
                userName = data.screen_name;
                properties = data.properties;
                parent.update();
                if (authWin) {
                    authWin.close();
                }
            }
        });
        return this;
    },
    init: function () {
        let parent = this;
        let React = require('react');
        let modal;
        try {
            modal = new bootstrap.Offcanvas('#login-modal');
            document.querySelector(".sign-in-btn")?.classList.remove("d-none");
        } catch (e) {
            console.warn("Login modal is not initialized.")
        }


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
                    authWin = utils.popupCenter("/openid.html", 600, 800, "Sign in");
                } else {
                    $.ajax({
                        dataType: 'json',
                        url: "/api/session/stop",
                        type: "GET",
                        success: function () {
                            localStorage.removeItem('gc2_tokens')

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
                            authWin = utils.popupCenter(window.gc2Options.host + '/signout?redirect_uri=' + decodeURIComponent( window.location.origin + '/openid.html'), 600, 800, "Sign out");
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
                            properties = data.status.properties;
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
                                <div className="col-2">
                                    <button
                                        type="submit"
                                        // disabled={!this.validateForm()}
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
            createRoot(document.getElementById(exId)).render(<Session
                ref={instance => { sessionInstance = instance }}
            />)
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

    isAuthenticatedPromise: function () {
        return new Promise((resolve, reject) => {
            fetch("/api/session/status").then(response => {
                response.json().then(data => {
                    if (data.status.authenticated) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
            })
        })
    },


    update: function () {
        backboneEvents.get().trigger("refresh:auth");
        backboneEvents.get().trigger("refresh:meta");
    },

    getUserName: function () {
        return userName;
    },

    getProperties: function () {
        return properties;
    },

    isStatusChecked: () => {
        return isStatusChecked;
    }

};

