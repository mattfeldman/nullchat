Template.roomInvitation.helpers({
    user() {
        return Meteor.users.findOne({_id: this.invitingUser});
    },
    room() {
        return Rooms.findOne({_id: this.roomId});
    },
    agoText() {
        return moment(this.timestamp).fromNow();
    }
});
Template.roomInvitation.events({
    'click .room-invitation-accept'(event, template) {
        Meteor.call('acceptRoomInvitation', template.data._id, AlertFeedback);
        event.preventDefault();
    },
    'click .room-invitation-dismiss'(event, template) {
        Meteor.call('dismissRoomInvitation', template.data._id, AlertFeedback);
        event.preventDefault();
    }
});
