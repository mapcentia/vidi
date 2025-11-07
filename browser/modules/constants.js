/*
 * @author     Martin Høgh
 * @copyright  2013-2022 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

/**
 * File contains constants that are used across the all modules
 */

const GEOJSON_PRECISION = 14;
const MIME_TYPES_IMAGES = ['image/png', 'image/jpeg', 'image/gif'];
const MIME_TYPES_APPS = [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.oasis.opendocument.text',
    'video/mp4',
    'video/webm',
    'video/ogg',
    'audio/mpeg',
    'audio/ogg',
    'audio/wav',
    'audio/aac',
]

const NO_GUI_FADE = 1 << 0; // 001 = 1
const NO_VISIBILITY_CHECK = 1 << 1; // 010 = 2
const NO_MAP_ANIMATION = 1 << 2; // 100 = 4

//const MODE_C = 1 << 2; // 100 = 4

export {
    GEOJSON_PRECISION, MIME_TYPES_APPS, MIME_TYPES_IMAGES, NO_GUI_FADE, NO_VISIBILITY_CHECK, NO_MAP_ANIMATION
};
