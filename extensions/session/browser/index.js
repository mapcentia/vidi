/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

/**
 *
 * @type {*|exports|module.exports}
 */
var utils;

var jquery = require('jquery');
require('snackbarjs');


var exId = "session";

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {
    set: function (o) {
        utils = o.utils;
        return this;
    },
    init: function () {

        /**
         *
         */
        var React = require('react');

        /**
         *
         */
        var ReactDOM = require('react-dom');


        $('<li><a href="#" id="' + exId + '">Log in</a></li>').appendTo('#main-navbar');

        $("#" + exId).on("click", function () {
            $("#info-modal.slide-right").animate({
                right: "0"
            }, 200, function () {

                // Append to DOM
                //==============

                ReactDOM.render(
                    <Session />,
                    document.getElementById("info-modal-body-wrapper")
                );

            });
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
                    sessionEmail: "",
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
                return this.state.sessionEmail.length > 0 && this.state.sessionPassword.length > 0 || this.state.auth;
            }

            handleChange(event) {
                this.setState({
                    [event.target.id]: event.target.value
                });
            }

            handleSubmit(event) {
                console.log("submitting");

                var me = this;

                event.preventDefault();

                if (!me.state.auth) {
                    $.ajax({
                        dataType: 'json',
                        url: "/api/session/start",
                        type: "POST",
                        data: "u=" + me.state.sessionEmail + "&p=" + me.state.sessionPassword + "&s=public",
                        success: function (data) {
                            console.log(data);
                            me.setState({statusText: "Signed in as " + me.state.sessionEmail});
                            me.setState({alertClass: "alert-success"});
                            me.setState({btnText: "Log out"});
                            me.setState({auth: true});
                            setTimeout(function () {
                                $("#info-modal button.close").trigger("click");
                            }, 1000);
                        },
                        error: function (error) {
                            console.error(error.responseJSON);
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
                            console.log(data);
                            me.setState({statusText: "Not signed in"});
                            me.setState({alertClass: "alert-info"});
                            me.setState({btnText: "Sign in"});
                            me.setState({auth: false});
                            setTimeout(function () {
                               // $("#info-modal button.close").trigger("click");
                            }, 1000);
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
                        console.log(data);
                        if (data.status.authenticated) {
                            me.setState({sessionEmail: data.status.userName});
                            me.setState({statusText: "Signed in as " + me.state.sessionEmail});
                            me.setState({alertClass: "alert-success"});
                            me.setState({btnText: "Sign out"});
                            me.setState({auth: true});
                        }

                    },
                    error: function (error) {
                        console.error(error.responseJSON);

                    }

                });

            }

            render() {

                return (

                    <div style={this.padding}>

                        <Status statusText={this.state.statusText} alertClass={this.state.alertClass}/>

                        <div className="login">
                            <form onSubmit={this.handleSubmit}>

                                <div className="form-group">
                                    <label htmlFor="session-email">User name</label>
                                    <input
                                        id="sessionEmail"
                                        className="form-control"
                                        defaultValue={this.state.sessionEmail}
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

                    </div>


                );
            }
        }


    }
};


