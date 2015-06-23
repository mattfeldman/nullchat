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

                if (roomUser._id === message.authorId) {return;}
                var notification = {
                    authorId: message.authorId,
                    roomId: room._id,
                    messageId: messageId,
                    userId: roomUser._id,
                    seen: false,
                    // Properties needed for sending a summary
                    timestamp: message.timestamp,
                    message: message.message,
                    roomName: room.name || '@' + user.username,
                    authorName: user.username
                };

                var regex = new RegExp("[@\\s]?(" + roomUser.username + ")($|[\\s!.?]+)");
                var regexMatch = message.message.match(regex);
                var isNameMentioned = regexMatch && regexMatch.length > 0;

                if (isNameMentioned) {
                    Notifications.insert(notification);
                }
                if (roomUser.profile && roomUser.profile.number && roomUser.status && (!roomUser.status.online || roomUser.status.idle)) {
                    var smsAllMessages = false;
                    if (roomUser.preferences && roomUser.preferences.room) {
                        var currentRoomUsersPreference = _(roomUser.preferences.room).find(function (p) {
                            return p.roomId === room._id;
                        });
                        smsAllMessages = currentRoomUsersPreference && currentRoomUsersPreference.smsAllMessages;
                    }
                    if (smsAllMessages || isNameMentioned) {
                        var smsBody = notification.authorName + ': ' + notification.message + ' #' + notification.roomName;
                        try {
                            var twilio = Meteor.npmRequire('twilio')(Meteor.settings.twilio.appId, Meteor.settings.twilio.appSecret);
                            twilio.sendMessage({
                                to: roomUser.profile.number, // Any number Twilio can deliver to
                                from: Meteor.settings.twilio.fromNumber, // A number you bought from Twilio and can use for outbound communication
                                body: smsBody// body of the SMS message
                            });
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                }

            });

            if (!room.direct) {
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
    }
    return messageId; // Why, not used...
};
