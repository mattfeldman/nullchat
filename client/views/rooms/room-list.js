Template.roomList.helpers({
    currentRooms: function () {
        return Rooms.find({users: Meteor.userId(), direct: {$ne: true}});
    },
    currentDirectMessages: function () {
        return Rooms.find({users: Meteor.userId(), direct: true});
    }
});