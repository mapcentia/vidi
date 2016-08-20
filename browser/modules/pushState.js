var meta;
var anchor;
var first = true;
var t;
module.exports = module.exports = {
    set: function (o) {
        meta = o.meta;
        anchor = o.anchor;
        return this;
    },
    init: function () {
        // We don't set any state until 1 secs after the first request. This way CartoDB layers becomes ready.
        t = first ? 1000 : 0;
        setTimeout(function () {
            //console.log("State push");
            history.pushState(null, null, anchor.init());
            first = false;
        }, t);
    }
};