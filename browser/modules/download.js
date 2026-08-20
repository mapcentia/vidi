/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2026 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import utils from './utils';

/**
 *
 */

const onError = function (request) {
    utils.hideInfoToast()
    request.response.text().then(
        e => {
            utils.hideInfoToast()
            utils.showDangerToast(JSON.parse(e).message, {delay: 5000, autohide: true})
        }
    );
}

module.exports = {
    download: (sql, format, db, fileName) => {
        fileName = fileName || 'file';
        utils.showInfoToast(`<div class="d-flex">
                                    <div>${__('Creating download file')}</div>
                                    <div class="spinner-border spinner-border-sm ms-2" role="status"></div>
                                  </div>`,
            {delay: 1500, autohide: false});
        let request = new XMLHttpRequest();
        request.open('POST', '/api/sql/nocache/' + db, true);
        request.setRequestHeader('Accept', 'application/json');
        request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        request.responseType = 'blob';
        request.onerror = function () {
            onError(request);
        }
        request.onload = function () {
            if (request.status === 200) {
                utils.showInfoToast(`<div class="d-flex">
                                            <div>${__('File was downloaded')}</div>
                                            <div class="bi bi-check ms-2" role="status"></div>
                                            </div>`
                    , {delay: 2000, autohide: true})
                let filename, type;
                switch (format) {
                    case "csv":
                        filename = `${fileName}.csv`;
                        type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                        break;
                    case "excel":
                        filename = `${fileName}.xlsx`;
                        type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                        break;
                    case "geojson":
                        filename = `${fileName}.geojson`;
                        type = 'application/json';
                        break;
                    default:
                        filename = `${fileName}.zip`;
                        type = 'application/zip';
                        break;
                }
                let blob = new Blob([request.response], {type: type});
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                onError(request);
            }
        };

        let data = {
            geoformat: 'wkt',
            format: format,
            client_encoding: 'UTF8',
            srs: 4326,
            q: sql
        };
        request.send(JSON.stringify(data));
    }
};
