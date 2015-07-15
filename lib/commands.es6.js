function roomTrim(roomString) {
    return _s.ltrim(roomString, "#");
}
function userTrim(userString) {
    return _s.ltrim(userString, "@");
}
processCommand = function (commandStub) {
    //check(commandStub,{message:String});
    if (commandStub.message[0] === '/') {
        commandStub.message = commandStub.message.substring(1);
    }

    var args = commandStub.message.split((' '));
    //args[0] // match name

    // commands
    var command = _.find(commands, function (command) {
        return command && command.name && command.name === args[0];
    });

    if (command) {
        command.action(args, commandStub);
    }
};
var commands = [
    {
        name: "help",
        action: function (args, commandStub) {
            var usage = "Commands with parameters, spaces seperate parameters</br>" +
                "\/create [roomname] creates a room</br>" +
                "\/moderator [user] [?room] makes a user a moderator a room</br>" +
                "\/invite [user] [?room] invites a user to a room</br>" +
                "\/topic [topic string] sets the topic of the room</br>" +
                "\/number [phone number] enables txt forwarding of mentions</br>" +
                "\/color [hex color] sets users color</br>" +
                "\/avatar [url] sets users avatar</br>" +
                "\/lock [?room] locks the room</br>" +
                "\/unlock [?room] unlocks the room";
            if (!commandStub.room) {
                throw new Meteor.Error("Can't get help outside a room, lame. ");
            }
            throw new Meteor.Error(usage);
        }
    },
    {
        name: "create",
        action: function (args) {
            Meteor.call('createRoom', {name: args[1]});
        }
    },
    {
        name: "nick",
        action: function (args) {
            Meteor.call('updateUsername', args[1]);
        }
    },
    {
        name: "kick",
        action: function (args, commandStub) {
            var targetUser = Meteor.users.findOne({username: args[1]});
            if (!targetUser) {
                throw new Meteor.Error("You must specify a valid user to kick.");
            }
            var room = args[2] ? Rooms.findOne({name: args[2]}) : commandStub.room;
            if (!room) {
                throw new Meteor.Error("Invalid room specified.");
            }
            Meteor.call("kickUserFromRoom", targetUser._id, room._id);
        }
    },
    {
        name: "moderator",
        action: function (args, commandStub) {
            if (!args[1]) {
                throw new Meteor.Error("You must specify a valid user to make a moderator.");
            }
            var targetUser = Meteor.users.findOne({username: args[1]});
            if (!targetUser) {
                throw new Meteor.Error("You must specify a valid user to make a moderator.");
            }
            var room = args[2] ? Rooms.findOne({name: args[2]}) : commandStub.room;
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
        action: function (args, commandStub) {
            if (!args[1]) {
                throw new Meteor.Error("You must specify a user to invite.");
            }
            var targetUser = Meteor.users.findOne({username: userTrim(args[1])});

            if (!targetUser) {
                throw new Meteor.Error("You must specify a user to invite.");
            }
            var room = args[2] ? Rooms.findOne({name: roomTrim(args[2])}) : commandStub.room;
            if (!room) {
                throw new Meteor.Error("Invalid room specified.");
            }
            Meteor.call('roomInvitation', targetUser._id, room._id);
        }
    },
    {
        name: "topic",
        action: function (args, commandStub) {
            var topicRegex = /topic (.*)/;
            var topicMatch = topicRegex.exec(commandStub.message);
            if (topicMatch.length !== 2) {
                throw new Meteor.Error("You must specify a topic.");
            }
            var topic = topicMatch[1];
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
        action: function (args) {
            if (!args[1]) {
                throw new Meteor.Error("Specify phone number");
            }
            var phoneRegex = Schemas.regex.phoneNumber;
            var phoneMatch = phoneRegex.exec(args[1]);
            if (!phoneMatch) {
                throw new Meteor.Error("Specify phone number in this format: +12223334444");
            }
            Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.number': phoneMatch[0]}});
        }
    },
    {
        name: "color",
        action: function (args) {
            if (!Meteor.userId()) {
                throw new Meteor.Error("Must be logged in");
            }
            var colorRegex = Schemas.regex.color;
            var colorMatch = colorRegex.exec(args[1]);
            if (!colorMatch) {
                throw new Meteor.Error("Must specify a color string (e.g.) #FF000 or #F00");
            }
            Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.color': colorMatch[0]}});
        }
    },
    {
        name: "avatar",
        action: function (args) {
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
        action: function (args) {
            if (!args[1]) {
                throw new Meteor.Error("Must specify a gravatar email address.");
            }
            var gravatar = Gravatar.imageUrl(args[1]);
            Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.avatar': gravatar}});
        }
    },
    {
        name: "lock",
        action: function (args, commandStub) {
            var room = args[1] ? Rooms.findOne({name: roomTrim(args[1])}) : commandStub.room;
            Meteor.call('setRoomPrivacy', room._id, true);
        }
    },
    {
        name: "unlock",
        action: function (args, commandStub) {
            var room = args[1] ? Rooms.findOne({name: roomTrim(args[1])}) : commandStub.room;
            Meteor.call('setRoomPrivacy', room._id, false);
        }
    },
    {
        name: "join",
        action: function (args) {
            var room = Rooms.findOne({name: roomTrim(args[1])});
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
        action: function (args, commandStub) {
            var memeRegex = /meme (\d+) \[(.+)\] \[(.+)\]/;
            var memeMatch = memeRegex.exec(commandStub.message);
            if (!memeMatch || memeMatch.length < 4) {
                throw new Meteor.Error("Usage: /meme name [top line text] [bottom line text]");
            }
            else {
                var topLine = memeMatch[2];
                var bottomLine = memeMatch[3];

                var response = Meteor.http.post("https://api.imgflip.com/caption_image", {
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
                var responseContent = JSON.parse(response.content);
                if (!responseContent.success) {
                    throw new Meteor.Error("Error creating meme.");
                }
                var memeUrl = responseContent.data.url;

                var timestamp = new Date().getTime();
                var message = {
                    authorId: Meteor.userId(),
                    roomId: commandStub.room._id,
                    timestamp: timestamp,
                    type: "plain",
                    message: memeUrl,
                    seenBy: [],
                    likedBy: []
                };
                var richMessage = {
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
    }];
