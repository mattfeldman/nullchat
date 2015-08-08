insertMessage = function (user, room, messageStub, opts) {
    check(user, Match.ObjectIncluding({_id: String, username: String}));
    check(room, Match.ObjectIncluding({_id: String, users: [String]}));
    check(messageStub, Match.ObjectIncluding({message: String}));

    if (room.isPrivate === true && !_.contains(room.invited, user._id)) {
        throw new Meteor.Error("message-not-invited");
    }

    const options = _.defaults(opts || {}, {
        fromMobile: false,
        crossPost: false,
    });

    // Create regular message
    const timestamp = new Date().getTime();
    const message = {
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
    const messageId = Messages.insert(message);


    if (Meteor.isServer) {
        // Create content message
        const contentMessage = runContentProcessors(messageStub);
        if (contentMessage) {
            const richMessage = {
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
            // TODO: refactor out function with support for preferences and room mentions
            // Check for mentions
            const roomUsers = Meteor.users.find({_id: {$in: room.users}}); // TODO: Remove the need to query this
            roomUsers.forEach(roomUser => {
                if (roomUser._id === message.authorId) {
                    return;
                }
                const notification = {
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

                const regex = new RegExp("[@\\s]?(" + roomUser.username + ")($|[\\s!.?]+)");
                const regexMatch = message.message.match(regex);
                const isNameMentioned = regexMatch && regexMatch.length > 0;

                if (isNameMentioned) {
                    Notifications.insert(notification);
                }
                if (roomUser.profile && roomUser.profile.number && roomUser.status && (!roomUser.status.online || roomUser.status.idle)) {
                    let smsAllMessages = false;
                    if (roomUser.preferences && roomUser.preferences.room) {
                        const currentRoomUsersPreference = _(roomUser.preferences.room).find(p => p.roomId === room._id);
                        smsAllMessages = currentRoomUsersPreference && currentRoomUsersPreference.smsAllMessages;
                    }
                    if (smsAllMessages || isNameMentioned) {
                        const smsBody = notification.authorName + ': ' + notification.message + ' #' + notification.roomName;
                        try {
                            const twilio = Meteor.npmRequire('twilio')(Meteor.settings.twilio.appId, Meteor.settings.twilio.appSecret);
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
                const roomRegex = /#([\w]*)/g;
                const roomMatches = messageStub.message.match(roomRegex);
                const messageRoomName = room.name.toLowerCase();
                if (roomMatches) {
                    const roomQuery = _.chain(roomMatches)
                        .map(roomName => roomName.slice(1).toLowerCase()) // slice to remove #, toLower for uniq()
                        .uniq()
                        .filter(roomName => roomName !== messageRoomName)
                        .map(roomName => new RegExp("^" + roomName + "$", "i"))
                        .value();
                    const rooms = Rooms.find({name: {$in: roomQuery}});
                    rooms.forEach(crossRoom => {
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
