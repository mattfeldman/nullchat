insertMessage = function (user, room, messageStub, opts) {
    check(user, Match.ObjectIncluding({_id: String, username: String}));
    check(room, Match.ObjectIncluding({_id: String, users: [String]}));
    check(messageStub, Match.ObjectIncluding({message: String}));

    if (room.isPrivate === true && !_.contains(room.invited, user._id)) {
        throw new Meteor.Error(401, "You must be invited to send a message to this room.");
    }

    var options = _.defaults(opts || {}, {
        fromMobile: false,
        crossPost: false,
    });

    // Create regular message
    var timestamp = new Date().getTime();
    var message = {
        authorId: user._id,
        roomId: room._id,
        timestamp: timestamp,
        type: "plain",
        message: messageStub.message,
        seenBy: [],
        likedBy: [],
        fromMobile: options.fromMobile,
        crosspost: options.crossPost
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

        Meteor.users.update({_id: user._id}, {
            $set: {
                "status.lastTyping": 0,
            }
        });

        if (!options.crossPost) {
            //TODO: refactor out function with support for preferences and room mentions
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
                            var twilio = Meteor.npmRequire('twilio')(Meteor.settings.twilioKey, Meteor.settings.twilioSecret);
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

            var roomRegex = /#([\w]*)/g;
            var roomMatches = messageStub.message.match(roomRegex);
            var messageRoomName = room.name.toLowerCase();
            if (roomMatches) {
                var roomQuery = _.chain(roomMatches)
                    .map(function (roomName) {
                        return roomName.slice(1).toLowerCase(); // slice to remove #, toLower for uniq()
                    })
                    .uniq()
                    .filter(function (roomName) {
                        return roomName !== messageRoomName;
                    })
                    .map(function (roomName) {
                        return new RegExp("^" + roomName + "$", "i");
                    })
                    .value();
                var rooms = Rooms.find({name: {$in: roomQuery}});
                rooms.forEach(function (crossRoom) {
                    try {
                        if (crossRoom._id !== room.id) {
                            options.crossPost = true;
                            insertMessage(user, crossRoom, messageStub, options);
                        }
                    }
                    catch (e) {
                        // Do nothing as we don't care about errors for cross-posts
                    }
                });
            }
        }
    }
    return messageId; // Why, not used...
};