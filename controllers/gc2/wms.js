/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2022 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const router = express.Router();
const config = require('../../config/config.js').gc2;
const request = require('request');
const Prometheus = require('prom-client');

// Initialize Prometheus metrics
const wmsRequestCounter = new Prometheus.Counter({
    name: 'vidi_controllers_gc2_wms_requests_total',
    help: 'Total number of WMS requests processed',
    labelNames: ['db', 'request_type', 'status']
});

const wmsRequestDuration = new Prometheus.Histogram({
    name: 'vidi_controllers_gc2_wms_request_duration_seconds',
    help: 'Duration of WMS requests in seconds',
    labelNames: ['db', 'request_type'],
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60]
});

const wmsResponseSize = new Prometheus.Histogram({
    name: 'vidi_controllers_gc2_wms_response_size_bytes',
    help: 'Size of WMS responses in bytes',
    labelNames: ['db', 'request_type'],
    buckets: [1000, 10000, 100000, 1000000, 10000000, 100000000]
});

const proxifyRequest = (req, response) => {
    // Start timing the request
    const endTimer = wmsRequestDuration.startTimer();
    
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
        wmsRequestCounter.inc({
            db: db,
            request_type: requestType,
            status: res.statusCode >= 400 ? 'error' : 'success'
        });
    });
    
    wmsRequest.on('data', function(chunk) {
        responseSize += chunk.length;
    });
    
    wmsRequest.on('end', function() {
        // End timer and record duration with labels
        endTimer({ db: db, request_type: requestType });
        
        // Record response size
        wmsResponseSize.observe({ db: db, request_type: requestType }, responseSize);
    });
    
    wmsRequest.pipe(response);
};

router.all('/api/wms/:db/:schema', proxifyRequest);
router.all('/api/mapcache/:db/wms', proxifyRequest);
router.all('/api/mapcache/:db/gmaps/*', proxifyRequest);

module.exports = router;
