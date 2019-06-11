'use strict';
describe('L.Handler.PathDrag', function () {
    var layer, p2ll;

    var drag = function (fromX, fromY, byX, byY, callback) {
        var hand = new Hand({
            timing: 'fastframe',
            onStop: callback});
        var mouse = hand.growFinger('mouse');
        mouse.moveTo(fromX, fromY, 0)
            .down().moveBy(byX, byY, 50).up();
    };

    before(function () {
        this.map = map;
        p2ll = function (x, y) {
            return map.layerPointToLatLng([x, y]);
        };
    });

    afterEach(function () {
        layer.remove();
    });


    it('should be off without option', function () {
        layer = L.polyline([
                [[43.1239, 1.244], [43.123, 1.253]],
                [[43.1269, 1.246], [43.126, 1.252], [43.1282, 1.255]]
            ]);
        assert.ok(layer.dragging);
        assert.notOk(layer.dragging.enabled());
    });

    it('should listen for draggable option', function () {
        layer = L.polyline([
                [[43.1239, 1.244], [43.123, 1.253]],
                [[43.1269, 1.246], [43.126, 1.252], [43.1282, 1.255]]
            ], {draggable: true}).addTo(this.map);
        assert.ok(layer.dragging);
        assert.ok(layer.dragging.enabled());
    });

    it('should drag a polyline', function (done) {
        var latlngs = [p2ll(100, 100), p2ll(100, 200)];
        layer = L.polyline(latlngs).addTo(this.map);
        var before = layer._latlngs[1].lat;
        layer.dragging.enable();
        assert.equal(before, layer._latlngs[1].lat);
        drag(100, 130, 10, 10, function () {
            assert.notEqual(before, layer._latlngs[1].lat);
            done();
        });
    });

    it('should update bounds of a polyline', function (done) {
        var latlngs = [p2ll(100, 100), p2ll(100, 200)];
        layer = L.polyline(latlngs).addTo(this.map);
        layer.dragging.enable();
        var oldLat = layer._bounds._southWest.lat;
        drag(100, 130, 20, 20, function () {
            // Prosthetic-hand run the onStop before the
            // dragend if sent.
            window.setTimeout(function () {
                assert.notEqual(oldLat, layer._bounds._southWest.lat);
                done();
            }, 10);
        });
    });

    it('should drag a multipolyline', function (done) {
        var latlngs = [
            [p2ll(100, 100), p2ll(100, 200)],
            [p2ll(300, 350), p2ll(350, 400), p2ll(400, 300)]
        ];
        layer = L.polyline(latlngs).addTo(this.map);
        var before = layer._latlngs[1][2].lat;
        layer.dragging.enable();
        assert.equal(before, layer._latlngs[1][2].lat);
        drag(100, 130, 10, 10, function () {
            assert.notEqual(before, layer._latlngs[1][2].lat);
            done();
        });
    });

    it('should drag a polygon', function (done) {
        var latlngs = [[p2ll(100, 150), p2ll(150, 200), p2ll(200, 100)]];
        layer = L.polygon(latlngs).addTo(this.map);
        var before = layer._latlngs[0][2].lat;
        layer.dragging.enable();
        assert.equal(before, layer._latlngs[0][2].lat);
        drag(150, 150, 20, 20, function () {
            assert.notEqual(before, layer._latlngs[0][2].lat);
            done();
        });
    });

    it('should drag a multipolygon with hole', function (done) {
        var latlngs = [
                [
                    [p2ll(100, 150), p2ll(150, 300), p2ll(300, 100)],
                    [p2ll(220, 160), p2ll(150, 170), p2ll(180, 220)]
                ],
                [[p2ll(300, 350), p2ll(350, 400), p2ll(400, 300)]]
            ];
        layer = L.polygon(latlngs).addTo(this.map);
        var before = layer._latlngs[1][0][2].lat;
        layer.dragging.enable();
        assert.equal(before, layer._latlngs[1][0][2].lat);
        drag(150, 150, 20, 20, function () {
            assert.notEqual(before, layer._latlngs[1][0][2].lat);
            done();
        });
    });

    it('should update bounds of a polygon', function (done) {
        var latlngs = [[p2ll(100, 150), p2ll(150, 200), p2ll(200, 100)]];
        layer = L.polygon(latlngs).addTo(this.map);
        layer.dragging.enable();
        var oldLat = layer._bounds._southWest.lat;
        drag(150, 150, 20, 20, function () {
            // Prosthetic-hand run the onStop before the
            // dragend if sent.
            window.setTimeout(function () {
                assert.notEqual(oldLat, layer._bounds._southWest.lat);
                done();
            }, 10);
        });
    });

    it('should drag a rectangle', function (done) {
        var latlngs = [p2ll(100, 100), p2ll(200, 200)];
        layer = L.rectangle(latlngs).addTo(this.map);
        var before = layer._latlngs[0][1].lat;
        layer.dragging.enable();
        assert.equal(before, layer._latlngs[0][1].lat);
        drag(100, 130, 20, 20, function () {
            assert.notEqual(before, layer._latlngs[0][1].lat);
            done();
        });
    });

    it('should update bounds of a rectangle', function (done) {
        var latlngs = [p2ll(100, 100), p2ll(200, 200)];
        layer = L.rectangle(latlngs).addTo(this.map);
        layer.dragging.enable();
        var oldLat = layer._bounds._southWest.lat;
        drag(100, 130, 20, 20, function () {
            // Prosthetic-hand run the onStop before the
            // dragend if sent.
            window.setTimeout(function () {
                assert.notEqual(oldLat, layer._bounds._southWest.lat);
                done();
            }, 10);
        });
    });

    it('should drag a circle', function (done) {
        layer = L.circle(p2ll(200, 200), {radius: 50}).addTo(this.map);
        var before = layer._latlng.lat;
        layer.dragging.enable();
        assert.equal(before, layer._latlng.lat);
        drag(210, 210, 10, 10, function () {
            assert.notEqual(before, layer._latlng.lat);
            done();
        });
    });

    it('should send dragstart event', function (done) {
        var latlngs = [p2ll(100, 100), p2ll(100, 200)],
            called = 0,
            call = function () {called++;};
        layer = L.polyline(latlngs).addTo(this.map);
        layer.on('dragstart', call);
        layer.dragging.enable();
        assert.equal(called, 0);
        drag(100, 130, 20, 20, function () {
            assert.equal(called, 1);
            done();
        });
    });

    it('should send dragend event', function (done) {
        var latlngs = [p2ll(100, 100), p2ll(100, 200)],
            called = 0,
            call = function () {called++;};
        layer = L.polyline(latlngs).addTo(this.map);
        layer.on('dragend', call);
        layer.dragging.enable();
        assert.equal(called, 0);
        drag(100, 130, 20, 20, function () {
            // Prosthetic-hand run the onStop before the
            // dragend if sent.
            window.setTimeout(function () {
                assert.equal(called, 1);
                done();
            }, 10);
        });
    });

    it('should send drag event', function (done) {
        var latlngs = [p2ll(100, 100), p2ll(100, 200)],
            called = 0,
            call = function () {called++;};
        layer = L.polyline(latlngs).addTo(this.map);
        layer.on('drag', call);
        layer.dragging.enable();
        assert.notOk(called);
        drag(100, 130, 20, 20, function () {
            assert.equal(called, 1);
            done();
        });
    });

});
