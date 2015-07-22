Template.discoverRoomsButton.onCreated(function() {
    this.subscribe("roomInvitations");
});

Template.discoverRoomsButton.helpers({
    unreadCount() {
        return RoomInvitations.find({invitedUser: Meteor.userId(), active: true}).count();
    }
});

Template.discoverRoomsButton.events({
    'click #discoverRooms'(event, template) {
        Client.showModal("discoverRooms");
    }
});
