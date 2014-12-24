Meteor.publish('messages', function (roomId, limit) {
    Meteor._sleepForMs(200);
    var room = Rooms.findOne({_id: roomId});
    if (room && (!room.isPrivate || _(room.invited).contains(this.userId))){
        return Messages.find({roomId: roomId, type: {$ne: 'feedback'}}, {limit: limit, sort: {timestamp: -1}});
    }
    else {
        throw new Meteor.Error(503, 'No soup for you hackerpants.');
    }
});
Meteor.publish('feedbackMessages', function (roomId) {
    return Messages.find({roomId: roomId, type: 'feedback', userId: this.userId}, {
        limit: 10,
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
Meteor.publish('emojis', function () {
    return Emojis.find();
});
Meteor.publish('memes', function () {
    return Memes.find();
});