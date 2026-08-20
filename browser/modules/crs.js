/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2025 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';


const resolutions = {
    "EPSG:3857": [156543.033928, 78271.516964, 39135.758482, 19567.879241, 9783.9396205,
        4891.96981025, 2445.98490513, 1222.99245256, 611.496226281, 305.748113141, 152.87405657,
        76.4370282852, 38.2185141426, 19.1092570713, 9.55462853565, 4.77731426782, 2.38865713391,
        1.19432856696, 0.597164283478, 0.298582141739, 0.149291, 0.074645535, 0.037322767, 0.018661384,
        0.009330692, 0.004665346, 0.002332673],
    "EPSG:25832": [1638.4, 819.2, 409.6, 204.8, 102.4, 51.2, 25.6, 12.8, 6.4, 3.2, 1.6, 0.8,
        0.4, 0.2, 0.1, 0.05, 0.025, 0.0125, 0.00625, 0.002125]
}

const projections = {
    "EPSG:3857": L.CRS.EPSG3857,
    "EPSG:25832": new L.Proj.CRS('EPSG:25832',
        '+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs', {
            resolutions: resolutions["EPSG:25832"],
            origin: [120000, 6500000],
            bounds: L.bounds([120000, 5661139.2], [1378291.2, 6500000])
        }),
}

const getProjection = (epsg = 'EPSG:3857') => {
    return projections[epsg];
}

const getResolutions = (epsg = 'EPSG:3857') => {
    return resolutions[epsg];
}

export {getProjection, getResolutions};
