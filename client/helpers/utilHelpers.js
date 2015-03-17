Template.registerHelper('timeago', function (datetime) {
    var m = moment(datetime);
    return m.fromNow();
});

Template.registerHelper('md', function (message) {
    return marked(message);
});

Template.registerHelper('debugDisplay',function(){
    return Session.get("debugDisplay") || false;
});