/**
 * Testing State snaphsots API
 */

const { expect } = require(`chai`);
const fs = require(`fs`);
const request = require(`request`);
const helpers = require(`./../helpers`);

const AUTH_COOKIE = `connect.gc2=s%3AedCHvnfxO2bcw2DGrxFCGx4sKVARTP_5.NGUmXPayGCfzD6Yr1PnloGj5OM84oR7IkqhaIGPjBEM`;
const TRACKER_COOKIE = `vidi-state-tracker=1b0c07a6-2db0-49ad-860b-aa50c64887f0`;

let anonymousStateSnapshotId = false;
let nonAnonymousStateSnapshotId = false;

describe('State snapshot management API', () => {
    it('should fail if browser does not have a tracker cookie and user is not authorized', (done) => {
        request(`${helpers.API_URL}/state-snapshots`, (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            let parsedBody = JSON.parse(body);
            expect(parsedBody.length).to.equal(0);
            done();
        });
    });

    it('should be able to create anonymous state snapshot for unauthorized user', (done) => {
        let cookie = request.cookie(`${TRACKER_COOKIE}`);
        let options = {
            url: `${helpers.API_URL}/state-snapshots`,
            method: `POST`,
            headers: { Cookie: cookie },
            json: true,
            body: {
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
        };

        request(options, (error, response, body) => {
            expect(response.statusCode).to.equal(200);

            anonymousStateSnapshotId = response.body.id;

            options = {
                url: `${helpers.API_URL}/state-snapshots`,
                method: `GET`,
                headers: { Cookie: cookie },
            };

            request(options, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                parsedBody = JSON.parse(body);

                let wasAdded = false;
                parsedBody.map(item => {
                    if (item.id === anonymousStateSnapshotId && item.anonymous) {
                        wasAdded = true;
                    }
                });

                expect(wasAdded).to.be.true;
                done();
            });
        });
    });

    it('should return list of snapshots for unauthorized user', (done) => {
        let cookie = request.cookie(`${TRACKER_COOKIE}`);
        let options = {
            url: `${helpers.API_URL}/state-snapshots`,
            method: `GET`,
            headers: {
                Cookie: cookie
            }
        };

        request(options, (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            let parsedBody = JSON.parse(body);

            let wasAdded = false;
            parsedBody.map(item => {
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
            url: `${helpers.API_URL}/state-snapshots`,
            method: `POST`,
            headers: { Cookie: cookie },
            json: true,
            body: {
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
        };

        request(options, (error, response, body) => {
            expect(response.statusCode).to.equal(200);

            nonAnonymousStateSnapshotId = response.body.id;

            options = {
                url: `${helpers.API_URL}/state-snapshots`,
                method: `GET`,
                headers: { Cookie: cookie },
            };

            request(options, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                parsedBody = JSON.parse(body);

                let wasAdded = false;
                parsedBody.map(item => {
                    if (item.id === nonAnonymousStateSnapshotId && item.anonymous === false) {
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
            url: `${helpers.API_URL}/state-snapshots`,
            method: `GET`,
            headers: {
                Cookie: cookie
            }
        };

        request(options, (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            let parsedBody = JSON.parse(body);

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
            url: `${helpers.API_URL}/state-snapshots`,
            method: `POST`,
            headers: { Cookie: cookie },
            json: true,
            body: {a: '1'}
        };

        request(options, (error, response, body) => {
            expect(response.body.error).to.equal(`MISSING_DATA`);
            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it('should not be able to create anonymous state snapshot for unauthorized user', (done) => {
        let cookie = request.cookie(`${TRACKER_COOKIE}`);
        let options = {
            url: `${helpers.API_URL}/state-snapshots`,
            method: `POST`,
            headers: { Cookie: cookie },
            json: true,
            body: {
                snapshot: {
                    modules: [],
                    map: {
                        x: 1,
                        y: 2,
                        zoom: 3
                    }
                }
            }
        };

        request(options, (error, response, body) => {
            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it('should seize browser-owned state snapshot for authorized user', (done) => {
        let cookie = request.cookie(`${TRACKER_COOKIE};${AUTH_COOKIE}`);
        let options = {
            url: `${helpers.API_URL}/state-snapshots/${anonymousStateSnapshotId}`,
            method: `PUT`,
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
                url: `${helpers.API_URL}/state-snapshots`,
                method: `GET`,
                headers: {
                    Cookie: cookie
                }
            };

            request(options, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                parsedBody = JSON.parse(body);

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
        let id = false;

        let body = {
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
        };

        let cookie = request.cookie(`${TRACKER_COOKIE}`);
        let options = {
            url: `${helpers.API_URL}/state-snapshots`,
            method: `POST`,
            headers: { Cookie: cookie },
            json: true,
            body
        };

        request(options, (error, response, body) => {
            expect(response.statusCode).to.equal(200);

            let id = response.body.id;
            let getOptions = {
                url: `${helpers.API_URL}/state-snapshots`,
                method: `GET`,
                headers: {
                    Cookie: cookie
                }
            };

            request(getOptions, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                parsedBody = JSON.parse(body);

                let foundItem = false;
                parsedBody.map(item => {
                    if (item.id === id) {
                        foundItem = item;
                    }
                });

                foundItem.title = `new test title`;
                options = {
                    url: `${helpers.API_URL}/state-snapshots`,
                    method: `PUT`,
                    json: true,
                    headers: { Cookie: cookie },
                    body: foundItem
                };

                request(options, (error, response, body) => {
                    expect(response.statusCode).to.equal(200);

                    request(getOptions, (error, response, body) => {
                        expect(response.statusCode).to.equal(200);
                        parsedBody = JSON.parse(body);
        
                        let foundItem = false;
                        parsedBody.map(item => {
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
        let id = false;

        let body = {
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
        };

        let cookie = request.cookie(`${TRACKER_COOKIE}`);
        let options = {
            url: `${helpers.API_URL}/state-snapshots`,
            method: `POST`,
            headers: { Cookie: cookie },
            json: true,
            body
        };

        request(options, (error, response, body) => {
            expect(response.statusCode).to.equal(200);

            let id = response.body.id;

            let cookie = request.cookie(`${TRACKER_COOKIE}`);
            let getOptions = {
                url: `${helpers.API_URL}/state-snapshots`,
                method: `GET`,
                headers: {
                    Cookie: cookie
                }
            };

            request(getOptions, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                parsedBody = JSON.parse(body);

                let foundItem = false;
                parsedBody.map(item => {
                    if (item.id === id) {
                        foundItem = item;
                    }
                });

                let failingCookie = request.cookie('vidi-state-tracker=1b0c07a6-2db0-49ad-860b-aa50c6488000');
                foundItem.title = `new test title`;
                options = {
                    url: `${helpers.API_URL}/state-snapshots`,
                    method: `PUT`,
                    headers: { Cookie: failingCookie },
                    json: true,
                    body: foundItem
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
            url: `${helpers.API_URL}/state-snapshots`,
            method: `POST`,
            headers: { Cookie: cookie },
            json: true,
            body: {
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
        };

        request(options, (error, response, body) => {
            expect(response.statusCode).to.equal(200);

            id = response.body.id;

            let cookie = request.cookie(`${TRACKER_COOKIE}`);
            let options = {
                url: `${helpers.API_URL}/state-snapshots/${id}`,
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
                    url: `${helpers.API_URL}/state-snapshots`,
                    method: `GET`,
                    headers: {
                        Cookie: cookie
                    }
                };

                request(options, (error, response, body) => {
                    expect(response.statusCode).to.equal(200);
                    parsedBody = JSON.parse(body);

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
            url: `${helpers.API_URL}/state-snapshots/${anonymousStateSnapshotId}`,
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
            url: `${helpers.API_URL}/state-snapshots/${nonAnonymousStateSnapshotId}`,
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
                url: `${helpers.API_URL}/state-snapshots`,
                method: `GET`,
                headers: {
                    Cookie: cookie
                }
            };

            request(options, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                parsedBody = JSON.parse(body);

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
        let cookie = request.cookie(`${TRACKER_COOKIE};${AUTH_COOKIE}`);
        let options = {
            url: `${helpers.API_URL}/state-snapshots/${nonAnonymousStateSnapshotId}`,
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
});
