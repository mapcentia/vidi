module.exports = function () {
    var max = $(document).height() - $('.tab-pane').offset().top;
    return {
        max: max
    }
};