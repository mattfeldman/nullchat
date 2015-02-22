Template.discoverRooms.helpers({
    'roomInvitations':function(){
        return RoomInvitations.find({},{sort:{timestamp:-1}});
    },
    'invitationCount':function(){
        return RoomInvitations.find({}).count();
    }
});