Template.messageContext.onCreated(function () {
    this.subscribe('message', this.data.messageId);
    this.subscribe('messageContextAbove', this.data.messageId);
    this.subscribe('messageContextBelow', this.data.messageId);
});

Template.messageContext.helpers({
    'messages': function () {
        return Messages.find({}, {sort: {timestamp: 1}});
    }
});