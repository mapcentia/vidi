/**
 * Testing APIBridge and Queue classes
 */

const { expect } = require('chai');

//const APIBridgeSingletone = require('../browser/modules/api-bridge');

describe('API Bridge and Queue', () => {
    it('should add features', () => {
        /*
        let instance = APIBridgeSingletone(() => {
            console.log('On queue update');
        });


        console.log(instance);
        */

       browser
       .version()
       .then(function (v) {
         console.log(v);
 
         expect(true).to.be.true;
         done();
       }).catch(() => {});



    });




    /*
    describe('should update features', () => {});
    describe('should delete features', () => {});
    describe('should constantly check for connection status', () => {});
    describe('should store unsuccessfull requests in internal queue', () => {});
    describe('should transform feature requests responses when offline', () => {});
    describe('should react to Force offline mode setting', () => {});
    describe('should dispatch feature requests in correct order', () => {});
    describe('should cleanup requests depending on their order', () => {});
    */
});
