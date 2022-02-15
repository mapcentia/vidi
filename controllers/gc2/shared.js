/*
 * @author     Alexander Shumilov
 * @copyright  2013-2021 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const TRACKER_COOKIE_NAME = `vidi-state-tracker`;

const throwError = (response, error, data) => {
    console.error(`Error occured: ${error}`);
    if (data) console.error(`Error details: ${JSON.stringify(data)}`);

    response.status(400);
    response.json({error});
};

/**
 * Return identifiers of the currently authenticated user
 *
 * @returns {Object}
 */
const getCurrentUserIdentifiers = (request) => {
    let browserId = false;
    if (TRACKER_COOKIE_NAME in request.cookies) {
        browserId = request.cookies[TRACKER_COOKIE_NAME];
    }

    let userId = false;
    if (`gc2UserName` in request.session && request.session.gc2UserName) {
        userId = request.session.gc2UserName;
    }

    return {browserId, userId};
};

module.exports = {
    throwError,
    getCurrentUserIdentifiers
}
