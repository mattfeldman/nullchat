Template.changelogButton.onCreated(function () {
    this.subscribe("changelogs");
    this.subscribe("myCursors", {
        onReady: function () {
            var user = Meteor.users.findOne({_id: Meteor.userId()}, {fields: {'cursors.changelog': 1}});
            if (user && (!user.cursors || !user.cursors.changelog)) {
                Meteor.call('updateChangelogCursor');
            }
        }
    });
});

Template.changelogButton.events({
    'click .changelogButton': function (event, template) {
        event.preventDefault();
        showModal("changelogModal");
        Meteor.call('updateChangelogCursor');
    }
});

Template.changelogButton.helpers({
    'unreadCount': function () {
        var user = Meteor.users.findOne({_id: Meteor.userId()}, {fields: {'cursors.changelog': 1}});
        var cursor = (user && user.cursors && user.cursors.changelog) || 0;
        var count = Changelogs.find({timestamp: {$gt: cursor}}).count();
        return count ? count : false;
    },
});

Template.changelogButton.destroyed = function () {
    var self = this;
    if (self.changelogSubscription) {
        self.changelogSubscription.stop();
        self.cursorSubscription.stop();
    }
};