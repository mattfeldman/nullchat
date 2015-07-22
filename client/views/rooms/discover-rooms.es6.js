Template.discoverRooms.helpers({
    roomInvitations() {
        return RoomInvitations.find({}, {sort: {timestamp: -1}});
    },
    invitationCount() {
        return RoomInvitations.find({}).count();
    }
});
