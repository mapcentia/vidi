/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

/**
 *
 * @type {*|exports|module.exports}
 */
var cloud;

var backboneEvents;

var meta;

var layers;
var layerTree;
var switchLayer;

var utils;

var React = require('react');
var ReactDOM = require('react-dom');


var jquery = require('jquery');
require('snackbarjs');

var urlparser = require('./../../urlparser');

var db = urlparser.db;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        utils = o.utils;
        backboneEvents = o.backboneEvents;
        return this;
    },
    init: function () {
        utils.createMainTab("sharing", "Sharing", "fdff", require('./../../height')().max);
        ReactDOM.render(
            <Sharing />,
            document.getElementById('sharing')
        );
    }
};

/**
 *
  */
/*
class Sharing extends React.Component {
    constructor(props) {
        super(props);
    }

    handleTwitter(e) {
            var url = "sdsd";
            window.open("https://twitter.com/share?url=" + encodeURIComponent(url), '_blank', 'location=yes,height=300,width=520,scrollbars=yes,status=yes');
    }

    render() {
        return (
            <form className="form-horizontal" role="form">
                <div className="form-group">
                    <label className="col-sm-1 control-label"><i className="fa fa-share"></i></label>
                    <div className="col-sm-10">
                        <button onClick={this.handleTwitter} type="button" className="btn btn-default btn-share" data-toggle="tooltip" data-placement="bottom" title="Twitter"><i className="fa fa-twitter"></i></button>
                        <button type="button" className="btn btn-default btn-share" data-toggle="tooltip" data-placement="bottom" title="LinkedIn"><i className="fa fa-linkedin"></i></button>
                        <button type="button" className="btn btn-default btn-share" data-toggle="tooltip" data-placement="bottom" title="Google+"><i className="fa fa-google-plus"></i></button>
                        <button type="button" className="btn btn-default btn-share" data-toggle="tooltip" data-placement="bottom" title="Facebook"><i className="fa fa-facebook"></i></button>
                        <button type="button" className="btn btn-default btn-share" data-toggle="tooltip" data-placement="bottom" title="Tumblr"><i className="fa fa-tumblr"></i></button>
                    </div>
                </div>
            </form>
        );
    }
}*/
