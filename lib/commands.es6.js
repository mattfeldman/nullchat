function roomTrim(roomString) {
    return _s.ltrim(roomString, "#");
}
function userTrim(userString) {
    return _s.ltrim(userString, "@");
}
processCommand = function(commandStub) {
    if (commandStub.message[0] === '/') {
        commandStub.message = commandStub.message.substring(1);
    }

    const args = commandStub.message.split((' '));

    // commands
    const matchedCommand = _(commands).find(c => c && c.name && c.name === args[0]);

    if (matchedCommand) {
        matchedCommand.action(args, commandStub);
    }
};
const commands = [
    {
        name: "help",
        usage: "/help",
        description: "shows help",
        action(args, commandStub) {
            if (!commandStub.room) {
                throw new Meteor.Error("Can't get help outside a room, lame.");
            }
            let usage = "Commands with parameters, spaces seperate parameters:</br>";
            usage += _(commands).map(com => `<b>${com.usage}</b> ${com.description}`).join("</br>");
            throw new Meteor.Error(usage);
        }
    },
    {
        name: "create",
        usage: "/create [roomname]",
        description: "creates a room",
        action(args) {
            Meteor.call('createRoom', {name: args[1]});
        }
    },
    {
        name: "nick",
        usage: "/nick [new username]",
        description: "changes your username",
        action(args) {
            Meteor.call('updateUsername', args[1]);
        }
    },
    {
        name: "kick",
        usage: "/kick [username] [room?]",
        description: "removes user from the room",
        action(args, commandStub) {
            const targetUser = Meteor.users.findOne({username: args[1]});
            if (!targetUser) {
                throw new Meteor.Error("You must specify a valid user to kick.");
            }
            const room = args[2] ? Rooms.findOne({name: args[2]}) : commandStub.room;
            if (!room) {
                throw new Meteor.Error("Invalid room specified.");
            }
            Meteor.call("kickUserFromRoom", targetUser._id, room._id);
        }
    },
    {
        name: "moderator",
        usage: "/moderator [user] [?room]",
        description: "makes a user a moderator a room",
        action(args, commandStub) {
            if (!args[1]) {
                throw new Meteor.Error("You must specify a valid user to make a moderator.");
            }
            const targetUser = Meteor.users.findOne({username: args[1]});
            if (!targetUser) {
                throw new Meteor.Error("You must specify a valid user to make a moderator.");
            }
            const room = args[2] ? Rooms.findOne({name: args[2]}) : commandStub.room;
            if (!room) {
                throw new Meteor.Error("Invalid room specified.");
            }
            if (Meteor.userId() !== room.ownerId) {
                throw new Meteor.Error("You must be an owner to add a moderator.");
            }
            if (_.contains(room.moderators, targetUser._id)) {
                throw new Meteor.Error("User is already a moderator");
            }
            Rooms.update({_id: room._id}, {$addToSet: {moderators: targetUser._id}});
        }
    },
    {
        name: "invite",
        usage: "/invite [user] [?room]",
        description: "invites a user to a room",
        action(args, commandStub) {
            if (!args[1]) {
                throw new Meteor.Error("You must specify a user to invite.");
            }
            const targetUser = Meteor.users.findOne({username: userTrim(args[1])});

            if (!targetUser) {
                throw new Meteor.Error("You must specify a user to invite.");
            }
            const room = args[2] ? Rooms.findOne({name: roomTrim(args[2])}) : commandStub.room;
            if (!room) {
                throw new Meteor.Error("Invalid room specified.");
            }
            Meteor.call('roomInvitation', targetUser._id, room._id);
        }
    },
    {
        name: "topic",
        usage: "/topic [topic string]",
        description: "sets the topic of the room",
        action(args, commandStub) {
            const topicRegex = /topic (.*)/;
            const topicMatch = topicRegex.exec(commandStub.message);
            if (topicMatch.length !== 2) {
                throw new Meteor.Error("You must specify a topic.");
            }
            const topic = topicMatch[1];
            if (!topic) {
                throw new Meteor.Error("You must specify a topic.");
            }
            if (!_.contains(commandStub.room.moderators, Meteor.userId())) {
                throw new Meteor.Error("You must be the owner to change topics.");
            }
            Rooms.update({_id: commandStub.room._id}, {$set: {topic: topic}});
        }
    },
    {
        name: "number",
        usage: "/number [phone number]",
        description: "enables txt forwarding of mentions",
        action(args) {
            if (!args[1]) {
                throw new Meteor.Error("Specify phone number");
            }
            const phoneRegex = Schemas.regex.phoneNumber;
            const phoneMatch = phoneRegex.exec(args[1]);
            if (!phoneMatch) {
                throw new Meteor.Error("Specify phone number in this format: +12223334444");
            }
            Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.number': phoneMatch[0]}});
        }
    },
    {
        name: "color",
        usage: "/color [hex color]",
        description: "sets users color",
        action(args) {
            if (!Meteor.userId()) {
                throw new Meteor.Error("Must be logged in");
            }
            const colorRegex = Schemas.regex.color;
            const colorMatch = colorRegex.exec(args[1]);
            if (!colorMatch) {
                throw new Meteor.Error("Must specify a color string (e.g.) #FF000 or #F00");
            }
            Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.color': colorMatch[0]}});
        }
    },
    {
        name: "avatar",
        usage: "/avatar [url]",
        description: "sets users avatar",
        action(args) {
            if (!Meteor.userId()) {
                throw new Meteor.Error("Must be logged in");
            }
            if (!args[1]) {
                throw new Meteor.Error("Must specify url");
            }
            Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.avatar': args[1]}}); // TODO: This sanely, this is user input into the db
        }
    },
    {
        name: "gravatar",
        usage: "/gravatar [email address]",
        description: "sets avatar using gravatar",
        action(args) {
            if (!args[1]) {
                throw new Meteor.Error("Must specify a gravatar email address.");
            }
            const gravatar = Gravatar.imageUrl(args[1]);
            Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.avatar': gravatar}});
        }
    },
    {
        name: "lock",
        usage: "/lock [?room]",
        description: "locks the room",
        action(args, commandStub) {
            const room = args[1] ? Rooms.findOne({name: roomTrim(args[1])}) : commandStub.room;
            Meteor.call('setRoomPrivacy', room._id, true);
        }
    },
    {
        name: "unlock",
        usage: "/unlock [?room]",
        description: "unlocks the room",
        action(args, commandStub) {
            const room = args[1] ? Rooms.findOne({name: roomTrim(args[1])}) : commandStub.room;
            Meteor.call('setRoomPrivacy', room._id, false);
        }
    },
    {
        name: "join",
        usage: "/join [room]",
        description: "joins the room",
        action(args) {
            const room = Rooms.findOne({name: roomTrim(args[1])});
            if (room) {
                Meteor.call('joinRoom', room._id);
            }
            else {
                throw new Meteor.Error("Can not find room.");
            }
        }
    },
    {
        name: "meme",
        usage: "/meme [name] [ [top-line] ] [ [bottom-line] ]",
        description: "generates a meme",
        action(args, commandStub) {
            const memeRegex = /meme (\d+) \[(.+)\] \[(.+)\]/;
            const memeMatch = memeRegex.exec(commandStub.message);
            if (!memeMatch || memeMatch.length < 4) {
                throw new Meteor.Error("Usage: /meme name [top line text] [bottom line text]");
            }
            else {
                const topLine = memeMatch[2];
                const bottomLine = memeMatch[3];

                const response = Meteor.http.post("https://api.imgflip.com/caption_image", {
                    params: {
                        template_id: memeMatch[1],
                        username: "decaprime",
                        password: "9pSajDXjYTLh",
                        text0: topLine,
                        text1: bottomLine
                    }
                });

                if (!response || response.statusCode !== 200) {
                    throw new Meteor.Error("Error creating meme.");
                }
                const responseContent = JSON.parse(response.content);
                if (!responseContent.success) {
                    throw new Meteor.Error("Error creating meme.");
                }
                const memeUrl = responseContent.data.url;

                const timestamp = new Date().getTime();
                const message = {
                    authorId: Meteor.userId(),
                    roomId: commandStub.room._id,
                    timestamp: timestamp,
                    type: "plain",
                    message: memeUrl,
                    seenBy: [],
                    likedBy: []
                };
                const richMessage = {
                    authorId: Meteor.userId(),
                    roomId: commandStub.room._id,
                    timestamp: timestamp + 1,
                    type: "rich",
                    layout: "image",
                    data: memeUrl,
                    seenBy: [],
                    likedBy: []
                };
                Messages.insert(message);
                Messages.insert(richMessage);
            }
        }
    }
];
