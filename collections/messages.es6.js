Messages = new Meteor.Collection('messages'); // jshint ignore:line

Meteor.methods({
    likeMessage(id) {
        check(id, String);
        Messages.update({_id: id}, {$addToSet: {likedBy: Meteor.userId()}});
    },
    unlikeMessage(id) {
        check(id, String);
        Messages.update({_id: id}, {$pull: {likedBy: Meteor.userId()}});
    },
    editMessage(editMessageStub) {
        check(editMessageStub, {_id: String, message: String});
        const message = Messages.findOne({_id: editMessageStub._id});
        if (!message) {
            throw new Meteor.Error("Couldn't find message to edit.");
        }
        if (Meteor.userId() !== message.authorId) {
            throw new Meteor.Error("Can't edit a message you didn't author.");
        }
        Messages.update({_id: editMessageStub._id}, {
            $set: {
                message: editMessageStub.message,
                lastedited: new Date().getTime()
            }
        });
    },
    removeMessage(id) {
        check(id, String);
        const message = Messages.findOne({_id: id});
        if (!message) {
            throw new Meteor.Error("Couldn't find message to edit.");
        }
        if (Meteor.userId() !== message.authorId) {
            throw new Meteor.Error("Can't remove a message you didn't author.");
        }
        Messages.remove({_id: id});
    },
    message(messageStub) {
        check(messageStub, {message: String, roomId: String});
        const user = Meteor.user();
        const room = Rooms.findOne(messageStub.roomId);
        if (!user) {
            throw new Meteor.Error("user-not-found");
        }
        if (_s.isBlank(messageStub.message)) {
            throw new Meteor.Error("message-blank");
        }
        if (!room) {
            throw new Meteor.Error("room-not-found");
        }
        if (room.isPrivate === true && !_.contains(room.invited, user._id)) {
            throw new Meteor.Error("message-not-invited");
        }

        // Process commands
        if (messageStub.message[0] === '/') {
            return processCommand({message: messageStub.message, room: room});
        }
        insertMessage(user, room, messageStub);
    }
});
