/*
 * @author     Alexander Shumilov
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

/**
 * API-Brdige constants
 */

const QUEUE_PROCESSING_INTERVAL = 5000;
const QUEUE_STORE_NAME = 'vidi-feature-management-queue';
const QUEUE_DEFAULT_PKEY = `gid`;

const LOG = false;

const ADD_REQUEST = 0;
const UPDATE_REQUEST = 1;
const DELETE_REQUEST = 2;

module.exports = { LOG, QUEUE_PROCESSING_INTERVAL, QUEUE_STORE_NAME, QUEUE_DEFAULT_PKEY, ADD_REQUEST, UPDATE_REQUEST, DELETE_REQUEST };