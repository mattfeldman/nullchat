Rooms = new Meteor.Collection('rooms'); // jshint ignore:line


Meteor.methods({
    'joinRoom': function (id) {
        var room = Rooms.findOne({_id: id});
        var userId = Meteor.userId();

        if (!room) {
            throw new Meteor.Error("room missing");
        }
        if (!userId) {
            throw new Meteor.Error("user not logged in");
        }
        if (room.isPrivate && !_.contains(room.invited, userId) && room.ownerId !== userId) {
            throw new Meteor.Error("you are not allowed in this room");
        }
        if (!_.contains(room.users, userId)) {
            Rooms.update({_id: room._id}, {$addToSet: {users: userId}});
        }
        return room._id;
    },
    'leaveRoom': function (id) {
        var room = Rooms.findOne({_id: id});
        var userId = Meteor.userId();

        if (!room) {
            throw new Meteor.Error("Room invalid");
        }

        if (room.ownerId === userId) {
            throw new Meteor.Error("You can't leave a room you own. Sorry bub.");
        }

        Rooms.update({_id: room._id}, {$pull: {users: userId}});
        return room._id;

    },
    'setCurrentRoom': function (roomId) {
        Meteor.users.update({_id: Meteor.userId()}, {$set: {"status.currentRoom": roomId}});
    },
    'createRoom': function (roomStub) {
        check(roomStub, Schemas.createRoom);

        var roomName = roomStub.name;
        var roomNameRegex = new RegExp("^" + roomName + "$", "i"); // case insensitivity

        if (!Schemas.regex.room.test(roomName)) {
            throw new Meteor.Error("room name must be alphanumeric");
        }
        if (Rooms.findOne({name: roomNameRegex})) {
            throw new Meteor.Error("room exists");
        }
        if (!Meteor.userId()) {
            throw new Meteor.Error("Must be logged in");
        }

        Rooms.insert({
            name: roomName,
            topic: "",
            isPrivate: false,
            ownerId: Meteor.userId(),
            invited: [Meteor.userId()],
            users: [Meteor.userId()],
            moderators: [Meteor.userId()]
        });
    }
});