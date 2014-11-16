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
        Session.set('messageLimit', Session.get('messageLimit') + 20);
        e.preventDefault();
    }
});

Template.roomView.rendered = function () {
    Meteor.call('setSeen', Session.get('currentRoom'));
};

Template.roomView.created = function(){
    Deps.autorun(function(){Meteor.subscribe('messages', Session.get('currentRoom'), Session.get('messageLimit'));});
};