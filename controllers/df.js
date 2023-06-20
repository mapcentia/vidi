/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2021 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const request = require('request');
const router = express.Router();

router.get('/api/datafordeler/*', (req, response) => {
    const userName = require('../config/config.js')?.df?.datafordeler?.username;
    const pwd = require('../config/config.js')?.df?.datafordeler?.password;
    const token = require('../config/config.js')?.df?.datafordeler?.token;
    const host = 'https://services.datafordeler.dk';
    let creds = token ? `&token=${token}` : `&username=${userName}&password=${pwd}`;
    let requestURL = host + decodeURIComponent(req.url.substr(17)) + creds;
    requestURL = requestURL.replace('false', 'FALSE');
    get(requestURL, response);
});
router.get('/api/dataforsyningen/*', (req, response) => {
    const userName = require('../config/config.js')?.df?.dataforsyningen?.username;
    const pwd = require('../config/config.js')?.df?.dataforsyningen?.password;
    const token = require('../config/config.js')?.df?.dataforsyningen?.token;
    const host = 'https://api.dataforsyningen.dk';
    let creds = token ? `&token=${token}` : `&username=${userName}&password=${pwd}`;
    let requestURL = host + decodeURIComponent(req.url.substr(20)) + creds;
    requestURL = requestURL.replace('false', 'FALSE')
    get(requestURL, response);
});

const get = (url, res) => {
    //console.log(url);
    let options = {
        method: 'GET',
        uri: url
    };
    request(options).on('error', (e) => console.error(url,e)).pipe(res);
}
module.exports = router;
