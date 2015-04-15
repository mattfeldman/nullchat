Template.discoverRoomsButton.onCreated(function () {
    this.subscribe("roomInvitations");
});

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