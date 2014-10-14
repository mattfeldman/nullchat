Messages = new Meteor.Collection('messages');

Meteor.methods({
    'message':function(messageStub){
        user = Meteor.user();

        //TODO: validate messageStub
        if (!user)
            throw new Meteor.Error(401, "You need to login to send messages");

        message = {
            author: user.username,
            message: messageStub.message,
            roomId: messageStub.roomId,
            timestamp: new Date().getTime()
        }
        var messageId = Messages.insert(message);
        return messageId;
    }
});