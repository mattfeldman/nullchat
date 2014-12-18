Template.roomView.helpers({
    room: function () {
        return Rooms.findOne({_id: Session.get('currentRoom')});
    },
    roomUsers: function () {
        var room = Rooms.findOne({_id: Session.get('currentRoom')});
        if(room) {
            return Meteor.users.find({_id: {$in: room.users}});
        }
        else{
            return [];
        }
    },
    currentRooms: function () {
        return Rooms.find({users: Meteor.userId()});
    },
    currentRoom: function () {
        return Session.get('currentRoom');
    },
    availableRooms: function () {
        return Rooms.find();
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
    Meteor.setTimeout(scrollChatToBottom, 100);
};

var isReady = {};
Template.roomView.created = function () {

    isReady.notifications = false;
    isReady.messages = false;

    Deps.autorun(function () {
        isReady.messages = false;
        Meteor.subscribe('messages', Session.get('currentRoom'), Session.get('messageLimit'),{
            onReady:function(){
                isReady.messages = true;
            }
        });
        Meteor.subscribe('feedbackMessages', Session.get('currentRoom'));
    });

    var clickSound = new buzz.sound('/sounds/click_04.wav');
    var chimeSound = new buzz.sound('/sounds/chime_bell_ding.wav');

    Notifications.find().observe({
        added: function(document){
            if(isReady.notifications) {
                chimeSound.play();
            }
        }
    });
    Messages.find().observe({
        added: function(document) {
            if(isReady.messages && document && document.type !=='feedback') {
                clickSound.play();
            }
        }
    });

    isReady.notifications = true;
};
Template.roomView.destroyed = function(){
    isReady.notifications = false;
    isReady.messages = false;
}