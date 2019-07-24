/*
 * @author     Alexander Shumilov
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

/**
 * Returning PNG image with a Vidi state snapshot screenshot
 */

require('dotenv').config();

var express = require('express');
var router = express.Router();
var headless = require('./headlessBrowser');

const returnPNGForStateSnapshot = (localRequest, localResponse) => {
    let errorMessages = [];
    if (!localRequest.params.db) errorMessages.push(`database is not defined`);
    if (!localRequest.query.state && !localRequest.query.filter) errorMessages.push(`state or filter paramter is not defined`);
    if (!localRequest.headers.host) errorMessages.push(`"Host" header has to be correctly passed to the app`);

    let width = (localRequest.query.width && parseInt(localRequest.query.width) > 0 ? parseInt(localRequest.query.width) : 800);
    let height = (localRequest.query.height && parseInt(localRequest.query.height) > 0 ? parseInt(localRequest.query.height) : 600);
    let config = (localRequest.query.config ? `&config=${localRequest.query.config}` : ``);

    let state = (localRequest.query.state ? `&state=${localRequest.query.state}` : ``);
    let filter = (localRequest.query.filter ? `&initialFilter=${localRequest.query.filter}` : ``);

    if (errorMessages.length === 0) {
        const port = process.env.PORT ? process.env.PORT : 3000;
        let url = `http://127.0.0.1:${port}/app/${localRequest.params.db}/${localRequest.params.scheme}/?tmpl=blank.tmpl${state}${filter}${config}`;
        headless.getBrowser().then(browser => {
            browser.newPage().then(page => {
                page.emulate({
                    viewport: { width, height },
                    userAgent: 'Puppeteer'
                }).then(() => {
                    page.on('console', msg => {
                        console.log(msg.text());

                        if (msg.text().indexOf(`Vidi is now loaded`) !== -1) {

                            console.log('App was loaded, generating PNG');
                            setTimeout(() => {
                                page.evaluate(`$('.leaflet-top').remove();`).then(() => {
                                    setTimeout(() => {
                                        page.screenshot({
                                            encoding: `base64`
                                        }).then(data => {
                                            let img = new Buffer.from(data, 'base64');
                                            localResponse.writeHead(200, {
                                                'Content-Type': 'image/png',
                                                'Content-Length': img.length
                                            });

                                            page.close();
                                            localResponse.end(img); 
                                        }).catch(error => {
                                            localResponse.status(500);
                                            localResponse.send(error);
                                        });
                                    }, 1000);
                                }).catch(error => {
                                    localResponse.status(500);
                                    localResponse.send(error);
                                });
                            }, 2000);
                        }
                    });

                    page.goto(url);
                }).catch(error => {
                    localResponse.status(500);
                    localResponse.send(error);
                });
            });
        }).catch(error => {
            console.error(error);
            localResponse.status(500);
            localResponse.send(`Error occured: ${error}`);
        });
    } else {
        localResponse.status(400);
        localResponse.send(`Errors occured: ${errorMessages.join(`,`)}`);
    }
};

router.get('/api/static/:db/:scheme?', returnPNGForStateSnapshot);
router.get('/api/static/:db/:scheme?/', returnPNGForStateSnapshot);

module.exports = router;
