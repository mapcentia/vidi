/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2026 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const router = express.Router();
const config = require('../config/config.js');
const {Readable} = require('stream');

router.get('/api/datafordeler/*', async (req, response) => {
    const userName = config?.df?.datafordeler?.username;
    const pwd = config?.df?.datafordeler?.password;
    const token = config?.df?.datafordeler?.token;
    const host = 'https://services.datafordeler.dk';
    let creds = token ? `&token=${token}` : `&username=${userName}&password=${pwd}`;
    let requestURL = host + decodeURIComponent(req.url.substr(17)) + creds;
    requestURL = requestURL.replace('false', 'FALSE');
    await get(requestURL, response);
});
router.get('/api/dataforsyningen/*', async (req, response) => {
    const userName = config?.df?.dataforsyningen?.username;
    const pwd = config?.df?.dataforsyningen?.password;
    const token = config?.df?.dataforsyningen?.token;
    let host = 'https://api.dataforsyningen.dk';

    // Due to dataforsyningen modernization, these services change their url, prefixing wms or wmts.
    // lists updated: 2021-08-21
    // https://dataforsyningen.dk/news/5042
    // Live change list: https://dataforsyningen.dk/asset/PDF/Mapningstabel/dataforsyningen_api_2025.xlsx
    let changedWMSServices = [
        'orto_sommer_1999',
        'orto_sommer_2002',
        'orto_sommer_2005',
        'orto_sommer_2008',
        'orto_foraar_temp',
        'forvaltning2',
        'kommunikation',
        'orto_foraar',
        'grid'
    ];
    let changedWMTSServices = [
        'dhm_bluespot_ekstremregn'
    ];

    let serviceName = req.url.substring('/api/dataforsyningen/'.length).split('?')[0];
    console.log(serviceName)
    serviceName = serviceName.replace(/^\/|\/$/g, ''); // trim leading/trailing slash
    if (changedWMSServices.includes(decodeURIComponent(serviceName))) {
        host += '/wms';
    } else if (changedWMTSServices.includes(decodeURIComponent(serviceName))) {
        host += '/wmts';
    }

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
        requestURL = requestURL.replace(/tileMatrix=\d+/, 'tileMatrix=' + tileMatrixValue);
    }

    await get(requestURL, response);
});

const get = async (url, res) => {
    // Let the user decide if they want to redirect or wait for the response
    if (config?.df?.redirect) {
        res.redirect(url);
        return;
    }

    // or wait for the response
    let upstream;
    try {
        upstream = await fetch(url, {method: 'GET'});
    } catch (e) {
        console.error(e);
        if (!res.headersSent) res.status(502).end();
        return;
    }

    res.writeHead(upstream.status, {
        'content-type': upstream.headers.get('content-type') || 'application/octet-stream'
    });

    if (!upstream.body) {
        res.end();
        return;
    }

    const nodeStream = Readable.fromWeb(upstream.body);
    nodeStream.on('error', (e) => {
        console.error(e);
        res.end();
    });
    nodeStream.pipe(res);
}
module.exports = router;
