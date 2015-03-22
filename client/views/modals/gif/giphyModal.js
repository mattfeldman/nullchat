Template.giphyModal.helpers({
    'ready': function () {
        return Template.instance().starsSubscription.ready();
    }
});

Template.giphyModal.created = function () {
    var instance = this;
    instance.starsSubscription = Meteor.subscribe('starredMessages');
};

Template.giphyModal.destroyed = function () {
    var instance = this;
    if (instance.starsSubscription) {
        instance.starsSubscription.stop();
    }
};

