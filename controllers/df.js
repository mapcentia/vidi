/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2021 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const request = require('request');
const router = express.Router();
const config = require('../config/config.js');

router.get('/api/datafordeler/*', (req, response) => {
    const userName = config?.df?.datafordeler?.username;
    const pwd = config?.df?.datafordeler?.password;
    const token = config?.df?.datafordeler?.token;
    const host = 'https://services.datafordeler.dk';
    let creds = token ? `&token=${token}` : `&username=${userName}&password=${pwd}`;
    let requestURL = host + decodeURIComponent(req.url.substr(17)) + creds;
    requestURL = requestURL.replace('false', 'FALSE');
    get(requestURL, response);
});
router.get('/api/dataforsyningen/*', (req, response) => {
    const userName = config?.df?.dataforsyningen?.username;
    const pwd = config?.df?.dataforsyningen?.password;
    const token = config?.df?.dataforsyningen?.token;
    const host = 'https://api.dataforsyningen.dk';
    let creds = token ? `&token=${token}` : `&username=${userName}&password=${pwd}`;
    let requestURL = host + decodeURIComponent(req.url.substr(20)) + creds;
    requestURL = requestURL.replace('false', 'FALSE')

    // if the string has a parameter tileMatrixSet, with the value of View1 - we need to rewrite the tileMatrix value
    if (requestURL.includes('tileMatrixSet=View1')) {
        let tileMatrix = requestURL.match(/tileMatrix=\d+/);
        // pad the tileMatrix with 0 to 2 digits, and prefix the value with L
        let tileMatrixValue = tileMatrix[0].split('=')[1];
        tileMatrixValue = 'L' + tileMatrixValue.padStart(2, '0').toString();
        console.log(tileMatrixValue);
        // replace the tileMatrix value in the url with the new value
        requestURL = requestURL.replace(/tileMatrix=\d+/, 'tileMatrix='+tileMatrixValue);
    }
    
    get(requestURL, response);
});

const get = (url, res) => {
    // Let the user decide if they want to redirect or wait for the response
    if (config?.df?.redirect) {
        res.redirect(url);
    
    // or wait for the response
    } else {
        let options = {
            method: 'GET',
            uri: url
        };
        request(options).on('error', (e) => console.error(e)).pipe(res);
    }
}
module.exports = router;
