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
