UtilHelpers = {
    timeago(datetime) {
        return moment(datetime).fromNow();
    },
    md(message) {
        return marked(message);
    },
    debugDisplay() {
        return Session.get("debugDisplay") || false;
    },
    inSmallView() {
        return rwindow.$width() <= 768;
    },
    emojiDisplay(emoji) {
        return emojione.toImage(emoji);
    }
};
Template.registerHelper('timeago', UtilHelpers.timeago);
Template.registerHelper('md', UtilHelpers.timeago);
Template.registerHelper('debugDisplay', UtilHelpers.debugDisplay);
Template.registerHelper('inSmallView', UtilHelpers.inSmallView);
Template.registerHelper('emojiDisplay', UtilHelpers.emojiDisplay);
