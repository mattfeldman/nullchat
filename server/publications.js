Meteor.publish('messages', function() {
    return Messages.find();
});
