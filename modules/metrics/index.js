/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const PrometheusBundle = require('express-prom-bundle');
const Prometheus = require('prom-client');
const config = require('../../config/config.js');
const collectors = require('./collectors');

/**
 * Initialize Prometheus metrics for the application
 * @param {Object} app - Express application instance
 */
function initializeMetrics(app) {
    if (!isEnabled()) {
        return;
    }

    // Initialize all metric collectors
    collectors.initializeCollectors();

    // Set up error metrics handlers
    setupErrorMetrics();

    // Initialize Prometheus metrics
    new Prometheus.AggregatorRegistry().setDefaultLabels({
        app: 'vidi',
        instance: process.env.HOSTNAME || 'localhost',
        version: config?.version || 'unknown',
    });

    // Register default metrics, and make sure to collect other endpoints
    const pathsToIgnore = [
        'favicon.ico',
        'images/',
        'css/',
        'js/',
        'node_modules/',
        'fonts/',
        'public/',
        'service-worker.bundle.js',
        'locale',
        '.well-known/appspecific/com.chrome.devtools.json',
        'icons/',
        //'connection-check.ico', - not this, we need it to track active maps
    ];
    
    const ignorestring = "/((?!(" + pathsToIgnore.map(path => path).join('|') + ")))*";
    app.use(ignorestring, PrometheusBundle({
        autoregister: false, // disable /metrics for single workers
        includeMethod: true,
        includePath: true,
        includeStatusCode: true,
        includeUp: false,
        httpDurationMetricName: 'vidi_http_request',
        normalizePath: [
            // Normalize app paths with database/schema parameters
            ['^/app/[^/]+/[^/]+.*', '/app/#db/#schema'],
            ['^/app/[^/]+.*', '/app/#db'],
            ['^/api/state-snapshots/[^/]+.*', '/api/state-snapshots/#db'],
            ['^/api/gc2/config/[^/]+.*', '/api/gc2/config/#config'],
            ['^/api/meta/[^/]+/[^/]+.*', '/api/meta/#db/#schema'],
            ['^/api/setting/[^/]+/[^/]+.*', '/api/setting/#db/#schema'],
            ['^/api/legend/[^/]+.*', '/api/legend/#db'],
            ['^/api/wms/[^/]+/[^/]+.*', '/api/wms/#db/#schema'],
            ['^/api/dataforsyningen/[^/]+.*', '/api/dataforsyningen/#param'],
            ['^/api/datafordeler/[^/]+.*', '/api/datafordeler/#param'],
            ['^/api/sql/nocache/[^/]+.*', '/api/sql/nocache/#db'],
            ['^/api/sql/[^/]+.*', '/api/sql/#db'],
            ['^/api/config/[^/]+.*', '/api/config/#db'],
            ['^/api/symbols/[^/]+.*', '/api/symbols/#param'],
            ['^/api/css/[^/]+.*', '/api/css/#param'],
            ['^/index.html', '/'],
            ['^/tmp/print/pdf/[^/]+.*', '/tmp/print/pdf/#param'],
            ['^/tmp/print/png/[^/]+.*', '/tmp/print/png/#param'],
            ['^/tmp/print/zip/[^/]+.*', '/tmp/print/zip/#param'],
        ],
    }));
}

/**
 * Start the metrics server for cluster metrics
 */
function startMetricsServer() {
    if (!isEnabled()) {
        return;
    }

    const metricsPort = config?.metrics?.port || 9100;
    const metricsApp = express();
    metricsApp.use('/metrics', PrometheusBundle.clusterMetrics());
    metricsApp.listen(metricsPort);
    console.log(`cluster metrics listening on ${metricsPort}`);
}

/**
 * Set up error metrics handlers
 */
function setupErrorMetrics() {
    if (!isEnabled()) {
        return;
    }

    const errorMetrics = collectors.getErrorMetrics();

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
        errorMetrics.uncaughtExceptions.inc({ 
            type: error.name || 'UnknownError', 
            origin: 'uncaughtException' 
        });
        console.error('Uncaught Exception:', error);
        // Don't exit the process, just log and count
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
        errorMetrics.uncaughtExceptions.inc({ 
            type: reason?.name || 'UnhandledRejection', 
            origin: 'unhandledRejection' 
        });
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });
}

/**
 * Set up socket.io error metrics
 * @param {Object} io - Socket.io server instance
 * @param {string} namespace - Socket namespace (optional)
 */
function setupSocketErrorMetrics(io, namespace = 'default') {
    if (!isEnabled()) {
        return;
    }

    const errorMetrics = collectors.getErrorMetrics();

    io.on('connection', (socket) => {
        socket.on('error', (error) => {
            errorMetrics.socketErrors.inc({ 
                event: 'connection_error', 
                namespace: namespace 
            });
            console.error('Socket.io connection error:', error);
        });

        socket.on('disconnect', (reason) => {
            if (reason === 'transport error' || reason === 'ping timeout') {
                errorMetrics.socketErrors.inc({ 
                    event: 'disconnect_error', 
                    namespace: namespace 
                });
                console.error('Socket.io disconnect error:', reason);
            }
        });
    });

    io.on('error', (error) => {
        errorMetrics.socketErrors.inc({ 
            event: 'server_error', 
            namespace: namespace 
        });
        console.error('Socket.io server error:', error);
    });
}

/**
 * Check if metrics are enabled
 * @returns {boolean} - Whether metrics are enabled
 */
function isEnabled() {
    return config?.metrics?.enabled === true;
}

module.exports = {
    initializeMetrics,
    startMetricsServer,
    setupSocketErrorMetrics,
    isEnabled,
    getSqlMetrics: collectors.getSqlMetrics,
    getWmsMetrics: collectors.getWmsMetrics,
    getPrintMetrics: collectors.getPrintMetrics,
    getErrorMetrics: collectors.getErrorMetrics
};
