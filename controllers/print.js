/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
const puppeteer = require('puppeteer');
let browser = false;
puppeteer.launch({
    headless: true,
    timeout: 10000,
    args: ["--no-sandbox"]
}).then(instance => {
    browser = instance;
});

/**
 *
 * @type {module.exports.print|{templates, scales}}
 */
router.post('/api/print', function (req, response) {
    req.setTimeout(0); // no timeout
    var q = req.body;
    var key = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    // TODO
    fs.writeFile(__dirname + "/../public/tmp/print/json/" + key, JSON.stringify(q), async (err) => {
        if (err) {
            response.send({success: true, error: err});
            return;
        }

        let host = "http://127.0.0.1:3000";
        let url = host + '/app/' + q.db + '/' + q.schema + '/' + (q.queryString !=="" ? q.queryString : "?") + '&tmpl=' + q.tmpl + '.tmpl&l=' + q.legend + '&h=' + q.header + '&px=' + q.px + '&py=' + q.py + '&td=' + q.dateTime+ '&d=' + q.date + '&k=' + key + '&t=' + q.title + '&c=' + q.comment + q.anchor;
        console.log(`Printing ` + url);

        const page = await browser.newPage();
        await page.emulateMedia('screen');
        page.on('console', msg => {
            if (msg.text().indexOf(`Vidi is now loaded`) !== -1) {
                console.log('App was loaded, generating PDF');
                setTimeout(() => {
                    page.pdf({
                        path: `${__dirname}/../public/tmp/print/pdf/${key}.pdf`,
                        landscape: (q.orientation === 'l'),
                        format: q.pageSize,
                        printBackground: true
                    }).then(() => {
                        console.log('Done');
                        page.close();
                        response.send({ success: true, key, url });
                    });
                }, 2000);
            }
        });

        await page.goto(url);
    });
});

router.get('/api/postdata', function (req, response) {
    var key = req.query.k;
    console.log(key);
    fs.readFile(__dirname + "/../public/tmp/print/json/" + key, 'utf8', function (err, data) {
        if (err) {
            response.send({success: true, error: err});
            return;
        }
        response.send({success: true, data: JSON.parse(data)});
    });
});

module.exports = router;