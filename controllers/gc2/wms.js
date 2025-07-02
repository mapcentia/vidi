/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2022 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const router = express.Router();
const config = require('../../config/config.js').gc2;
const metrics = require('../../modules/metrics');
const request = require('request');

const proxifyRequest = (req, response) => {
    // Get WMS metrics if enabled
    const wmsMetrics = metrics.isEnabled() ? metrics.getWmsMetrics() : null;
    
    // Start timing the request
    let endTimer;
    if (wmsMetrics) {
        endTimer = wmsMetrics.duration.startTimer();
    }
    
    // Track response size
    let responseSize = 0;
    
    // Determine request type (WMS, mapcache, gmaps)
    const requestType = req.url.includes('/mapcache/') ? 
        (req.url.includes('/gmaps/') ? 'gmaps' : 'mapcache') : 'wms';
    
    // Get db from params
    const db = req.params.db;
    
    let requestURL = config.host + encodeURI(decodeURIComponent(req.url.substr(4)));

    // Rewrite URL in case of subUser
    if (req?.session?.subUser && !req.url.includes('/mapcache/')) {
        requestURL = requestURL.replace(`/${req.session.parentDb}/`, `/${req.session.screenName}@${req.session.parentDb}/`);
    }

    let options = {
        method: 'GET',
        uri: requestURL
    };

    if (req?.session?.gc2SessionId) {
        options.headers = {Cookie: "PHPSESSID=" + req.session.gc2SessionId + ";"}
    }

    const wmsRequest = request(options);
    
    wmsRequest.on('response', function(res) {
        // Track request status in the counter
        if (wmsMetrics) {
            wmsMetrics.counter.inc({
                db: db,
                request_type: requestType,
                status: res.statusCode >= 400 ? 'error' : 'success'
            });
        }
    });
    
    wmsRequest.on('data', function(chunk) {
        responseSize += chunk.length;
    });
    
    wmsRequest.on('end', function() {
        // End timer and record duration with labels
        if (wmsMetrics) {
            endTimer({ db: db, request_type: requestType });
            
            // Record response size
            wmsMetrics.responseSize.observe({ db: db, request_type: requestType }, responseSize);
        }
    });
    
    wmsRequest.pipe(response);
};

router.all('/api/wms/:db/:schema', proxifyRequest);
router.all('/api/mapcache/:db/wms', proxifyRequest);
router.all('/api/mapcache/:db/gmaps/*', proxifyRequest);

module.exports = router;
