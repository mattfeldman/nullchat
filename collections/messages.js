Messages = new Meteor.Collection('messages');

Meteor.methods({
    'message':function(messageStub){
        user = Meteor.user();
        room = Rooms.findOne(messageStub.roomId);

        if(!user)
            throw new Meteor.Error(401, "You need to login to send messages");
        if(!messageStub.message) //TODO: Empty Stringss
            throw new Meteor.Error(401, "You must specify a message");
        if(!room)
            throw new Meteor.Error(401, "You must specify a valid room");
        if(room.isPrivate === true && !_.contains(room.invited,user._id))
            throw new Meteor.Error(401, "You must be invited to send a message to this room.");

        if(messageStub.message[0]=='/'){
            return processCommand({message:messageStub.message,room:room});
        }

        message = {
            authorId: user._id,
            message: messageStub.message,
            roomId: room._id,
            timestamp: new Date().getTime()
        }

        var messageId = Messages.insert(message);
        return messageId;
    }
});
