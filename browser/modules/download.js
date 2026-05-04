/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2026 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

/**
 *
 */

module.exports = {
    download: (sql, format, db, fileName) => {
        fileName = fileName || 'file';
        let request = new XMLHttpRequest();
        request.open('POST', '/api/sql/' + db, true);
        request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        request.responseType = 'blob';
        request.onload = function () {
            if (request.status === 200) {
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
                request.response.text().then(e => alert(JSON.parse(e).message.join("\n")));
            }
            // some error handling should be done here...
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
