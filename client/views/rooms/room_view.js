Template.roomView.helpers({
    room: function () {
        return Rooms.findOne({_id: Session.get('currentRoom')});
    },
    roomUsers: function () {
        var room = Rooms.findOne({_id: Session.get('currentRoom')});
        return Meteor.users.find({_id: {$in: room.users}});
    }
});

Template.roomView.events({
    'click #loadMore': function (e) {
        e.preventDefault();
        Session.set('messageLimit', Session.get('messageLimit') + 20);
    }
});

Template.roomView.rendered = function () {
    Meteor.call('setSeen', Session.get('currentRoom'));
};