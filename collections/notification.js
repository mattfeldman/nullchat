Notifications = new Meteor.Collection('notifications');

Meteor.methods({
    'setSeen': function (roomId) {
        var user = Meteor.user();
        Notifications.update({seen: false, userId: user._id, roomId: roomId}, {$set: {seen: true}}, {multi: true});
    }
});
