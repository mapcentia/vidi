var express = require('express');
var request = require("request");
var router = express.Router();
var http = require('http');
var fs = require('fs');
var moment = require('moment');
var config = require('../../../config/config.js');
var session = require ('../../session/server');

/**
*
* @type {string}
*/
var GC2_HOST = config.gc2.host;
GC2_HOST = (GC2_HOST.split("http://").length > 1 ? GC2_HOST.split("http://")[1] : GC2_HOST);

// Set locale for date/time string
moment.locale("da_DK");

var BACKEND = config.backend;


/**
 * Endpoint for getting 
 */
router.post('/api/extension/documentCreateSendFeature', function (req, response) {
    //inject into db then
    //send the stuff to docunote

    
    response.send(req.message)
    return;
});

router.get('/api/extension/documentCreategetExistingDocsPos', function (req, response) {
    //Based on key, return centrepoint for features on selected layers that match query
    //alternatively zoom to layer in client
    //Returns lat/lng to zoom to
    response.send(req.message)
    return;
});

    /**
    //This sent things to GC2
    jquery.ajax({
        url: gc2host+'/api/v2/feature/'+config.extensionConfig.documentCreate.GC2user+'@'+urlparser.db+'/'+urlparser.schema+'.'+tablename+'.'+metaDataKeys[urlparser.schema+'.'+tablename].f_geometry_column+'/4326',
        dataType: 'json',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify(feature),
        headers: {
            'GC2-API-KEY': config.extensionConfig.documentCreate.GC2key,
            'X-Alt-Referer': gc2host
        },
        success: function( data, textStatus, jQxhr ){
            jquery.snackbar({
                htmlAllowed: true,
                content: '<p>'+__("GC2 Success")+'</p>',
                timeout: 1000000
            });
            console.log( jQxhr )
        },
        error: function( jqXhr, textStatus, errorThrown ){
            jquery.snackbar({
                htmlAllowed: true,
                content: '<p>'+__("GC2 Error")+': '+jqXhr.responseJSON.message+'</p>',
                timeout: 1000000
            });
            console.log( jqXhr );
        }

    });
    */



module.exports = router;