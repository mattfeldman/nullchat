Template.starsModal.helpers({
    'ready': function () {
        return Template.instance().starsSubscription.ready();
    }
});

Template.starsModal.created = function () {
    var instance = this;
    instance.starsSubscription = Meteor.subscribe('starredMessages');
};

Template.starsModal.destroyed = function () {
    var instance = this;
    if (instance.starsSubscription) {
        instance.starsSubscription.stop();
    }
};

