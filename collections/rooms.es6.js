Rooms = new Meteor.Collection('rooms'); // jshint ignore:line

Meteor.methods({
    joinRoom(id) {
        check(id, String);

        const room = Rooms.findOne({_id: id});
        const userId = Meteor.userId();

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
            RoomInvitations.update({invitedUser: userId, roomId: room._id, active: true}, {
                $set: {
                    didAccept: true,
                    completedTime: new Date(),
                    active: false
                }
            }, {multi: true});
        }
        return room._id;
    },
    getDirectMessageRoom(targetUserId) {
        check(targetUserId, String);

        const users = [targetUserId, Meteor.userId()];
        const currentRoom = Rooms.findOne({users: {$all: users}, direct: true});
        if (!currentRoom) {
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
    leaveRoom(id) {
        const room = Rooms.findOne({_id: id});
        const userId = Meteor.userId();

        if (!room) {
            throw new Meteor.Error("Room invalid");
        }

        if (room.ownerId === userId) {
            throw new Meteor.Error("You can't leave a room you own. Sorry bub.");
        }

        Rooms.update({_id: room._id}, {$pull: {users: userId}});
        return room._id;
    },
    setCurrentRoom(roomId) {
        check(roomId, String);

        const room = Rooms.findOne({_id: roomId});
        if (!room) {
            throw new Meteor.Error(`Can not find room with id ${roomId}`);
        }

        if (!_.contains(room.users, Meteor.userId())) {
            Meteor.call('joinRoom', room._id, (err, id) => {
                if (err) {
                    throw new Meteor.Error("User not allowed in to join this room.");
                }
            });
        }
        Meteor.users.update({_id: Meteor.userId()}, {$set: {"status.currentRoom": roomId}});
    },
    createRoom(roomStub) {
        check(roomStub, Schemas.createRoom);

        const roomName = roomStub.name;
        const roomNameRegex = new RegExp("^" + roomName + "$", "i"); // case insensitivity

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
    kickUserFromRoom(targetUserId, targetRoomId) {
        check(targetUserId, String);
        check(targetRoomId, String);

        const targetUser = Meteor.users.findOne(targetUserId);
        const room = Rooms.findOne(targetRoomId);

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
    setRoomPrivacy(targetRoomId, isPrivate) {
        check(targetRoomId, String);
        check(isPrivate, Boolean);

        const room = Rooms.findOne(targetRoomId);
        const user = Meteor.user();

        if (!room) {
            throw new Meteor.Error("Room could not be found.");
        }

        if (room.ownerId !== user._id) {
            throw new Meteor.Error("you must be owner");
        }

        const updateQuery = {$set:{isPrivate: isPrivate}};
        if (isPrivate) {
            updateQuery.$addToSet = {invited: {$each: room.users}};
        }
        Rooms.update({_id: room._id}, updateQuery);
    }
});
