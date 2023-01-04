/**
 * Testing State snaphsots API
 */

const {expect} = require(`chai`);
const request = require(`request`);
const helpers = require(`./../helpers`);
const base64url = require("base64url");

let AUTH_COOKIE = false;
const TRACKER_COOKIE = `vidi-state-tracker=789e6095-cf85-4435-a095-e1311bb9d215`;

let anonymousStateSnapshotId = false;
let nonAnonymousStateSnapshotId = false;

const DATABASE_NAME = `mydb`;

const getAllSnapshots = (browser = false, user = false) => {
    let cookieRaw = ``;
    if (browser) {
        cookieRaw = cookieRaw + TRACKER_COOKIE;
    }

    if (user) {
        cookieRaw = cookieRaw + `;` + AUTH_COOKIE;
    }

    let cookie = request.cookie(cookieRaw);
    let result = new Promise((resolve, reject) => {
        request({
            url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}`,
            method: `GET`,
            headers: {Cookie: cookie}
        }, (error, response) => {
            let parsedBody = JSON.parse(base64url.decode(response.body));
            resolve(parsedBody);
        });
    });

    return result;
};

describe('State snapshot management API', () => {
    // Getting the authentication cookie
    before(done => {
        request({
            url: `${helpers.API_URL}/session/start`,
            method: 'POST',
            json: true,
            body: {
                "database": "mydb",
                "password": "hawk2000",
                "schema": "public",
                "user": "mydb"
            }
        }, (error, response) => {
            AUTH_COOKIE = response.headers[`set-cookie`][0].split(`;`)[0];
            done();
        });
    });

    it('should return publicly available state snapshots without tracker cookie or authorization', (done) => {
        request(`${helpers.API_URL}/state-snapshots/${DATABASE_NAME}`, (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            let parsedBody = JSON.parse(base64url.decode(body));
            expect(parsedBody.length >= 0).to.be.true;
            done();
        });
    });

    it('should be able to create anonymous state snapshot for unauthorized user', (done) => {
        let cookie = request.cookie(`${TRACKER_COOKIE}`);
        let data = base64url(JSON.stringify({
            host: "https://exampdffdfle.com",
            database: "database",
            schema: "schema",
            anonymous: true,
            snapshot: {
                modules: [],
                map: {
                    x: 1,
                    y: 2,
                    zoom: 3
                }
            }
        }))
        let options = {
            url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}`,
            method: `POST`,
            headers: {
                Cookie: cookie,
                'Content-Type': 'text/plain',
                'Accept': 'text/plain, */*'
            },
            contentType: 'text/plain',
            dataType: 'text',
            json: false,
            body: data
        };

        request(options, (error, response) => {
            expect(response.statusCode).to.equal(200);
            response.body = JSON.parse(response.body)
            expect(response.body.id.length > 0).to.equal(true);
            expect(response.body.token.length > 0).to.equal(true);

            anonymousStateSnapshotId = response.body.id;

            options = {
                url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}`,
                method: `GET`,
                headers: {Cookie: cookie},
            };

            getAllSnapshots(true).then(stateSnapshots => {
                let wasAdded = false;
                stateSnapshots.map(item => {
                    if (item.id === anonymousStateSnapshotId && item.browserId) {
                        wasAdded = true;
                    }
                });

                expect(wasAdded).to.be.true;
                done();
            });
        });
    });

    it('should be able to get state snapshot by its identifier', (done) => {
        let cookie = request.cookie(`${TRACKER_COOKIE}`);
        let options = {
            url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}/${anonymousStateSnapshotId}`,
            method: `GET`,
            json: true,
            headers: {Cookie: cookie},
        };

        request(options, (error, response, body) => {
            const parsedBody = JSON.parse(base64url.decode(response.body));
            expect(response.statusCode).to.equal(200);
            expect(parsedBody.id).to.equal(anonymousStateSnapshotId);
            expect(parsedBody.anonymous).to.equal(true);
            expect(parsedBody.browserId.length > 0).to.equal(true);
            done();
        });
    });

    it('should return 404 if the state snapshot identifier is invalid', (done) => {
        let cookie = request.cookie(`${TRACKER_COOKIE}`);
        let options = {
            url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}/INVALID`,
            method: `GET`,
            json: true,
            headers: {Cookie: cookie},
        };

        request(options, (error, response, body) => {
            expect(response.statusCode).to.equal(404);
            done();
        });
    });

    it('should return list of snapshots for unauthorized user', (done) => {
        getAllSnapshots(true).then(stateSnapshots => {
            stateSnapshots.map(item => {
                if (item.id === anonymousStateSnapshotId) {
                    wasAdded = true;
                }
            });

            expect(wasAdded).to.be.true;
            done();
        });
    });

    it('should be able to create user state snapshot for authorized user', (done) => {
        let cookie = request.cookie(`${TRACKER_COOKIE};${AUTH_COOKIE}`);
        let options = {
            url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}`,
            method: `POST`,
            headers: {
                Cookie: cookie,
                'Content-type': 'text/plain'
            },
            body: base64url(JSON.stringify({
                        host: `https://example.com`,
                        database: `database`,
                        schema: `schema`,
                        anonymous: false,
                        snapshot: {
                            modules: [],
                            map: {
                                x: 1,
                                y: 2,
                                zoom: 3
                            }
                        }
                    }
                )
            )
        };

        request(options, (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            nonAnonymousStateSnapshotId = JSON.parse(response.body).id;

            let wasAdded = false;
            getAllSnapshots(true, true).then(stateSnapshots => {
                stateSnapshots.map(item => {
                    if (item.id === nonAnonymousStateSnapshotId && item.userId) {
                        wasAdded = true;
                    }
                });

                expect(wasAdded).to.be.true;
                done();
            });
        });
    });

    it('should return list of snapshots for authorized user', (done) => {
        let cookie = request.cookie(`${TRACKER_COOKIE};${AUTH_COOKIE}`);
        let options = {
            url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}`,
            method: `GET`,
            headers: {
                Cookie: cookie
            }
        };

        request(options, (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            let parsedBody = JSON.parse(base64url.decode(body));

            let wasAdded = false;
            parsedBody.map(item => {
                if (item.id === nonAnonymousStateSnapshotId) {
                    wasAdded = true;
                }
            });

            expect(wasAdded).to.be.true;
            done();
        });
    });

    it('should fail to create state snapshot if snapshot data is missing', (done) => {
        let cookie = request.cookie(`${TRACKER_COOKIE}`);
        let options = {
            url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}`,
            method: `POST`,
            headers: {
                Cookie: cookie,
                'Content-type': 'text/plain'
            },
            body: base64url(JSON.stringify({a: '1'}))
        };

        request(options, (error, response, body) => {
            expect(JSON.parse(body).error).to.equal(`MISSING_DATA`);
            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it('should not be able to create anonymous state snapshot for unauthorized user', (done) => {
        let cookie = request.cookie(`${TRACKER_COOKIE}`);
        let options = {
            url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}`,
            method: `POST`,
            headers: {
                Cookie: cookie,
                'Content-type': 'text/plain'
            },
            body: base64url(JSON.stringify({
                        host: `https://example.com`,
                        database: `database`,
                        schema: `schema`,
                        snapshot: {
                            modules: [],
                            map: {
                                x: 1,
                                y: 2,
                                zoom: 3
                            }
                        }
                    }
                )
            )
        };

        request(options, (error, response, body) => {
            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it('should seize browser-owned state snapshot for authorized user', (done) => {
        let cookie = request.cookie(`${TRACKER_COOKIE};${AUTH_COOKIE}`);
        let options = {
            url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}/${anonymousStateSnapshotId}/seize`,
            method: `PUT`,
            headers: {
                Cookie: cookie,
                'Content-type': 'text/plain'
            },
            body: base64url(JSON.stringify({
                        host: `https://example.com`,
                        database: `database`,
                        schema: `schema`,
                        snapshot: {
                            modules: [],
                            map: {
                                x: 1,
                                y: 2,
                                zoom: 3
                            }
                        }
                    }
                )
            )
        };

        request(options, (error, response) => {
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.body).status).to.equal(`success`);
            let cookie = request.cookie(`${TRACKER_COOKIE};${AUTH_COOKIE}`);
            let options = {
                url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}`,
                method: `GET`,
                headers: {
                    Cookie: cookie
                }
            };

            request(options, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                parsedBody = JSON.parse(base64url.decode(body));

                let conditions = 0;
                parsedBody.map(item => {
                    if (item.id === anonymousStateSnapshotId) {
                        conditions++;
                    }

                    if (item.id === nonAnonymousStateSnapshotId) {
                        conditions++;
                    }
                });

                expect(conditions).to.equal(2);
                done();
            });
        });
    });

    it('should update browser-owned state snaphsot for owner', (done) => {
        let cookie = request.cookie(`${TRACKER_COOKIE}`);
        let options = {
            url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}`,
            method: `POST`,
            headers: {
                Cookie: cookie,
                'Content-type': 'text/plain'
            },
            json: true,
            body: base64url(JSON.stringify({
                        host: `https://example.com`,
                        database: `database`,
                        schema: `schema`,
                        anonymous: true,
                        title: `test`,
                        snapshot: {
                            modules: [],
                            map: {
                                x: 1,
                                y: 2,
                                zoom: 3
                            }
                        }
                    }
                )
            )
        };

        request(options, (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            let id = body.id;

            getAllSnapshots(true).then(stateSnapshots => {
                let foundItem = false;
                stateSnapshots.map(item => {
                    if (item.id === id) {
                        foundItem = item;
                    }
                });

                expect(foundItem !== false).to.equal(true);

                foundItem.title = `new test title`;
                foundItem.snapshot = {
                    modules: [],
                    map: {
                        x: 1,
                        y: 2,
                        zoom: 3
                    }
                }
                options = {
                    url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}/${foundItem.id}`,
                    method: `PUT`,
                    headers: {
                        Cookie: cookie,
                        'Content-type': 'text/plain'
                    },
                    body: base64url(JSON.stringify(foundItem))
                };

                request(options, (error, response) => {
                    expect(response.statusCode).to.equal(200);
                    getAllSnapshots(true).then(stateSnapshots => {
                        expect(response.statusCode).to.equal(200);

                        let foundItem = false;
                        stateSnapshots.map(item => {
                            if (item.id === id) {
                                foundItem = item;
                            }
                        });

                        expect(foundItem.title).to.be.equal(`new test title`);
                        done();
                    });
                });
            });
        });
    });

    it('should not update browser-owned state snaphsot for non-owner', (done) => {
        let body = {
            anonymous: true,
            title: `test`,
            host: `https://example.com`,
            database: `database`,
            schema: `schema`,
            snapshot: {
                modules: [],
                map: {
                    x: 1,
                    y: 2,
                    zoom: 3
                }
            }
        };

        let cookie = request.cookie(`${TRACKER_COOKIE}`);
        let options = {
            url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}`,
            method: `POST`,
            headers: {
                Cookie: cookie,
                'Content-type': 'text/plain'
            },
            body: base64url(JSON.stringify(body))
        };

        request(options, (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            let id = JSON.parse(body).id;

            getAllSnapshots(true).then(stateSnapshots => {
                expect(response.statusCode).to.equal(200);
                let foundItem = false;
                stateSnapshots.map(item => {
                    if (item.id === id) {
                        foundItem = item;
                    }
                });

                let failingCookie = request.cookie('vidi-state-tracker=1b0c07a6-2db0-49ad-860b-aa50c6488000');
                foundItem.title = `new test title`;
                foundItem.snapshot = {
                    modules: [],
                    map: {
                        x: 1,
                        y: 2,
                        zoom: 3
                    }
                }
                options = {
                    url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}/${foundItem.id}`,
                    method: `PUT`,
                    headers: {
                        Cookie: failingCookie,
                        'Content-type': 'text/plain'
                    },
                    json: true,
                    body: base64url(JSON.stringify(foundItem))
                };

                request(options, (error, response, body) => {
                    expect(response.body.error).to.equal(`ACCESS_DENIED`);
                    expect(response.statusCode).to.equal(400);
                    done();
                });
            });
        });
    });

    it('should delete browser-owned state snaphsot for owner', (done) => {
        let id = false;

        let cookie = request.cookie(`${TRACKER_COOKIE}`);
        let options = {
            url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}`,
            method: `POST`,
            headers: {
                Cookie: cookie,
                'Content-type': 'text/plain'
            },
            body: base64url(JSON.stringify({
                        host: `https://example.com`,
                        database: `database`,
                        schema: `schema`,
                        anonymous: true,
                        snapshot: {
                            modules: [],
                            map: {
                                x: 1,
                                y: 2,
                                zoom: 3
                            }
                        }
                    }
                )
            )
        };

        request(options, (error, response, body) => {
            expect(response.statusCode).to.equal(200);

            id = JSON.parse(body).id;

            let cookie = request.cookie(`${TRACKER_COOKIE}`);
            let options = {
                url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}/${id}`,
                method: `DELETE`,
                headers: {
                    Cookie: cookie
                }
            };

            request(options, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                let parsedBody = JSON.parse(body);
                expect(parsedBody.status).to.equal(`success`);

                let cookie = request.cookie(`${TRACKER_COOKIE}`);
                let options = {
                    url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}`,
                    method: `GET`,
                    headers: {
                        Cookie: cookie
                    }
                };

                request(options, (error, response, body) => {
                    expect(response.statusCode).to.equal(200);
                    parsedBody = JSON.parse(base64url.decode(body));

                    let wasFound = false;
                    parsedBody.map(item => {
                        if (item.id === nonAnonymousStateSnapshotId) {
                            wasFound = true;
                        }
                    });

                    expect(wasFound).to.be.false;
                    done();
                });
            });
        });
    });

    it('should not delete browser-owned state snaphsot for non-owner', (done) => {
        let cookie = request.cookie('vidi-state-tracker=INVALID-2db0-49ad-860b-aa50c64887f0');
        let options = {
            url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}/${anonymousStateSnapshotId}`,
            method: `DELETE`,
            headers: {
                Cookie: cookie
            }
        };

        request(options, (error, response, body) => {
            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it('should delete user-owned state snaphsot for owner', (done) => {
        let cookie = request.cookie(`${TRACKER_COOKIE};${AUTH_COOKIE}`);
        let options = {
            url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}/${nonAnonymousStateSnapshotId}`,
            method: `DELETE`,
            headers: {
                Cookie: cookie
            }
        };

        request(options, (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            let parsedBody = JSON.parse(body);
            expect(parsedBody.status).to.equal(`success`);

            let cookie = request.cookie(`${TRACKER_COOKIE};${AUTH_COOKIE}`);
            let options = {
                url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}`,
                method: `GET`,
                headers: {
                    Cookie: cookie
                }
            };

            request(options, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                parsedBody = JSON.parse(base64url.decode(body));

                let wasFound = false;
                parsedBody.map(item => {
                    if (item.id === nonAnonymousStateSnapshotId) {
                        wasFound = true;
                    }
                });

                expect(wasFound).to.be.false;
                done();
            });
        });
    });

    it('should not delete user-owned state snaphsot for non-owner', (done) => {
        let cookie = request.cookie(`${TRACKER_COOKIE}`);
        let options = {
            url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}/${nonAnonymousStateSnapshotId}`,
            method: `DELETE`,
            headers: {
                Cookie: cookie
            }
        };

        request(options, (error, response, body) => {
            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it('should generate token after creation and regenerate after update', (done) => {
        let cookie = request.cookie(`${TRACKER_COOKIE}`);

        let data = {
            host: `https://example.com`,
            database: `database`,
            schema: `schema`,
            anonymous: true,
            snapshot: {
                meta: {
                    config: `test.json`,
                    tmpl: `test.tmpl`
                },
                modules: [],
                map: {
                    x: 1,
                    y: 2,
                    zoom: 3
                }
            }
        };

        let options = {
            url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}`,
            method: `POST`,
            headers: {
                Cookie: cookie,
                'Content-type': 'text/plain'
            },
            body: base64url(JSON.stringify(data))
        };

        request(options, (error, response, body) => {
            const parsedBody = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(parsedBody.id.length > 0).to.equal(true);
            expect(parsedBody.token.length > 0).to.equal(true);

            let stateSnapshotId = parsedBody.id;

            let decodedToken = JSON.parse(Buffer.from(parsedBody.token, 'base64'));
            expect(decodedToken.config.length > 0).to.equal(true);
            expect(decodedToken.tmpl.length > 0).to.equal(true);

            data.snapshot.meta = {config: `test.json`};
            request({
                url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}/${stateSnapshotId}`,
                method: `PUT`,
                headers: {
                    Cookie: cookie,
                    'Content-type': 'text/plain'
                },
                body: base64url(JSON.stringify(data))
            }, (error, response) => {
                expect(response.statusCode).to.equal(200);
                request({
                    url: `${helpers.API_URL}/state-snapshots/${DATABASE_NAME}/${stateSnapshotId}`,
                    method: `GET`,
                    json: true,
                    headers: {Cookie: cookie},
                }, (error, response) => {
                    let decodedToken = JSON.parse(Buffer.from(parsedBody.token, 'base64'));
                    expect(decodedToken.config.length > 0).to.equal(true);
                    expect(decodedToken.tmpl.length > 0).to.equal(true);
                    done();
                });
            });
        });
    });
});
