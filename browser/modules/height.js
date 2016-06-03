module.exports = function () {
    var max = $(document).height() - $('.tab-pane').offset().top - 70;
    return {
        max: max
    }
};