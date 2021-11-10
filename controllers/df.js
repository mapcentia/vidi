/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2021 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const request = require('request');
const router = express.Router();
const userName = require('../config/config.js')?.df?.username;
const pwd = require('../config/config.js')?.df?.password;
const host = 'https://services.datafordeler.dk';

router.get('/api/df/*', (req, response) => {
    let requestURL = host + decodeURIComponent(req.url.substr(7)) + '&username=' + userName + "&password=" + pwd;
    requestURL = requestURL.replace('false', 'FALSE')
    let options = {
        method: 'GET',
        uri: requestURL
    };
    request(options).pipe(response);
});
module.exports = router;
