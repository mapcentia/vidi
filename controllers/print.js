/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */
require('dotenv').config();

var express = require('express');
var router = express.Router();
var fs = require('fs');
var headless = require('./headlessBrowserPool').pool;
const shared = require('./gc2/shared');
const request = require('request');
const PDFMerge = require('pdf-merge');
const AdmZip = require('adm-zip');


/**
 *
 * @type {module.exports.print|{templates, scales}}
 */
router.post('/api/print', function (req, response) {
        req.setTimeout(0); // no timeout
        var body = req.body;
        var outputPng = body.png === true; // Should format be PNG?
        var returnImage = body.image === undefined ? true : body.image !== false; // Should return image if PNG is requested?
        var count = {"n": 0}; // Must be passed as copy of a reference
        var files = [];
        var poll = () => {
            setTimeout(() => {
                if (count.n === body.bounds.length) {
                    console.log("Done All. Merging...");
                    var key = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                    if (!outputPng) {
                        PDFMerge(files, {output: `${__dirname}/../public/tmp/print/pdf/${key}.pdf`})
                            .then((buffer) => {
                                response.send({success: true, key, "format": "pdf"});
                            });
                    } else {
                        const zip = new AdmZip();

                        files.forEach(path => {
                            zip.addLocalFile(path);
                        });
                        zip.writeZip(`${__dirname}/../public/tmp/print/png/${key}.zip`);
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
            var key = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            if (!outputPng) {
                files.push(`${__dirname}/../public/tmp/print/pdf/${key}.pdf`);
            } else {
                files.push(`${__dirname}/../public/tmp/print/png/${key}.png`);
            }
            print(key, body, req, response, outputPng, i, count, returnImage);
        }
    }
);

router.get('/api/print/:database', function (req, res) {
    const port = process.env.PORT ? process.env.PORT : 3000;
    let uri = "http://127.0.0.1:" + port + '/api/state-snapshots/' + req.params.database + '/' + req.query.state;
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
            var key = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
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
    var key = req.query.k;
    fs.readFile(__dirname + "/../public/tmp/print/json/" + key, 'utf8', function (err, data) {
        if (err) {
            response.send({success: true, error: err});
            return;
        }

        response.send({success: true, data: JSON.parse(data)});
    });
});

function print(key, q, req, response, outputPng = false, frame = 0, count, returnImage = true) {
    fs.writeFile(__dirname + "/../public/tmp/print/json/" + key, JSON.stringify(q), async (err) => {
        if (err) {
            response.send({success: true, error: err});
            return;
        }
        const margin = q.tmpl === "_conflictPrint" ? {left: '0.4cm', top: '1cm', right: '0.4cm', bottom: '1cm'} : 0;
        const port = process.env.PORT ? process.env.PORT : 3000;
        let url = "http://127.0.0.1:" + port + '/app/' + q.db + '/' + q.schema + '/' + (q.queryString !== "" ? q.queryString : "?") + '&frame=' + frame + '&session=' + (typeof req.cookies["connect.gc2"] !== "undefined" ? encodeURIComponent(req.cookies["connect.gc2"]) : "") + '&tmpl=' + q.tmpl + '.tmpl&l=' + q.legend + '&h=' + q.header + '&px=' + q.px + '&py=' + q.py + '&td=' + q.dateTime + '&d=' + q.date + '&k=' + key + '&t=' + q.title + '&c=' + q.comment + q.anchor;
        console.log(`Printing ` + url);

        let check = false;
        let delay = 1000;
        const func = () => {
            headless.acquire().then(browser => {
                    setTimeout(() => {
                        if (headless.isBorrowedResource(browser)) {
                            headless.destroy(browser);
                            console.log("Destroying browser after 60 secs");
                        }
                    }, 60000);
                    if (!outputPng) {
                        browser.newPage().then(async (page) => {
                            await page.emulateMedia('screen');
                            page.on('console', msg => {
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
                                                        response.send({success: true, key, url, "format": "pdf"});
                                                    }
                                                    headless.destroy(browser);
                                                    count.n++;
                                                }
                                            ).catch(() => {
                                                    console.log('Error while creating PDF');
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
                            headless.destroy(browser);
                            response.status(500).send({
                                success: false
                            });
                        });
                    } else {
                        browser.newPage().then(page => {
                            const pxWidth = 790;
                            const pxHeight = 1116;
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
                                                                response.send({success: true, key, url, "format": "png"});
                                                            }
                                                            headless.destroy(browser);
                                                            console.log('Done #', count.n);
                                                            count.n++;
                                                        })
                                                    } else {
                                                        response.writeHead(200, {
                                                            'Content-Type': 'image/png',
                                                            'Content-Length': img.length
                                                        });
                                                        headless.destroy(browser);
                                                        response.end(img);
                                                    }
                                                }).catch(error => {
                                                    console.log(error);
                                                    headless.destroy(browser);
                                                    response.status(500);
                                                    response.send(error);
                                                });
                                            }).catch(error => {
                                                console.log('Error while creating PNG');
                                                headless.destroy(browser);
                                                response.status(500);
                                                response.send(error);
                                            });
                                        }, delay);
                                    }
                                });
                                page.goto(url);
                            }).catch(error => {
                                headless.destroy(browser);
                                response.status(500);
                                response.send(error);
                            });
                        }).catch(error => {
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
