/*
 * @author     Alexander Shumilov
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

/**
 * Returning PNG image with a Vidi state snapshot screenshot
 */

var express = require('express');
var router = express.Router();
var config = require('../config/config.js').gc2;
var headless = require('./headlessBrowser');

const returnPNGForStateSnapshot = (localRequest, localResponse) => {
    let errorMessages = [];
    if (!localRequest.params.db) errorMessages.push(`database is not defined`);
    if (!localRequest.params.scheme) errorMessages.push(`scheme is not defined`);
    if (!localRequest.query.state) errorMessages.push(`state is not defined`);

    if (errorMessages.length === 0) {
        let url = `${localRequest.protocol}://${localRequest.get('host')}/app/${localRequest.params.db}/${localRequest.params.scheme}/?state=${localRequest.query.state}`;
        headless.getBrowser().newPage().then(page => {
            page.emulate({
                viewport: {
                    width: 1920,
                    height: 1080
                },
                userAgent: 'Puppeteer'
            }).then(() => {
                page.on('console', msg => {
                    if (msg.text().indexOf(`Vidi is now loaded`) !== -1) {
                        console.log('App was loaded, generating PNG');
                        setTimeout(() => {
                            page.screenshot({
                                encoding: `base64`
                            }).then(data => {
                                let img = new Buffer(data, 'base64');
                                localResponse.writeHead(200, {
                                    'Content-Type': 'image/png',
                                    'Content-Length': img.length
                                });

                                page.close();
                                localResponse.end(img); 
                            }).catch(error => {
                                response.status(500);
                                response.send(error);
                            });
                        }, 2000);
                    }
                });

                page.goto(url);
            }).catch(error => {
                response.status(500);
                response.send(error);
            });
        });
    } else {
        response.status(400);
        response.send(`Errors occured: ${errorMessages.join(`,`)}`);
    }
};

router.get('/api/static/:db/:scheme', returnPNGForStateSnapshot);
router.get('/api/static/:db/:scheme/', returnPNGForStateSnapshot);

module.exports = router;
