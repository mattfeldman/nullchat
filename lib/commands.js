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
            // PENDING: user publication
            //args[1] username
            break;
        case "lock":
            lockImpl(true, args[1], commandStub.room);
            break;
        case "unlock":
            lockImpl(false, args[1], commandStub.room);
            break;
    }
}

function lockImpl(lockStatus, roomName, currentRoom) {
    var room = roomName ? Rooms.findOne({name: roomName}) : currentRoom;

    if (!Meteor.userId())
        throw new Meteor.Error("must be logged in");
    if (!room)
        throw new Meteor.Error("room not found");
    if (room.ownerId != Meteor.userId())
        throw new Meteor.Error("you must be owner");

    Rooms.update({_id: room._id}, {$set: {isPrivate: lockStatus}});
}
