/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const Prometheus = require('prom-client');

// SQL Query Metrics
let sqlQueryCounter, sqlQueryDuration, sqlResponseSize;

// WMS Request Metrics
let wmsRequestCounter, wmsRequestDuration, wmsResponseSize;

// Print Request Metrics
let printCounter, printDurationHistogram;

// Set common bucket sizes for histograms
const secondsBuckets = [0.1, 0.5, 1, 2, 5, 10, 30, 60, 120, 240];
const bytesBuckets = [1000, 10000, 100000, 1000000, 10000000, 100000000];

/**
 * Initialize all Prometheus metrics collectors
 */
function initializeCollectors() {
    // SQL Query Metrics
    sqlQueryCounter = new Prometheus.Counter({
        name: 'vidi_controllers_gc2_sql_queries_total',
        help: 'Total number of SQL queries processed',
        labelNames: ['db', 'format', 'status']
    });

    sqlQueryDuration = new Prometheus.Histogram({
        name: 'vidi_controllers_gc2_sql_query_duration_seconds',
        help: 'Duration of SQL queries in seconds',
        labelNames: ['db', 'format'],
        buckets: secondsBuckets
    });

    sqlResponseSize = new Prometheus.Histogram({
        name: 'vidi_controllers_gc2_sql_response_size_bytes',
        help: 'Size of SQL query responses in bytes',
        labelNames: ['db', 'format'],
        buckets: bytesBuckets
    });

    // WMS Request Metrics
    wmsRequestCounter = new Prometheus.Counter({
        name: 'vidi_controllers_gc2_wms_requests_total',
        help: 'Total number of WMS requests processed',
        labelNames: ['db', 'request_type', 'status']
    });

    wmsRequestDuration = new Prometheus.Histogram({
        name: 'vidi_controllers_gc2_wms_request_duration_seconds',
        help: 'Duration of WMS requests in seconds',
        labelNames: ['db', 'request_type'],
        buckets: secondsBuckets
    });

    wmsResponseSize = new Prometheus.Histogram({
        name: 'vidi_controllers_gc2_wms_response_size_bytes',
        help: 'Size of WMS responses in bytes',
        labelNames: ['db', 'request_type'],
        buckets: bytesBuckets
    });

    // Print Request Metrics
    printCounter = new Prometheus.Counter({
        name: 'vidi_controllers_print_print_requests_total',
        help: 'Total number of print requests processed',
        labelNames: ['scale', 'format', 'status', 'template', 'db']
    });

    printDurationHistogram = new Prometheus.Histogram({
        name: 'vidi_controllers_print_duration_seconds',
        help: 'Duration of print operations in seconds',
        labelNames: ['format', 'template', 'db', 'scale'],
        buckets: secondsBuckets
    });
}

/**
 * Get SQL metrics collectors
 * @returns {Object} SQL metrics objects
 */
function getSqlMetrics() {
    return {
        counter: sqlQueryCounter,
        duration: sqlQueryDuration,
        responseSize: sqlResponseSize
    };
}

/**
 * Get WMS metrics collectors
 * @returns {Object} WMS metrics objects
 */
function getWmsMetrics() {
    return {
        counter: wmsRequestCounter,
        duration: wmsRequestDuration,
        responseSize: wmsResponseSize
    };
}

/**
 * Get Print metrics collectors
 * @returns {Object} Print metrics objects
 */
function getPrintMetrics() {
    return {
        counter: printCounter,
        duration: printDurationHistogram
    };
}

module.exports = {
    initializeCollectors,
    getSqlMetrics,
    getWmsMetrics,
    getPrintMetrics
};
