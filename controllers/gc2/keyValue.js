/*
 * @author     Alexander Shumilov
 * @copyright  2013-2026 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

let config = require('./../../config/config');
let express = require('express');
let router = express.Router();
const shared = require('./shared');

if (!config.gc2.host) throw new Error(`Unable to get the GC2 host from config`);
const API_LOCATION = config.gc2.host + `/api/v2/keyvalue`;

const FORM_HEADERS = {'Content-Type': 'application/x-www-form-urlencoded'};

/**
 * Get all key-value data for database
 */
router.get('/api/key-value/:dataBase', async (req, res) => {
    let params = ``;
    if (req.query && req.query.like) {
        params = `like=${req.query.like}`;
    }
    if (req.query && req.query.filter) {
        params += `&filter=${req.query.filter}`;
    }

    let uri = `${API_LOCATION}/${req.params.dataBase}?${params}`;
    console.log(uri);

    let body;
    try {
        const response = await fetch(uri, {method: 'GET'});
        body = await response.text();
    } catch (error) {
        shared.throwError(res, 'INVALID_OR_EMPTY_EXTERNAL_API_REPLY', {error});
        return;
    }

    let parsedBody = false;
    try {
        parsedBody = JSON.parse(body);
    } catch (e) {
    }

    if (parsedBody) {
        if (parsedBody.data === false) {
            res.status(404);
            res.json({error: `NOT_FOUND`});
        } else {
            res.send(parsedBody);
        }
    } else {
        shared.throwError(res, 'INVALID_OR_EMPTY_EXTERNAL_API_REPLY', {body});
    }
});


/**
 * Get specific key-value pair
 */
router.get('/api/key-value/:dataBase/:key', async (req, res) => {
    let body;
    try {
        const response = await fetch(`${API_LOCATION}/${req.params.dataBase}/${req.params.key}`, {method: 'GET'});
        body = await response.text();
    } catch (error) {
        shared.throwError(res, 'INVALID_OR_EMPTY_EXTERNAL_API_REPLY', {error});
        return;
    }

    let parsedBody = false;
    try {
        parsedBody = JSON.parse(body);
    } catch (e) {
    }

    if (parsedBody) {
        if (parsedBody.data === false) {
            res.status(404);
            res.json({error: `NOT_FOUND`});
        } else {
            res.send(parsedBody);
        }
    } else {
        shared.throwError(res, 'INVALID_OR_EMPTY_EXTERNAL_API_REPLY', {body});
    }
});

/**
 * Create key-value pair
 */
router.post('/api/key-value/:dataBase/:key', async (req, res) => {
    let body;
    try {
        const response = await fetch(`${API_LOCATION}/${req.params.dataBase}/${req.params.key}`, {
            method: 'POST',
            headers: FORM_HEADERS,
            body: JSON.stringify(req.body)
        });
        body = await response.text();
    } catch (error) {
        shared.throwError(res, 'INVALID_OR_EMPTY_EXTERNAL_API_REPLY', {error});
        return;
    }

    let parsedBody = false;
    try {
        parsedBody = JSON.parse(body);
    } catch (e) {
    }

    if (parsedBody) {
        if (parsedBody.success) {
            res.json(parsedBody);
        } else {
            shared.throwError(res, parsedBody.message);
        }
    } else {
        shared.throwError(res, 'INVALID_OR_EMPTY_EXTERNAL_API_REPLY', {body});
    }
});

/**
 * Update key-value pair
 */
router.put('/api/key-value/:dataBase/:key', async (req, res) => {
    let body;
    try {
        const response = await fetch(`${API_LOCATION}/${req.params.dataBase}/${req.params.key}`, {
            method: 'PUT',
            headers: FORM_HEADERS,
            body: JSON.stringify(req.body)
        });
        body = await response.text();
    } catch (error) {
        shared.throwError(res, 'INVALID_OR_EMPTY_EXTERNAL_API_REPLY', {error});
        return;
    }

    let parsedBody = false;
    try {
        parsedBody = JSON.parse(body);
    } catch (e) {
    }

    if (parsedBody) {
        if (parsedBody.success) {
            res.json(parsedBody);
        } else {
            shared.throwError(res, parsedBody.message);
        }
    } else {
        shared.throwError(res, 'INVALID_OR_EMPTY_EXTERNAL_API_REPLY', {body});
    }
});

/**
 * Delete key-value pair
 */
router.delete('/api/key-value/:dataBase/:key', async (req, res) => {
    let body;
    try {
        const response = await fetch(`${API_LOCATION}/${req.params.dataBase}/${req.params.key}`, {method: 'DELETE'});
        body = await response.text();
    } catch (error) {
        shared.throwError(res, 'INVALID_OR_EMPTY_EXTERNAL_API_REPLY', {error});
        return;
    }

    let parsedBody = false;
    try {
        parsedBody = JSON.parse(body);
    } catch (e) {
    }

    if (parsedBody) {
        if (parsedBody.success) {
            res.json(parsedBody);
        } else {
            shared.throwError(res, parsedBody.message);
        }
    } else {
        shared.throwError(res, 'INVALID_OR_EMPTY_EXTERNAL_API_REPLY', {body});
    }
});

module.exports = router;
