/**
 * Testing static PNG API
 */

const { expect } = require(`chai`);
const request = require(`request`);
const helpers = require(`./../helpers`);

describe('Static PNG API', () => {
    it('should generate PNG image according to provided filters', (done) => {
        let buff = new Buffer.from(JSON.stringify({
            "test.city_center": {
                "match":"any",
                "columns":[{
                    "fieldname":"id",
                    "expression":">",
                    "value":"6",
                    "restriction":false
                }]
            }
        }));

        const url = `${helpers.API_URL}/static/mydb/test?filter=${buff.toString('base64')}&width=600&height=600`;
        request({
            method: `GET`,
            url
        }, (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            expect(response.headers['content-type']).to.equal('image/png');
            expect(parseInt(response.headers['content-length']) > 100000).to.be.true;
            done();
        });
    });
});
