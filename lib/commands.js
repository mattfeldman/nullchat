processCommand = function (commandStub) {
    //check(commandStub,{message:String});
    if (commandStub.message[0] = '/') {
        commandStub.message = commandStub.message.substring(1);
    }

    args = commandStub.message.split((' '));

    switch (args[0]) {
        case "create":
            var roomName = args[1];
            if (!roomName)
                throw new Meteor.Error("create <room>");
            if (Rooms.findOne({name: roomName}))
                throw new Meteor.Error("room exists");
            if (!Meteor.userId())
                throw new Meteor.Error("Must be logged in");

            Rooms.insert({
                name: roomName,
                topic: "",
                isPrivate: false,
                ownerId: Meteor.userId(),
                invited: [Meteor.userId()],
                users: [Meteor.userId()]
            });
            break;
        case "invite":
            if(!args[1]) throw new Meteor.Error("You must specify a user to invite.");
            targetUser = Meteor.users.findOne({username:args[1]});
            if(!targetUser) throw new Meteor.Error("You must specify a user to invite.");
            var room = args[2] ? Rooms.findOne({name: args[2]}) : commandStub.room;
            if(!room) throw new Meteor.Error("Invalid room specified.");
            if(Meteor.userId() !== room.ownerId) throw new Meteor.Error("You must be an owner to invite.");
            if(_.contains(room.invited,targetUser._id)) throw new Meteor.Error("User already invited to room.");
            Rooms.update({_id:room._id},{$addToSet:{invited:targetUser._id}});
            break;
        case "topic":
            var topicRegex = /topic (.*)/;
            topicMatch = topicRegex.exec(commandStub.message);
            if(topicMatch.length != 2) throw new Meteor.Error("You must specify a topic.");
            topic = topicMatch[1];
            if(!topic) throw new Meteor.Error("You must specify a topic.");
            if(Meteor.userId() !== room.ownerId) throw new Meteor.Error("You must be the owner to change topics."); // TODO: Ops
            Rooms.update({_id:room._id},{$set:{topic:topic}});
            break;
        case "number":
            if(!args[1]) throw new Meteor.Error("Specify phone number");
            phoneRegex = /(\+([0-9]){11})/;
            phoneMatch = phoneRegex.exec(args[1]);
            if(!phoneMatch) throw new Meteor.Error("Specify phone number in this format: +12223334444");
            Meteor.users.update({_id:Meteor.userId()},{$set:{'profile.number':phoneMatch[0]}});
            break;
        case "color":
            if(!Meteor.userId()) throw new Meteor.Error("Must be logged in");
            colorRegex = /#([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?\b/;
            colorMatch = colorRegex.exec(args[1]);
            if(!colorMatch) throw new Meteor.Error("Must specify a color string (e.g.) #FF000 or #F00");
            Meteor.users.update({_id:Meteor.userId()},{$set:{'profile.color':colorMatch[0]}});
            break;
        case "avatar":
            if(!Meteor.userId()) throw new Meteor.Error("Must be logged in");
            if(!args[1]) throw new Meteor.Error("Must specify url");
            Meteor.users.update({_id:Meteor.userId()},{$set:{'profile.avatar':args[1]}}); // TODO: This sanely, this is user input into the db
            //args[1] username
            break;
        case "lock":
            lockImpl(true, args[1], commandStub.room);
            break;
        case "unlock":
            lockImpl(false, args[1], commandStub.room);
            break;
    }
};

function lockImpl(lockStatus, roomName, currentRoom) {
    var room = roomName ? Rooms.findOne({name: roomName}) : currentRoom;

    if (!Meteor.userId())
        throw new Meteor.Error("must be logged in");
    if (!room)
        throw new Meteor.Error("room not found");
    if (room.ownerId != Meteor.userId())
        throw new Meteor.Error("you must be owner");

    Rooms.update({_id: room._id}, {$set: {isPrivate: lockStatus}});

};
