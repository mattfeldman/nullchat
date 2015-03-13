Template.changelogModalContent.helpers({
    'changelogs': function () {
        return Changelogs.find({}, {sort: {timestamp: -1}});
    }
});

Template.changelogModalContent.created = function () {
    var self = this;
    self.changelogSubscription = Meteor.subscribe("changelogs");
};

Template.changelogModalContent.destroyed = function () {
    var self = this;
    if (self.changelogSubscription) {
        self.changelogSubscription.stop();
    }
};