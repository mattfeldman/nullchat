Template.memeModal.helpers({
    'ready': function () {
        return Template.instance().memesSubscription.ready();
    }
});

Template.memeModal.created = function () {
    var instance = this;
    instance.memesSubscription = Meteor.subscribe('memes');
};

Template.memeModal.destroyed = function () {
    var instance = this;
    if (instance.memesSubscription) {
        instance.memesSubscription.stop();
    }
};

