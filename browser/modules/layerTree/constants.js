/*
 * @author     Alexander Shumilov
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

/**
 * File contains constants that are used across the layerTree module
 */

const LOG = false;

const MODULE_NAME = `layerTree`;

const VIRTUAL_LAYERS_SCHEMA = `virtual_layer`;

const SYSTEM_FIELD_PREFIX = `gc2_`;

const SQL_QUERY_LIMIT = 100;

const SUB_GROUP_DIVIDER = `|`;

/**
 * Layer type prefixes
 */
const LAYER = {
    VECTOR: `v`,
    RASTER_TILE: `t`,
    VECTOR_TILE: `mvt`,
    WEBGL: `w`
};

const LAYER_TYPE_DEFAULT = LAYER.RASTER_TILE;

/**
 * Layer type icons
 */
let icons = {};
icons[LAYER.VECTOR] = `<i class="bi bi-bounding-box"></i>`;
icons[LAYER.RASTER_TILE] = `<i class="bi bi-border-all"></i>`;
icons[LAYER.VECTOR_TILE] = `<i class="bi bi-paint-bucket"></i>`;
icons[LAYER.WEBGL] = `<i class="bi bi-gpu-card"></i>`;
const ICONS = icons;

const VECTOR_SIDE_TABLE_EL = 'vector-side-table';

const SELECTED_STYLE = {
    opacity: 1,
    weight: 5,
    dashArray: "8 5",
    lineCap: "butt",
}
const VECTOR_STYLE = () => {
    return {
        opacity: 1,
        weight: 3,
        fillColor: "blue",
        color: "blue"
    }
}

const SELECTED_ICON_SCALE = 1.3;

export {
    LOG,
    MODULE_NAME,
    VIRTUAL_LAYERS_SCHEMA,
    SYSTEM_FIELD_PREFIX,
    SQL_QUERY_LIMIT,
    LAYER,
    ICONS,
    LAYER_TYPE_DEFAULT,
    SUB_GROUP_DIVIDER,
    VECTOR_SIDE_TABLE_EL,
    SELECTED_STYLE,
    VECTOR_STYLE,
    SELECTED_ICON_SCALE,
};
