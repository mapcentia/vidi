module.exports = {
    set: function (o) {

    },

    init: function () {
        let store = new geocloud.sqlStore({
            jsonp: false,
            method: "POST",
            host: "",
            db: "mydb",
            uri: "/api/sql/nocache",
            id: "1",
            base64: true,
            sql: "SELECT 'test' as test",
            onLoad: () => {
                console.log(store.geoJSON);
            }
        });

        setTimeout(() => {
            store.load()
        }, 1000)

    }
};