Template.registerHelper('timeago', function (datetime) {
    var m = moment(datetime);
    return m.fromNow();
});

Template.registerHelper('md', function (message) {
    return marked(message);
});