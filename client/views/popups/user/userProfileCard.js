Template.userProfileCard.helpers({
    'statsReady': function () {
        var instance = Template.instance();
        return instance.starsReceivedCountSubscription.ready() &&
            instance.starsGivenCountSubscription.ready() &&
            instance.messagesSentCountSubscription.ready();
    }
});

Template.userProfileCard.created = function () {
    if(this.data) {
        this.starsReceivedCountSubscription = Meteor.subscribe('starsReceivedCount', this.data);
        this.starsGivenCountSubscription = Meteor.subscribe('starsGivenCount', this.data);
        this.messagesSentCountSubscription = Meteor.subscribe('messagesSentCount', this.data);
    }
};
Template.userProfileCard.destroyed = function () {
    if (this.starsReceivedCountSubscription) {
        this.starsReceivedCountSubscription.stop();
        console.log('destroyed');
    }
    if (this.starsGivenCountSubscription) {
        this.starsGivenCountSubscription.stop();
    }
    if (this.messagesSentCountSubscription) {
        this.messagesSentCountSubscription.stop();
    }
};
