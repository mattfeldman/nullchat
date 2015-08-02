Template.changelogButton.onCreated(function () {
    this.subscribe("changelogs");
    this.subscribe("myCursors", {
        onReady() {
            const user = Meteor.users.findOne({_id: Meteor.userId()}, {fields: {'cursors.changelog': 1}});
            if (user && (!user.cursors || !user.cursors.changelog)) {
                Meteor.call('updateChangelogCursor');
            }
        }
    });
});

Template.changelogButton.events({
    'click .changelogButton'(event, template) {
        event.preventDefault();
        Client.showModal("changelogModal");
        Meteor.call('updateChangelogCursor');
    }
});

Template.changelogButton.helpers({
    unreadCount() {
        const user = Meteor.users.findOne({_id: Meteor.userId()}, {fields: {'cursors.changelog': 1}});
        const cursor = (user && user.cursors && user.cursors.changelog) || 0;
        const count = Changelogs.find({timestamp: {$gt: cursor}}).count();
        return count ? count : false;
    }
});

Template.changelogButton.onDestroyed(function () {
    const self = this;
    if (self.changelogSubscription) {
        self.changelogSubscription.stop();
        self.cursorSubscription.stop();
    }
});
