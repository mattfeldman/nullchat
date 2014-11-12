Meteor.publish('messages', function (roomId, limit) {
    return Messages.find({roomId: roomId, type: {$ne: 'feedback'}}, {limit: limit, sort: {timestamp: -1}}); //TODO: Figure out how to secure this from publishing Messages a user should not see
});
Meteor.publish('feedbackMessages', function (roomId, limit) {
    return Messages.find({roomId: roomId, type: 'feedback', userId: this.userId}, {
        limit: limit,
        sort: {timestamp: -1}
    });
});
Meteor.publish('currentRooms', function () {
    return Rooms.find({users: this.userId});//
});
Meteor.publish('availableRooms', function () {
    return Rooms.find({$or: [{isPrivate: false}, {isPrivate: true, invited: this.userId}]});
});
Meteor.publish('users', function () {
    return Meteor.users.find({}, {fields: {_id: 1, username: 1, profile: 1, status: 1}});
});
Meteor.publish('notifications', function () {
    return Notifications.find({userId: this.userId});
});
Meteor.publish('emojis',function(){
    return Emojis.find();
});