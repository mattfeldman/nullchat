Rooms = new Meteor.Collection('rooms'); // jshint ignore:line

Meteor.methods({
    'joinRoom': function (id) {
        check(id, String);

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
            RoomInvitations.update({invitedUser: userId, roomId:room._id, active:true}, {
                $set: {
                    didAccept: true,
                    completedTime: new Date(),
                    active: false
                }
            },{multi:true});
        }
        return room._id;
    },
    'getDirectMessageRoom': function(targetUserId){
        check(targetUserId, String);

        var users = [targetUserId, Meteor.userId()];
        var currentRoom = Rooms.findOne({users:{$all:users}, direct: true});
        if(!currentRoom) {
            return Rooms.insert({
                name: null,
                topic: null,
                isPrivate: true,
                ownerId: null,
                invited: users,
                users: users,
                moderators: users,
                direct: true
            });
        }
        return currentRoom._id;
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
        check(roomId, String);

        var room = Rooms.findOne({_id: roomId});
        if (!room) {
            throw new Meteor.Error("Can not find room with id " + roomId);
        }

        if (!_.contains(room.users, Meteor.userId())) {
            Meteor.call('joinRoom', room._id, function (err, id) {
                if (err) {
                    throw new Meteor.Error("User not allowed in to join this room.");
                }
            });
        }
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
    },
    'kickUserFromRoom': function (targetUserId, targetRoomId) {
        check(targetUserId, String);
        check(targetRoomId, String);

        var targetUser = Meteor.users.findOne(targetUserId);
        var room = Rooms.findOne(targetRoomId);

        if (!room) {
            throw new Meteor.Error("Room could not be found.");
        }

        if (!targetUser) {
            throw new Meteor.Error("User could not be found.");
        }

        if (room.ownerId !== Meteor.userId() && !_(room.moderators).contains(Meteor.userId())) {
            throw new Meteor.Error("You do not have permission to kick in this room.");
        }

        if (!_(room.users).contains(targetUser._id)) {
            throw new Meteor.Error("Room does not contain target user.");
        }

        if (room.ownerId === targetUser._id) {
            throw new Meteor.Error("Can not kick the owner of a room.");
        }

        Rooms.update({_id: room._id}, {$pull: {users: targetUser._id}});
    },
    'setRoomPrivacy': function (targetRoomId, isPrivate) {
        check(targetRoomId, String);
        check(isPrivate, Boolean);

        var room = Rooms.findOne(targetRoomId);
        var user = Meteor.user();

        if (!room) {
            throw new Meteor.Error("Room could not be found.");
        }

        if (room.ownerId !== user._id) {
            throw new Meteor.Error("you must be owner");
        }

        var updateQuery = {$set:{isPrivate: isPrivate}};
        if (isPrivate) {
            updateQuery.$addToSet = {invited: {$each:room.users}};
        }
        Rooms.update({_id: room._id}, updateQuery);
    }
});