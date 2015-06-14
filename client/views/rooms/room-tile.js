Template.roomTile.events({
    'click .join': function (event, template) {
        Meteor.call('joinRoom', template.data._id);
    },
    'click .leave': function (event, template) {
        Meteor.call('leaveRoom', template.data._id);
    }
});
Template.roomTile.helpers({
    'myRoomClass': function () {
        return _(this.users).contains(Meteor.userId()) ? "my-room" : "";
    },
    'inRoom': function () {
        return _(this.users).contains(Meteor.userId());
    }
});