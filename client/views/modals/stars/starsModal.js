Template.starsModal.onCreated(function () {
    this.subscribe('starredMessages');
});

Template.starsModal.helpers({
    'ready': function () {
        return Template.instance().starsSubscription.ready();
    }
});

