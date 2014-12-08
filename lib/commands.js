processCommand = function (commandStub) {
    //check(commandStub,{message:String});
    if (commandStub.message[0] === '/') {
        commandStub.message = commandStub.message.substring(1);
    }

    var args = commandStub.message.split((' '));

    switch (args[0]) {
        case "help":
            var usage = "Commands with parameters, spaces seperate parameters</br>"+
                "\/create [roomname] creates a room</br>"+
                "\/moderator [user] [?room] makes a user a moderator a room</br>"+
                "\/invite [user] [?room] invites a user to a room</br>"+
                "\/topic [topic string] sets the topic of the room</br>"+
                "\/number [phone number] enables txt forwarding of mentions</br>"+
                "\/color [hex color] sets users color</br>"+
                "\/avatar [url] sets users avatar</br>"+
                "\/lock [?room] locks the room</br>"+
                "\/unlock [?room] unlocks the room";
            if(!commandStub.room) {
                throw new Meteor.Error("Can't get help outside a room, lame. ");
            }
            throw new Meteor.Error(usage);
            break;
        case "create":
            var roomName = args[1];

            if (!roomName) {
                throw new Meteor.Error("create <room>");
            }
            if(!/^[\w]*$/.test(roomName)){
                throw new Meteor.Error("room name must be alphanumeric");
            }
            if (Rooms.findOne({name: roomName})) {
                throw new Meteor.Error("room exists");
            }
            if (!Meteor.userId()) {
                throw new Meteor.Error("Must be logged in");
            }

            Rooms.insert({
                name: roomName,
                topic: "",
                isPrivate: false,
                ownerId: Meteor.userId(),
                invited: [Meteor.userId()],
                users: [Meteor.userId()],
                moderators: [Meteor.userId()]
            });
            break;
        case "moderator":
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
            break;
        case "invite":
            if (!args[1]) {
                throw new Meteor.Error("You must specify a user to invite.");
            }
            var targetUser = Meteor.users.findOne({username: args[1]});

            if (!targetUser) {
                throw new Meteor.Error("You must specify a user to invite.");
            }
            var room = args[2] ? Rooms.findOne({name: args[2]}) : commandStub.room;
            if (!room) {
                throw new Meteor.Error("Invalid room specified.");
            }
            if (Meteor.userId() !== room.ownerId) {
                throw new Meteor.Error("You must be an owner to invite.");
            }
            if (_.contains(room.invited, targetUser._id)) {
                throw new Meteor.Error("User already invited to room.");
            }
            Rooms.update({_id: room._id}, {$addToSet: {invited: targetUser._id}});
            break;
        case "topic":
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
            break;
        case "number":
            if (!args[1]) {
                throw new Meteor.Error("Specify phone number");
            }
            var phoneRegex = /(\+([0-9]){11})/;
            var phoneMatch = phoneRegex.exec(args[1]);
            if (!phoneMatch) {
                throw new Meteor.Error("Specify phone number in this format: +12223334444");
            }
            Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.number': phoneMatch[0]}});
            break;
        case "color":
            if (!Meteor.userId()) {
                throw new Meteor.Error("Must be logged in");
            }
            var colorRegex = /#([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?\b/;
            var colorMatch = colorRegex.exec(args[1]);
            if (!colorMatch) {
                throw new Meteor.Error("Must specify a color string (e.g.) #FF000 or #F00");
            }
            Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.color': colorMatch[0]}});
            break;
        case "avatar":
            if (!Meteor.userId()) {
                throw new Meteor.Error("Must be logged in");
            }
            if (!args[1]) {
                throw new Meteor.Error("Must specify url");
            }
            Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.avatar': args[1]}}); // TODO: This sanely, this is user input into the db
            //args[1] username
            break;
        case "lock":
            lockImpl(true, args[1], commandStub.room);
            break;
        case "unlock":
            lockImpl(false, args[1], commandStub.room);
            break;
        default:
            break;
    }
};

function lockImpl(lockStatus, roomName, currentRoom) {
    var room = roomName ? Rooms.findOne({name: roomName}) : currentRoom;

    if (!Meteor.userId()) {
        throw new Meteor.Error("must be logged in");
    }
    if (!room) {
        throw new Meteor.Error("room not found");
    }
    if (room.ownerId !== Meteor.userId()) {
        throw new Meteor.Error("you must be owner");
    }

    Rooms.update({_id: room._id}, {$set: {isPrivate: lockStatus}});

}
