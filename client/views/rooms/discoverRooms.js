Template.discoverRooms.helpers({
    unreadCount: function () {
        return RoomInvitations.find({invitedUser: Meteor.userId(), active: true}).count();
    }
});

Template.discoverRooms.events({
    'click #discoverRooms': function (event, template) {
        //AntiModals.overlay("rooms");
        showModal("rooms");
    }
});

Template.discoverRooms.created = function () {
    var instance = this;
    instance.roomInvitationsSub = Meteor.subscribe("roomInvitations");
};

Template.discoverRooms.destroyed = function () {
    var instance = this;
    if (instance.roomInvitationsSub) {
        instance.roomInvitationsSub.stop();
    }
};