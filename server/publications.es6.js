Meteor.publish('messages', function (roomId, limit) {
    check(roomId, String);
    check(limit, Match.Integer);
    if (limit < 1 || limit > 1000) {
        throw new Meteor.Error("Specify limit between 1 and 1000");
    }
    const room = Rooms.findOne({_id: roomId});
    if (room && (!room.isPrivate || _(room.invited).contains(this.userId))) {
        let query = {roomId: roomId, type: {$ne: 'feedback'}};
        const thresholdMessage = Messages.findOne(query, {skip: limit, sort: {timestamp: -1}});
        if (thresholdMessage && thresholdMessage.timestamp) {
            query.timestamp = {$gt: thresholdMessage.timestamp};
        }
        return Messages.find(query, {sort: {timestamp: -1}});
    }
    else {
        throw new Meteor.Error(503, 'No soup for you hackerpants.');
    }
});
Meteor.publish('feedbackMessages', function (roomId) {
    check(roomId, String);
    const now = new Date().getTime();
    return Messages.find({roomId: roomId, type: 'feedback', userId: this.userId, timestamp: {$gt: now}}, {
        limit: 10,
        sort: {timestamp: -1}
    });
});
Meteor.publish('message', function (messageId) {
    check(messageId, String);
    return Messages.find({_id: messageId});
});
Meteor.publish('currentRooms', function () {
    return Rooms.find({users: this.userId});
});
Meteor.publish('availableRooms', function () {
    return Rooms.find({$or: [{isPrivate: false}, {isPrivate: true, invited: this.userId}]});
});
Meteor.publish('users', function () {
    return Meteor.users.find({}, {
        fields: {
            _id: 1,
            username: 1,
            "profile.avatar": 1,
            "profile.color": 1,
            "status.idle": 1,
            "status.offline": 1,
            "status.online": 1,
            "status.lastTyping": 1,
            "status.lastActiveRoom": 1,
            "status.currentRoom": 1,
            "status.lastActivity": 1,
            "status.lastLogin.date": 1
        }
    });
});
Meteor.publish('myPreferences', function () {
    return Meteor.users.find({_id: this.userId}, {
        fields: {
            _id: 1,
            preferences: 1,
            profile: 1
        }
    });
});
Meteor.publish('myCursors', function () {
    return Meteor.users.find({_id: this.userId}, {
        fields: {
            _id: 1,
            cursors: 1
        }
    });
});

Meteor.publish('newMessagesForRoom', function (roomId) {
    check(roomId, String);
    const room = Rooms.findOne({_id: roomId});
    if (room && (!room.isPrivate || _(room.invited).contains(this.userId))) {
        const query = {roomId: roomId, type: {$ne: 'feedback'}};
        return Messages.find(query, {sort: {timestamp: -1}, limit: 5});
    }
    else {
        throw new Meteor.Error(503, 'No soup for you hackerpants.');
    }
});

Meteor.publish('roomInvitations', function () {
    return RoomInvitations.find({
        active: true,
        invitedUser: this.userId
    });
});

Meteor.publish('starredMessages', function () {
    return Messages.find({likedBy: this.userId}); // TODO: Security check
});

// Publish All
Meteor.publish('changelogs', () => Changelogs.find({}));
Meteor.publish('emojis', ()=> Emojis.find());
Meteor.publish('memes', ()=> Memes.find());
Meteor.publish('notifications', function(){ return Notifications.find({userId: this.userId})});

// Indexes
Meteor.startup(function () {
    // Supports newMessagesForRoom, and messages subscriptions
    Messages._ensureIndex({"roomId": 1, "timestamp": -1, "type": 1});

    // Supports notifications subscription
    Notifications._ensureIndex({"roomId": 1, "seen": 1, "userId": 1});
});
