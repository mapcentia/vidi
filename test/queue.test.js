/**
 * Testing Queue class
 */

const { expect } = require('chai');
const util = require('util');
const Queue = require('./../browser/modules/api-bridge/Queue');
const helpers = require('./helpers');

// Dummy request
const dummyRequest = {
	type: Queue.ADD_REQUEST,
	meta: {
		f_table_name: 'table',
		f_table_schema: 'schema',
		f_geometry_column: 'the_geom'
	},
	feature: {
		features: [{
			properties: {
				gid: -1,
				id: '1',
				name: 'test'
			},
			geometry: {}
		}]
	}
};

// Mocks
const localforageMock = {
	getItem: (data, callback) => {
		callback(false, false);
	},
	setItem: () => {}
};
global.localforage = localforageMock;

const jQueryAJAXMock = () => {
	return {
		done: (callback) => {
			callback(null, null, { statusText: 'ONLINE' });

			return {
				always: (callback) => {
					callback();
				}
			}
		}
	}
};
global.$ = {};
global.$.ajax = jQueryAJAXMock;

describe("Queue", () => {
    it("throws an Error if no processor() is specified", async () => {
        try {
            let queue = new Queue();
        } catch(e) {
            expect(e.message.indexOf('No processor for queue was specified')).to.equal(0);
        }
	});

    it("restores its previous state upon startup", async () => {
		let queueWasRestoredOnStartup = false;
		global.localforage = {
			getItem: () => {
				queueWasRestoredOnStartup = true;
			},
			setItem: () => {}
		};

		let queue = new Queue((oldestNonSkippedItem, queueInstance) => {
			let result = new Promise((resolve, reject) => { reject(); });
			return result;
		});

		// Checking if queue restores itself on initialization
		global.localforage = localforageMock;
		expect(queueWasRestoredOnStartup).to.be.true;
		queue.terminate();
	});


    it("removes items by layer identifier", async () => {
		let queue = new Queue((oldestNonSkippedItem, queueInstance) => {
			let result = new Promise((resolve, reject) => { reject(); });
			return result;
		});

		// Adding add feature request
		queue.pushAndProcess(helpers.duplicate(dummyRequest));

		await helpers.sleep(1000);

		expect(queue.getItems().length).to.equal(1);
		queue.removeByLayerId('another_schema.table');
		expect(queue.getItems().length).to.equal(1);
		queue.removeByLayerId('schema.table');
		expect(queue.getItems().length).to.equal(0);
		queue.terminate();
	});

    it("removes items by their gids", async () => {
		let queue = new Queue((oldestNonSkippedItem, queueInstance) => {
			let result = new Promise((resolve, reject) => { reject(); });
			return result;
		});

		// Adding add feature request
		let firstItem = helpers.duplicate(dummyRequest);
		firstItem.type = Queue.ADD_REQUEST;
		firstItem.feature.features[0].properties.gid = -1;
		queue.pushAndProcess(firstItem);

		await helpers.sleep(1000);

		// Adding update feature request
		let secondItem = helpers.duplicate(dummyRequest);
		secondItem.type = Queue.UPDATE_REQUEST;
		secondItem.feature.features[0].properties.gid = 1;
		queue.pushAndProcess(secondItem);

		expect(queue.getItems().length).to.equal(2);
		queue.removeByGID([1, -1]);
		expect(queue.getItems().length).to.equal(0);
		queue.terminate();
	});

    it("replaces gids for items", async () => {
		let queue = new Queue((oldestNonSkippedItem, queueInstance) => {
			let result = new Promise((resolve, reject) => { reject(); });
			return result;
		});

		// Adding add feature request
		queue.pushAndProcess(helpers.duplicate(dummyRequest));

		await helpers.sleep(1000);

		expect(queue.getItems().length).to.equal(1);
		expect(queue.getItems()[0].feature.features[0].properties.gid).to.equal(-1);
		queue.replaceVirtualGid(-1, 1);
		expect(queue.getItems()[0].feature.features[0].properties.gid).to.equal(1);
		queue.terminate();
	});

    it("resubmits previously skipped requests", async () => {
		let queue = new Queue((oldestNonSkippedItem, queueInstance) => {
			let result = new Promise((resolve, reject) => {
				reject({
					rejectedByServer: true,
					serverErrorMessage: 'Test rejection message'
				});
			});

			return result;
		});

		// Adding add feature request
		queue.pushAndProcess(helpers.duplicate(dummyRequest));

		await helpers.sleep(1000);

		expect(queue.getItems().length).to.equal(1);
		expect(queue.getItems()[0].skip).to.equal(true);
		expect(queue.getItems()[0].serverErrorMessage).to.equal('Test rejection message');
		queue.terminate();
	});

    describe("reports", () => {
        it("whenever app goes online or offline", async () => {
            let queue = new Queue((oldestNonSkippedItem, queueInstance) => {
				let result = new Promise((resolve, reject) => {
					reject();
				});

				return result;
			});

			let onlineStateDetected = false;
			let offlineStateDetected = false;
			queue.setOnUpdate((statistics) => {
				if (statistics.online) {
					onlineStateDetected = true;
				} else {
					offlineStateDetected = true;
				}
			});

			// Simulating that service worker detects the offline state
			global.$.ajax = () => {
				return {
					done: (callback) => {
						callback(null, null, { statusText: 'OFFLINE' });
						return {
							always: (callback) => {
								callback();
							}
						}
					}
				}
			};

			await helpers.sleep(4000);

			global.$.ajax = () => {
				return {
					done: (callback) => {
						callback(null, null, { statusText: 'ONLINE' });
						return {
							always: (callback) => {
								callback();
							}
						}
					}
				}
			};

			await helpers.sleep(4000);

			expect(onlineStateDetected && offlineStateDetected).to.be.true;

			global.$ = {};
			global.$.ajax = jQueryAJAXMock;
			queue.terminate();
		});
	});

    describe("merges", () => {
        it("existing feature creation request and added update feature request", async () => {
            let queue = new Queue((oldestNonSkippedItem, queueInstance) => {
				let result = new Promise((resolve, reject) => {
					reject();
				});

				return result;
            });

	    	// Adding add feature request
            queue.pushAndProcess(helpers.duplicate(dummyRequest));

            await helpers.sleep(1000);

            expect(queue.getItems().length).to.equal(1);
			expect(queue.getItems()[0].feature.features[0].properties.gid).to.equal(-1);

			// Adding update feature request
			let updateRequest = helpers.duplicate(dummyRequest);
			updateRequest.type = Queue.UPDATE_REQUEST;
			updateRequest.feature.features[0].properties.name = 'test_test_test';

			queue.pushAndProcess(updateRequest);

			await helpers.sleep(1000);

			expect(queue.getItems().length).to.equal(1);
			expect(queue.getItems()[0].type).to.equal(Queue.ADD_REQUEST);
			expect(queue.getItems()[0].feature.features[0].properties.name).to.equal('test_test_test');
			queue.terminate();
		});
		
        it("existing feature update request and added update feature request", async () => {
            let queue = new Queue((oldestNonSkippedItem, queueInstance) => {
				let result = new Promise((resolve, reject) => {
					reject();
				});

				return result;
            });

			// Adding update feature request
			let existingUpdateRequest = helpers.duplicate(dummyRequest);
			existingUpdateRequest.type = Queue.UPDATE_REQUEST;
			existingUpdateRequest.feature.features[0].properties.gid = 1;
            queue.pushAndProcess(existingUpdateRequest);

            await helpers.sleep(1000);

            expect(queue.getItems().length).to.equal(1);
			expect(queue.getItems()[0].feature.features[0].properties.gid).to.equal(1);

			// Adding update feature request
			let updateRequest = helpers.duplicate(dummyRequest);
			updateRequest.type = Queue.UPDATE_REQUEST;
			updateRequest.feature.features[0].properties.gid = 1;
			updateRequest.feature.features[0].properties.name = 'test_test_test';

			queue.pushAndProcess(updateRequest);

			await helpers.sleep(1000);

			expect(queue.getItems().length).to.equal(1);
			expect(queue.getItems()[0].type).to.equal(Queue.UPDATE_REQUEST);
			expect(queue.getItems()[0].feature.features[0].properties.name).to.equal('test_test_test');
			queue.terminate();
		});
		
        it("existing feature creation request and added delete feature request", async () => {
            let queue = new Queue((oldestNonSkippedItem, queueInstance) => {
				let result = new Promise((resolve, reject) => {
					reject();
				});

				return result;
            });

	    	// Adding add feature request
            queue.pushAndProcess(helpers.duplicate(dummyRequest));

            await helpers.sleep(1000);

			// Adding delete feature request
			let deleteRequest = helpers.duplicate(dummyRequest);
			deleteRequest.type = Queue.DELETE_REQUEST;
			queue.pushAndProcess(deleteRequest);

			await helpers.sleep(1000);

			expect(queue.getItems().length).to.equal(0);
			queue.terminate();
		});

        it("existing feature update request and added delete feature request", async () => {
            let queue = new Queue((oldestNonSkippedItem, queueInstance) => {
				let result = new Promise((resolve, reject) => {
					reject();
				});

				return result;
            });

			// Adding update feature request
			let existingUpdateRequest = helpers.duplicate(dummyRequest);
			existingUpdateRequest.type = Queue.UPDATE_REQUEST;
			existingUpdateRequest.feature.features[0].properties.gid = 1;
            queue.pushAndProcess(existingUpdateRequest);

            await helpers.sleep(1000);

			// Adding delete feature request
			let deleteRequest = helpers.duplicate(dummyRequest);
			deleteRequest.type = Queue.DELETE_REQUEST;
			deleteRequest.feature.features[0].properties.gid = 1;
			queue.pushAndProcess(deleteRequest);

			await helpers.sleep(1000);

			expect(queue.getItems().length).to.equal(1);
			expect(queue.getItems()[0].type).to.equal(Queue.DELETE_REQUEST);
			queue.terminate();
		});
	});
});
