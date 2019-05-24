/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

let config = require('./../../config/config');
let express = require('express');
let router = express.Router();
const request = require('request');
const shared = require('./shared');

if (!config.gc2.host) throw new Error(`Unable to get the GC2 host from config`);
const API_LOCATION = config.gc2.host + `/api/v2/keyvalue`;

/**
 * Get all key-value data for database
 */
router.get('/api/key-value/:dataBase', (req, res) => {
    let params = ``;
    if (req.query && req.query.like) {
        params = `like=${req.query.like} `;
    }

    request({
        method: 'GET',
        encoding: 'utf8',
        uri: `${API_LOCATION}/${req.params.dataBase}?${params}`
    }, (error, response) => {
        let parsedBody = false;
        try {
            let localParsedBody = JSON.parse(response.body);
            parsedBody = localParsedBody;
        } catch (e) {}

        if (parsedBody) {
            if (parsedBody.data === false) {
                res.status(404);
                res.json({ error: `NOT_FOUND` });
            } else {
                res.send(parsedBody);
            }
        } else {
            shared.throwError(res, 'INVALID_OR_EMPTY_EXTERNAL_API_REPLY', { body: response.body });
        }
    });
});


/**
 * Get specific key-value pair
 */
router.get('/api/key-value/:dataBase/:key', (req, res) => {
    request({
        method: 'GET',
        encoding: 'utf8',
        uri: `${API_LOCATION}/${req.params.dataBase}/${req.params.key}`
    }, (error, response) => {
        let parsedBody = false;
        try {
            let localParsedBody = JSON.parse(response.body);
            parsedBody = localParsedBody;
        } catch (e) {}

        if (parsedBody) {
            if (parsedBody.data === false) {
                res.status(404);
                res.json({ error: `NOT_FOUND` });
            } else {
                res.send(parsedBody);
            }
        } else {
            shared.throwError(res, 'INVALID_OR_EMPTY_EXTERNAL_API_REPLY', { body: response.body });
        }
    });
});

/**
 * Create key-value pair
 */
router.post('/api/key-value/:dataBase/:key', (req, res) => {
    request({
        method: 'POST',
        encoding: 'utf8',
        uri: `${API_LOCATION}/${req.params.dataBase}/${req.params.key}`,
        form: JSON.stringify(req.body)
    }, (error, response) => {
        let parsedBody = false;
        try {
            let localParsedBody = JSON.parse(response.body);
            parsedBody = localParsedBody;
        } catch (e) {}

        if (parsedBody) {
            if (parsedBody.success) {
                res.json(parsedBody);
            } else {
                shared.throwError(res, parsedBody.message);
            }
        } else {
            shared.throwError(res, 'INVALID_OR_EMPTY_EXTERNAL_API_REPLY', { body: response.body });
        } 
    });
});

/**
 * Update key-value pair
 */
router.put('/api/key-value/:dataBase/:key', (req, res) => {
    request({
        method: 'PUT',
        encoding: 'utf8',
        uri: `${API_LOCATION}/${req.params.dataBase}/${req.params.key}`,
        form: JSON.stringify(req.body)
    }, (error, response) => {
        let parsedBody = false;
        try {
            let localParsedBody = JSON.parse(response.body);
            parsedBody = localParsedBody;
        } catch (e) {}

        if (parsedBody) {
            if (parsedBody.success) {
                res.json(parsedBody);
            } else {
                shared.throwError(res, parsedBody.message);
            }
        } else {
            shared.throwError(res, 'INVALID_OR_EMPTY_EXTERNAL_API_REPLY', { body: response.body });
        } 
    });
});

module.exports = router;
