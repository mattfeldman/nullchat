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
        try {
            if (!user) {
                throw new Meteor.Error(401, "You need to login to send messages");
            }
            if (_s.isBlank(messageStub.message)) {
                throw new Meteor.Error(401, "You must specify a message");
            }
            if (!room) {
                throw new Meteor.Error(401, "You must specify a valid room");
            }
            if (room.isPrivate === true && !_.contains(room.invited, user._id)) {
                throw new Meteor.Error(401, "You must be invited to send a message to this room.");
            }

            // Process commands
            if (messageStub.message[0] === '/') {
                return processCommand({message: messageStub.message, room: room});
            }
        }
        catch (e) {
            if (e.errorType === "Meteor.Error") {
                sendFeedback(e.message || e.error, user, room);
            }
            return;
        }
        insertMessage(user, room, messageStub);
    }
});

function sendFeedback(message, user, room) {
    // TODO: Global feedback when feedback is about room? Maybe default to current room?
    if (!room || !message || !user) {
        return;
    }
    const feedback = Feedback[message];
    const content = feedback && feedback.message || message;
    var feedbackMessage = {
        roomId: room._id,
        timestamp: new Date().getTime(),
        type: "feedback",
        message: content,
        userId: user._id
    };
    Messages.insert(feedbackMessage);
}

