Template.discoverRoomsButton.helpers({
    unreadCount: function () {
        return RoomInvitations.find({invitedUser: Meteor.userId(), active: true}).count();
    }
});

Template.discoverRoomsButton.events({
    'click #discoverRooms': function (event, template) {
        showModal("discoverRooms");
    }
});

Template.discoverRoomsButton.created = function () {
    var instance = this;
    instance.roomInvitationsSub = Meteor.subscribe("roomInvitations");
};

Template.discoverRoomsButton.destroyed = function () {
    var instance = this;
    if (instance.roomInvitationsSub) {
        instance.roomInvitationsSub.stop();
    }
};