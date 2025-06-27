/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2021 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

require('dotenv').config();

const express = require('express');
const router = express.Router();
const fs = require('fs');
const headless = require('./headlessBrowserPool').pool;
const shared = require('./gc2/shared');
const request = require('request');
const PDFMerge = require('pdf-merge');
const AdmZip = require('adm-zip');
const config = require("../config/config.js");

const timeout = config?.print?.timeout || 60000; // 60 seconds

Prometheus = require('prom-client');

// Initialize Prometheus metrics
const printCounter = new Prometheus.Counter({
    name: 'vidi_controllers_print_print_requests_total',
    help: 'Total number of print requests processed',
    labelNames: ['scale', 'format', 'status', 'template', 'db']
});

// Initialize Prometheus histogram for print duration tracking
const printDurationHistogram = new Prometheus.Histogram({
    name: 'vidi_controllers_print_duration_seconds',
    help: 'Duration of print operations in seconds',
    labelNames: ['format', 'template', 'db', 'scale'],
    buckets: [0.1, 0.5, 1, 2, 5, 10, 20, 30, 60, 120] // Buckets in seconds
});


/**
 *
 * @type {module.exports.print|{templates, scales}}
 */
router.post('/api/print', function (req, response) {
        req.setTimeout(0); // no timeout
        let body = req.body;
        let outputPng = body.png === true; // Should format be PNG?
        let returnImage = body.image === undefined ? true : body.image !== false; // Should return image if PNG is requested?
        let count = {"n": 0}; // Must be passed as copy of a reference
        let files = [];
        
        // Increment print counter with appropriate labels
        const format = outputPng ? 'png' : 'pdf';
        const scale = body.scale || 'unknown';
        const template = body.tmpl || 'default';
        const db = body.db || 'unknown';
        printCounter.inc({ scale, format, status: 'requested', template, db });
        
        let poll = () => {
            setTimeout(() => {
                if (count.n === body.bounds.length) {
                    console.log("Done All. Merging...");
                    let key = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                    if (!outputPng) {
                        PDFMerge(files, {output: `${__dirname}/../public/tmp/print/pdf/${key}.pdf`})
                            .then(() => {
                                // Increment print counter with successful status
                                const scale = q.scale || 'unknown';
                                const template = q.tmpl || 'default';
                                const db = q.db || 'unknown';
                                printCounter.inc({ scale, format: 'pdf', status: 'success', template, db });
                                response.send({success: true, key, "format": "pdf"});
                            });
                    } else {
                        const zip = new AdmZip("");
                        files.forEach(path => {
                            zip.addLocalFile(path);
                        });
                        zip.writeZip(`${__dirname}/../public/tmp/print/png/${key}.zip`);
                        // Increment print counter with successful status
                        const scale = q.scale || 'unknown';
                        const template = q.tmpl || 'default';
                        const db = q.db || 'unknown';
                        printCounter.inc({ scale, format: 'zip', status: 'success', template, db });
                        response.send({success: true, key, "format": "zip"});
                    }
                } else {
                    poll();
                }
            }, 1000)
        }
        if (body.bounds.length > 1) {
            poll()
        }
        for (let i = 0; i < body.bounds.length; i++) {
            let key = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            if (!outputPng) {
                files.push(`${__dirname}/../public/tmp/print/pdf/${key}.pdf`);
            } else {
                files.push(`${__dirname}/../public/tmp/print/png/${key}.png`);
            }
            print(key, body, req, response, outputPng, i, count, returnImage, body.bounds.length);
        }
    }
);

router.get('/api/print/:database', function (req, res) {
    const port = process.env.PORT ? process.env.PORT : 3000;
    let uri = "http://127.0.0.1:" + port + '/api/state-snapshots/' + req.params.database + '/' + req.query.state;
    
    // Increment print counter for database endpoint request
    const format = 'png'; // This endpoint always uses PNG
    const scale = req.query.scale || 'unknown';
    const template = req.query.tmpl || 'default';
    const db = req.params.database || 'unknown';
    printCounter.inc({ scale, format, status: 'requested', template, db });
    
    request({
        method: 'GET',
        encoding: 'utf8',
        uri: uri
    }, (error, response) => {
        if (error) {
            shared.throwError(res, 'INVALID_OR_EMPTY_EXTERNAL_API_REPLY', {error});
            return;
        }
        try {
            let parsedBody = JSON.parse(response.body);
            if (!'print' in parsedBody.snapshot.modules) {
                shared.throwError(res, 'NO_PRINT_IN_SNAPSHOT');
            }
            let key = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            // We need to set add necessary modules for printing
            parsedBody.snapshot.modules.print.state = {"modules": {"layerTree": parsedBody.snapshot.modules.layerTree}};
            return print(key, parsedBody.snapshot.modules.print, req, res, true);
        } catch (e) {
            console.log(e.message)
        }
    })
});

router.get('/api/postdata', function (req, response) {
    let key = req.query.k;
    fs.readFile(__dirname + "/../public/tmp/print/json/" + key, 'utf8', function (err, data) {
        if (err) {
            response.send({success: true, error: err});
            return;
        }

        response.send({success: true, data: JSON.parse(data)});
    });
});

function print(key, q, req, response, outputPng = false, frame = 0, count, returnImage = true, numberOfFrames) {
    // Start timer for tracking print duration
    const printTimer = printDurationHistogram.startTimer({
        format: outputPng ? 'png' : 'pdf',
        template: q.tmpl || 'default',
        db: q.db || 'unknown',
        scale: q.scale || 'unknown'
    });
    
    fs.writeFile(__dirname + "/../public/tmp/print/json/" + key, JSON.stringify(q), async (err) => {
        if (err) {
            // Stop timer for file write error
            printTimer();
            response.send({success: true, error: err});
            return;
        }

        /*
        // Randomly send an error - for testing
        if (Math.random() > 0.5) {
            // Stop timer for random error
            printTimer();
            response.status(500).send({
                success: false
            });
            return;
        }
        */

        const margin = q.tmpl === "_conflictPrint" ? {left: '0.4cm', top: '1cm', right: '0.4cm', bottom: '1cm'} : 0;
        const port = process.env.PORT ? process.env.PORT : 3000;
        let uri = '/app/' + q.db + '/' + q.schema + '/' + (q.queryString !== "" ? q.queryString : "?") + '&frame=' + frame + '&frameN=' + numberOfFrames + '&session=' + (typeof req.cookies["connect.gc2"] !== "undefined" ? encodeURIComponent(req.cookies["connect.gc2"]) : "") + '&tmpl=' + q.tmpl + '.tmpl&l=' + q.legend + '&h=' + q.header + '&px=' + q.px + '&py=' + q.py + '&td=' + q.dateTime + '&d=' + q.date + '&k=' + key + '&t=' + q.title + '&c=' + q.comment + q.anchor;
        let url = "http://127.0.0.1:" + port + uri;
        console.log(`Printing ` + url);

        let check = false;
        let delay = 1000;
        const func = () => {
            headless.acquire().then(browser => {
                    setTimeout(() => {
                        if (headless.isBorrowedResource(browser)) {
                            headless.destroy(browser);
                            console.log("Destroying browser after timeout " + timeout);
                        }
                    }, timeout);
                    if (!outputPng) {
                        browser.newPage().then(async (page) => {
                            await page.emulateMedia('screen');
                            page.on('console', async msg => {

                                // Log error description
                                const args = await msg.args()
                                for (const arg of args) {
                                    const val = await arg.jsonValue()
                                    // value is serializable
                                    if (JSON.stringify(val) === JSON.stringify({}))  {
                                        const { type, subtype, description } = arg._remoteObject
                                        console.log(`type: ${type}, subtype: ${subtype}, description:\n ${description}`)
                                    }
                                }

                                console.log(msg.text());
                                if (msg.text().indexOf(`Vidi is now loaded`) !== -1) {
                                    if (!check) {
                                        check = true;
                                        console.log('App was loaded, generating PDF');
                                        setTimeout(() => {
                                            page.pdf({
                                                path: `${__dirname}/../public/tmp/print/pdf/${key}.pdf`,
                                                landscape: (q.orientation === 'l'),
                                                format: q.pageSize,
                                                printBackground: true,
                                                margin: margin
                                            }).then(() => {
                                                    console.log('Done #', count.n);
                                                    if (q.bounds.length === 1) { // Only one page. No need to merge
                                                        console.log('Only one page. No need to merge.');
                                                        // Increment print counter for successful single page PDF
                                                        const scale = q.scale || 'unknown';
                                                        const template = q.tmpl || 'default';
                                                        const db = q.db || 'unknown';
                                                        printCounter.inc({ scale, format: 'pdf', status: 'success', template, db });
                                                        response.send({success: true, key, uri, "format": "pdf"});
                                                    }
                                                    // Stop timer for PDF success
                                                    printTimer();
                                                    headless.destroy(browser);
                                                    count.n++;
                                                }
                                            ).catch(() => {
                                                    console.log('Error while creating PDF');
                                                    // Increment print counter for failed PDF
                                                    const scale = q.scale || 'unknown';
                                                    const template = q.tmpl || 'default';
                                                    const db = q.db || 'unknown';
                                                    printCounter.inc({ scale, format: 'pdf', status: 'error', template, db });
                                                    // Stop timer for PDF error
                                                    printTimer();
                                                    headless.destroy(browser);
                                                    response.status(500).send({
                                                        success: false
                                                    });
                                                }
                                            );
                                        }, delay);
                                    }
                                }
                            });
                            await page.goto(url);
                        }).catch(() => {
                            console.log('Error while creating PDF');
                            // Stop timer for PDF error
                            printTimer();
                            headless.destroy(browser);
                            response.status(500).send({
                                success: false
                            });
                        });
                    } else {
                        let width, height;
                        browser.newPage().then(page => {
                            const check = async () => {
                                const isWebGLSupported = await page.evaluate(() => {
                                    const canvas = document.createElement('canvas');
                                    return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
                                });

                                if (!isWebGLSupported) {
                                    console.error('WebGL is not supported in this environment.');
                                }
                            }
                            //check();

                            const pxWidth = 795;
                            const pxHeight = 1125;
                            switch (q.pageSize) {
                                case "A4":
                                    switch (q.orientation) {
                                        case "p":
                                            width = pxWidth;
                                            height = pxHeight;
                                            break;
                                        case "l":
                                            width = pxHeight;
                                            height = pxWidth;
                                            break;
                                    }
                                    break;
                                case "A3":
                                    switch (q.orientation) {
                                        case "p":
                                            width = pxWidth * 1.5;
                                            height = pxHeight * 1.5;
                                            break;
                                        case "l":
                                            width = pxHeight * 1.5;
                                            height = pxWidth * 1.5;
                                            break;
                                    }
                                    break;
                                case "A2":
                                    switch (q.orientation) {
                                        case "p":
                                            width = pxWidth * 2;
                                            height = pxHeight * 2;
                                            break;
                                        case "l":
                                            width = pxHeight * 2;
                                            height = pxWidth * 2;
                                            break;
                                    }
                                    break;
                                case "A1":
                                    switch (q.orientation) {
                                        case "p":
                                            width = pxWidth * 2.5;
                                            height = pxHeight * 2.5;
                                            break;
                                        case "l":
                                            width = pxHeight * 2.5;
                                            height = pxWidth * 2.5;
                                            break;
                                    }
                                    break;
                                case "A0":
                                    switch (q.orientation) {
                                        case "p":
                                            width = pxWidth * 3;
                                            height = pxHeight * 3;
                                            break;
                                        case "l":
                                            width = pxHeight * 3;
                                            height = pxWidth * 3;
                                            break;
                                    }
                                    break;
                                default:
                                    width = 1500;
                                    height = 1500;
                                    break;
                            }
                            // nobody like non-integer pixel values, make sure to round them
                            width = Math.floor(width);
                            height = Math.floor(height);

                            page.emulate({
                                viewport: {width, height},
                                userAgent: 'Puppeteer'
                            }).then(() => {
                                page.on('console', msg => {
                                    console.log(msg.text());
                                    if (msg.text().indexOf(`Vidi is now loaded`) !== -1) {
                                        console.log('App was loaded, generating PNG');
                                        setTimeout(() => {
                                            page.evaluate(`$('.leaflet-top').remove();$('#loadscreen').remove();`).then(() => {
                                                page.screenshot({
                                                    encoding: `base64`
                                                }).then(data => {
                                                    let img = new Buffer.from(data, 'base64');

                                                    console.log('Only one page. No need to merge.');
                                                    if (!returnImage) {
                                                        fs.writeFile(`${__dirname}/../public/tmp/print/png/${key}.png`, img, (err) => {
                                                            if (q.bounds.length === 1) { // Only one page. No need to merge
                                                                // Increment print counter for successful PNG
                                                                const scale = q.scale || 'unknown';
                                                                const template = q.tmpl || 'default';
                                                                const db = q.db || 'unknown';
                                                                printCounter.inc({ scale, format: 'png', status: 'success', template, db });
                                                                response.send({success: true, key, uri, "format": "png"});
                                                            }
                                                            // Stop timer for PNG success
                                                            printTimer();
                                                            headless.destroy(browser);
                                                            console.log('Done #', count.n);
                                                            count.n++;
                                                        })
                                                    } else {
                                                        response.writeHead(200, {
                                                            'Content-Type': 'image/png',
                                                            'Content-Length': img.length
                                                        });
                                                        // Increment print counter for successful direct PNG return
                                                        const scale = q.scale || 'unknown';
                                                        const template = q.tmpl || 'default';
                                                        const db = q.db || 'unknown';
                                                        printCounter.inc({ scale, format: 'png', status: 'success', template, db });
                                                        // Stop timer for direct PNG return
                                                        printTimer();
                                                        headless.destroy(browser);
                                                        response.end(img);
                                                    }
                                                }).catch(error => {
                                                    console.log(error);
                                                    // Increment print counter for failed PNG
                                                    const scale = q.scale || 'unknown';
                                                    const template = q.tmpl || 'default';
                                                    const db = q.db || 'unknown';
                                                    printCounter.inc({ scale, format: 'png', status: 'error', template, db });
                                                    // Stop timer for PNG error
                                                    printTimer();
                                                    headless.destroy(browser);
                                                    response.status(500);
                                                    response.send(error);
                                                });
                                            }).catch(error => {
                                                console.log('Error while creating PNG');
                                                // Stop timer for PNG error
                                                printTimer();
                                                headless.destroy(browser);
                                                response.status(500);
                                                response.send(error);
                                            });
                                        }, delay);
                                    }
                                });
                                page.goto(url);
                            }).catch(error => {
                                // Stop timer for emulate error
                                printTimer();
                                headless.destroy(browser);
                                response.status(500);
                                response.send(error);
                            });
                        }).catch(error => {
                            // Stop timer for browser newPage error
                            printTimer();
                            headless.destroy(browser);
                            response.status(500);
                            response.send(error);
                        });
                    }
                }
            ).catch(error => {
                console.log("Can't get a browser right now: ", error.message);
                setTimeout(() => func(), 500)
            });
        }
        func();
    });
}
module.exports = router;
