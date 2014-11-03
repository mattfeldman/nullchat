Messages = new Meteor.Collection('messages');

Meteor.methods({
    'message': function (messageStub) {
        user = Meteor.user();
        room = Rooms.findOne(messageStub.roomId);

        if (!user)
            throw new Meteor.Error(401, "You need to login to send messages");
        if (!messageStub.message) //TODO: Empty Stringss
            throw new Meteor.Error(401, "You must specify a message");
        if (!room)
            throw new Meteor.Error(401, "You must specify a valid room");
        if (room.isPrivate === true && !_.contains(room.invited, user._id))
            throw new Meteor.Error(401, "You must be invited to send a message to this room.");

        // Process commands
        if (messageStub.message[0] == '/') {
            return processCommand({message: messageStub.message, room: room});
        }

        // Create regular message
        var timestamp = new Date().getTime();
        message = {
            authorId: user._id,
            roomId: room._id,
            timestamp: timestamp,
            type: "plain",
            message: messageStub.message
        };
        var messageId = Messages.insert(message);

        // Create content message
        contentMessage = runContentProcessors(messageStub);
        if (contentMessage) {
            var richMessage = {
                authorId: user._id,
                roomId: room._id,
                timestamp: timestamp + 1,
                type: "rich",
                layout: contentMessage.layout,
                data: contentMessage.data
            };
            Messages.insert(richMessage);
        }

        // Check for mentions
        var roomUsers = Meteor.users.find({_id:{$in:room.users}}); // TODO: Remove the need to query this
        roomUsers.forEach(function (user) {
            //TODO: self-check: if(user._id == message.authorId) return;
            if(message.message.indexOf(user.username) > -1){ // TODO: should be tokenized name either " name " or "@user"
                var notification = {
                    authorId: message.authorId,
                    roomId: room._id,
                    messageId: messageId,
                    userId: user._id,
                    seen: false,
                    // Properties needed for sending a summary
                    timestamp: message.timestamp,
                    message: message.message,
                    roomName: room.name
                };
                Notifications.insert(notification);
            }
        });
        return messageId; // Why, not used...
    }
});
function runContentProcessors(messageStub) {
    for (var i = 0; i < contentProcessors.length; i++) {
        processor = contentProcessors[i];
        match = processor.regex.exec(messageStub.message);
        if (match) {
            var returnval = processor.execute(match);
            return returnval;
        }
    }
}
var contentProcessors = [
    {
        name: "Image Processor",
        regex: /(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*\.(?:jpg|gif|png))(?:\?([^#]*))?(?:#(.*))?/,   //From http://stackoverflow.com/questions/169625/regex-to-check-if-valid-url-that-ends-in-jpg-png-or-gif
        execute: function (regexMatch) {
            return {
                layout: "image",
                data: regexMatch[0]
            };
        }
    }
];

