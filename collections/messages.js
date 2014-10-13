Messages = new Meteor.Collection('messages');

Meteor.methods({
    'message':function(messageStr){
        user = Meteor.user();

        if (!user)
            throw new Meteor.Error(401, "You need to login to send messages");

        message = {
            author: user.username,
            message: messageStr,
            timestamp: new Date().getTime()
        }
        var messageId = Messages.insert(message);
        return messageId;
    }
});