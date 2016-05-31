var cloud;
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        return this;
    },
    init: function () {
        cloud.map.addControl(L.control.print({
            provider: L.print.provider({
                capabilities: window.printConfig,
                method: 'POST',
                dpi: 127,
                outputFormat: 'pdf',
                proxy: 'http://eu1.mapcentia.com/cgi/proxy.cgi?url=',
                customParams: window.gc2Options.customPrintParams
            }),
            position: 'topright'
        }));
    }
};