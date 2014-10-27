Rooms = new Meteor.Collection('rooms');


Meteor.methods({
    'joinRoom': function (id) {
        var room = Rooms.findOne({_id: id});
        var userId = Meteor.userId();

        if (!room)
            throw new Meteor.Error("room missing");
        if (!userId)
            throw new Meteor.Error("user not logged in");
        if (_.contains(room.users, userId))
            throw new Meteor.Error("user already in room");
        if (room.isPrivate && !_.contains(room.invited, userId) && room.ownerId !== userId)
            throw new Meteor.Error("you are not allowed in this room");

        Rooms.update({_id:room._id}, {$addToSet: {users: userId}});

        return room._id;
        //TODO: Set your current room to new room
    }
});