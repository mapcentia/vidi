/**
 * Testing Session extension
 */

const { expect } = require(`chai`);
const fs = require(`fs`);
const request = require(`request`);
const helpers = require(`./../helpers`);

const sampleData = `[{
	"anonymous": "true",
	"snapshot": {
		"modules": {
			"layerTree": {
				"order": [{
					"id": "Dar es Salaam Land Use and Informal Settlement Data Set",
					"layers": [{
						"id": "public.urbanspatial_dar_es_salaam_luse_2002"
					}, {
						"id": "public.roads"
					}]
				}, {
					"id": "Test group",
					"layers": [{
						"id": "public.test"
					}, {
						"id": "public.test_line"
					}]
				}]
			}
		},
		"map": {
			"baseLayer": "osm",
			"zoom": "13",
			"x": "39.2963",
			"y": "-6.8335"
		}
	},
	"id": "1fec93be6db36996fdf7bd44f989a6950e4ef5bc",
	"created_at": "2018-06-27T07:45:22.673Z",
	"browserId": "1b0c07a6-2db0-49ad-860b-aa50c64887f0"
}, {
	"anonymous": "false",
	"snapshot": {
		"modules": {
			"layerTree": {
				"order": [{
					"id": "Dar es Salaam Land Use and Informal Settlement Data Set",
					"layers": [{
						"id": "public.urbanspatial_dar_es_salaam_luse_2002"
					}, {
						"id": "public.roads"
					}]
				}, {
					"id": "Test group",
					"layers": [{
						"id": "public.test"
					}, {
						"id": "public.test_line"
					}]
				}]
			}
		},
		"map": {
			"baseLayer": "stamenTonerLite",
			"zoom": "13",
			"x": "39.2963",
			"y": "-6.8335"
		}
	},
	"id": "1e2bca05bec5833a693dc4378026c74377d214a2",
	"created_at": "2018-06-27T07:45:24.945Z",
	"userId": 100
}]`;

describe('State snapshot management API', () => {
    it('should fail if browser does not have a tracker cookie and user is not authorized', async () => {
        fs.writeFileSync('./temporary-state-storage.json', sampleData);
        request(`${helpers.API_URL}/state-snapshots`, (error, response, body) => {
            expect(response.statusCode).to.equal(400);
            let parsedBody = JSON.parse(body);
            expect(parsedBody.error).to.equal(`NO_BROWSER_OR_USER_ID`);
        });
    });

    it('should return list of snapshots for unauthorized user', async () => {
        fs.writeFileSync('./temporary-state-storage.json', sampleData);

        let localRequest = request.defaults({jar: true})
        localRequest.cookie('vidi-state-tracker=1b0c07a6-2db0-49ad-860b-aa50c64887f0');
        localRequest(`${helpers.API_URL}/state-snapshots`, (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            let parsedBody = JSON.parse(body);
            expect(parsedBody.length).to.equal(1);
        });
    });

    it('should return list of snapshots for authorized user', async () => {
        fs.writeFileSync('./temporary-state-storage.json', sampleData);

        let localRequest = request.defaults({jar: true})
        localRequest.cookie('vidi-state-tracker=1b0c07a6-2db0-49ad-860b-aa50c64887f0');
        localRequest.cookie('connect.gc2=s%3AedCHvnfxO2bcw2DGrxFCGx4sKVARTP_5.NGUmXPayGCfzD6Yr1PnloGj5OM84oR7IkqhaIGPjBEM');
        localRequest(`${helpers.API_URL}/state-snapshots`, (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            let parsedBody = JSON.parse(body);
            expect(parsedBody.length).to.equal(2);
        });
    });

    it('should seize local state snapshot for authorized user', async () => {
        fs.writeFileSync('./temporary-state-storage.json', sampleData);

        let localRequest = request.defaults({jar: true})
        localRequest.cookie('vidi-state-tracker=1b0c07a6-2db0-49ad-860b-aa50c64887f0');
        localRequest.cookie('connect.gc2=s%3AedCHvnfxO2bcw2DGrxFCGx4sKVARTP_5.NGUmXPayGCfzD6Yr1PnloGj5OM84oR7IkqhaIGPjBEM');
        localRequest.put(`${helpers.API_URL}/state-snapshots/1fec93be6db36996fdf7bd44f989a6950e4ef5bc`, (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            let parsedBody = JSON.parse(body);
            expect(parsedBody.status).to.equal(`success`);

            localRequest(`${helpers.API_URL}/state-snapshots`, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                parsedBody = JSON.parse(body);
                expect(parsedBody[0].userId.length > 0).to.be.true;
                expect(parsedBody[1].userId.length > 0).to.be.true;
            });
        });
    });
});
