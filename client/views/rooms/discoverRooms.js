Template.discoverRooms.helpers({
    unreadCountBadge: function () {
        return RoomInvitations.find({invitedUser: Meteor.userId(), active: true}).count();
    },
    hasUnreadClass: function(){
        var count = RoomInvitations.find({invitedUser: Meteor.userId(), active: true}).count();
        if(count && count > 0){
            return "room-invitation-unread";
        }
    }
});

Template.discoverRooms.events({
    'click #discoverRooms': function (event, template) {
        AntiModals.overlay("rooms");
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