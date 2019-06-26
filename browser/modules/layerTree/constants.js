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

const SQL_QUERY_LIMIT = 500;

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
icons[LAYER.VECTOR] = `<i class="material-icons">gesture</i>`;
icons[LAYER.RASTER_TILE] = `<i class="material-icons">border_all</i>`;
icons[LAYER.VECTOR_TILE] = `<i class="material-icons">domain</i>`;
icons[LAYER.WEBGL] = `<i class="material-icons">grain</i>`;
const ICONS = icons;

export {
    LOG,
    MODULE_NAME,
    VIRTUAL_LAYERS_SCHEMA,
    SYSTEM_FIELD_PREFIX,
    SQL_QUERY_LIMIT,
    LAYER,
    ICONS,
    LAYER_TYPE_DEFAULT,
    SUB_GROUP_DIVIDER
};