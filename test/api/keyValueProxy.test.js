/**
 * Testing State snaphsots API
 */

const { expect } = require(`chai`);
const request = require(`request`);
const helpers = require(`./../helpers`);
const uuidv4 = require('uuid/v4');

const DATABASE_NAME = `test`;
let createdKey = false;

describe('Key-value proxy', () => {
    // Getting the authentication cookie
    before(done => {
        request({
            url: `${helpers.API_URL}/session/start`,
            method: 'POST',
            json: true,
            body: {
                "database": "test",
                "password": "Silke2009",
                "schema": "public",
                "user": "test"
            }
        }, (error, response) => {
            AUTH_COOKIE = response.headers[`set-cookie`][0].split(`;`)[0];
            done();
        });
    });

    it('should create key-value pairs', (done) => {
        createdKey = uuidv4();
        request({
            url: `${helpers.API_URL}/key-value/${DATABASE_NAME}/${createdKey}`,
            method: `POST`,
            json: true,
            body: { someKey: `someValue` }
        }, (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            expect(response.body.success).to.equal(true);
            done();
        });
    });

    it('should get key-value pair', (done) => {
        request({
            url: `${helpers.API_URL}/key-value/${DATABASE_NAME}/${createdKey}`,
            method: `GET`,
            json: true,
        }, (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            expect(response.body.data.key).to.equal(createdKey);
            expect(response.body.data.value).to.equal(`{"someKey": "someValue"}`);
            done();
        });
    });

    it('should update key-value pair', (done) => {
        request({
            url: `${helpers.API_URL}/key-value/${DATABASE_NAME}/${createdKey}`,
            method: `PUT`,
            json: true,
            body: { someKey: `anotherValue` }
        }, (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            request({
                url: `${helpers.API_URL}/key-value/${DATABASE_NAME}/${createdKey}`,
                method: `GET`,
                json: true,
            }, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body.data.key).to.equal(createdKey);
                expect(response.body.data.value).to.equal(`{"someKey": "anotherValue"}`);
                done();
            });
        });
    });
});
