Template.roomTile.events({
    'click .join'(event, template) {
        Meteor.call('joinRoom', template.data._id);
    },
    'click .leave'(event, template) {
        Meteor.call('leaveRoom', template.data._id);
    }
});
Template.roomTile.helpers({
    myRoomClass() {
        return _(this.users).contains(Meteor.userId()) ? "my-room" : "";
    },
    inRoom() {
        return _(this.users).contains(Meteor.userId());
    }
});
