Messages = new Meteor.Collection('messages'); // jshint ignore:line

Meteor.methods({
    'likeMessage': function (id) {
        // TODO: Validations
        Messages.update({_id: id}, {$addToSet: {likedBy: Meteor.userId()}});
    },
    'editMessage': function (editMessageStub) {
        var message = Messages.findOne({_id: editMessageStub._id});
        if (!message) {
            throw new Meteor.Error("Couldn't find message to edit.");
        }
        if (Meteor.userId() !== message.authorId) {
            throw new Meteor.Error("Can't edit a message you didn't author.");
        }
        Messages.update({_id: editMessageStub._id}, {$set: {message: editMessageStub.message,lastedited:new Date().getTime()}});
    },
    'message': function (messageStub) {
        var user = Meteor.user();
        var room = Rooms.findOne(messageStub.roomId);
        try {
            if (!user) {
                throw new Meteor.Error(401, "You need to login to send messages");
            }
            if (!messageStub.message) //TODO: Empty Stringss
            {
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
                sendFeedback(e.error, user, room);
            }
            return;
        }

        messageStub.message = htmlEscape(messageStub.message);

        // Create regular message
        var timestamp = new Date().getTime();
        var message = {
            authorId: user._id,
            roomId: room._id,
            timestamp: timestamp,
            type: "plain",
            message: messageStub.message,
            seenBy: [],
            likedBy: []
        };
        var messageId = Messages.insert(message);


        if (Meteor.isServer) {
            // Create content message
            var contentMessage = runContentProcessors(messageStub);
            if (contentMessage) {
                var richMessage = {
                    authorId: user._id,
                    roomId: room._id,
                    timestamp: timestamp + 1,
                    type: "rich",
                    layout: contentMessage.layout,
                    data: contentMessage.data,
                    seenBy: [],
                    likedBy: []
                };
                Messages.insert(richMessage);

            }

            // Check for mentions
            var roomUsers = Meteor.users.find({_id: {$in: room.users}}); // TODO: Remove the need to query this
            roomUsers.forEach(function (roomUser) {
                //TODO: self-check: if(user._id == message.authorId) return;

                var regex = new RegExp("[@\\s]?(" + roomUser.username + ")($|[\\s!.?]+)");
                var regexMatch = message.message.match(regex);

                if (regexMatch && regexMatch.length > 0) { // TODO: should be tokenized name either " name " or "@user"
                    var notification = {
                        authorId: message.authorId,
                        roomId: room._id,
                        messageId: messageId,
                        userId: roomUser._id,
                        seen: false,
                        // Properties needed for sending a summary
                        timestamp: message.timestamp,
                        message: message.message,
                        roomName: room.name,
                        authorName: user.username
                    };
                    Notifications.insert(notification);

                    if (roomUser.profile && roomUser.profile.number) {
                        var smsBody = notification.authorName + ': ' + notification.message + ' #' + notification.roomName;

                        try {
                            var twilio = Meteor.npmRequire('twilio')('AC370ea0996237c09f9dfdfc36d4c08e63', 'd1c6df072dbe1fe7279cd6a951fcab5a');
                            twilio.sendMessage({
                                to: roomUser.profile.number, // Any number Twilio can deliver to
                                from: '+14259678789', // A number you bought from Twilio and can use for outbound communication
                                body: smsBody// body of the SMS message
                            }, function (err, responseData) { //this function is executed when a response is received from Twilio
                                if (!err) { // "err" is an error received during the request, if any
                                    // "responseData" is a JavaScript object containing data received from Twilio.
                                    // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
                                    // http://www.twilio.com/docs/api/rest/sending-sms#example-1
                                    //console.log(responseData.from); // outputs "+14506667788"
                                    //console.log(responseData.body); // outputs "word to your mother."
                                }
                            });
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                }
            });
        }
        return messageId; // Why, not used...
    }
});
function runContentProcessors(messageStub) {
    for (var i = 0; i < contentProcessors.length; i++) {
        var processor = contentProcessors[i];
        var match = processor.regex.exec(messageStub.message);
        if (match) {
            if (!processor.validMatch || processor.validMatch(match)) {
                var returnval = processor.execute(match);
                return returnval;
            }
        }
    }
}
var contentProcessors = [
    {
        name: "Image Processor",
        regex: /(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*\.(?:jpg|jpeg|gif|png))(?:\?([^#]*))?(?:#(.*))?/,   //From http://stackoverflow.com/questions/169625/regex-to-check-if-valid-url-that-ends-in-jpg-png-or-gif
        execute: function (regexMatch) {
            return {
                layout: "image",
                data: regexMatch[0]
            };
        },
    },
    {
        name: "YouTube Processor",
        regex: /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/i,
        validMatch: function (regexMatch) {
            return regexMatch.length >= 2 && regexMatch[1];
        },
        execute: function (regexMatch) {
            return {
                layout: "youtube",
                data: regexMatch[1]
            };
        }
    },
    {
        name: "Noembed",
        regex: SimpleSchema.RegEx.Url,
        execute: function (regexMatch) {
            var response = Meteor.http.get("http://noembed.com/embed", {params: {url: regexMatch[0]}, timeout: 30000});
            if (response.statusCode === 200 && !response.data.error) {
                return {
                    layout: "noembed",
                    data: response.data
                };
            }
            else {
                return false;
            }
        }
    }
];

function sendFeedback(message, user, room) {
    //TODO: Global feedback when feedback is about room? Maybe default to current room?
    if (!room || !message || !user) {
        return;
    }

    var feedbackMessage = {
        roomId: room._id,
        timestamp: new Date().getTime(),
        type: "feedback",
        message: message,
        userId: user._id
    };
    Messages.insert(feedbackMessage);
}

// From http://stackoverflow.com/a/7124052
function htmlEscape(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

