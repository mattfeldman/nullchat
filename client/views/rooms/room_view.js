Template.roomView.helpers({
    room: function () {
        return Rooms.findOne({_id: Session.get('currentRoom')});
    },
    currentRoom: function () {
        return Session.get('currentRoom');
    },
    availableRooms: function () {
        return Rooms.find();
    },
    messageLimit: function () {
        return Session.get('messageLimit');
    }
});
Template.roomView.events({
    'click #loadMore': function (e) {
        Session.set('messageLimit', Session.get('messageLimit') + 20);
        e.preventDefault();
    },
    'scroll #roomContainer': function (e) {
        var room = $("#roomContainer");
        if (room.scrollTop() < 50 && !scroll.needScroll && isReady.messages) {
            scroll.needScroll = true;
            scroll.previousHeight = $("#scrollContainer").height();
            incMessageLimit(20);
        }
    },
    'click .launch':function(event,template){
        $('.sidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
    },
    'click, scroll':function(){
        Session.set('unreadMessages', 0);
    }
});

Template.roomView.rendered = function () {
    Meteor.call('setSeen', Session.get('currentRoom'));
};

var isReady = {};
var scroll = {};

Template.roomView.created = function () {
    isReady.notifications = false;
    isReady.messages = false;
    var nowTimestamp;
    Session.setDefault('messageLimit', 10);
    Deps.autorun(function () {
        nowTimestamp = new Date().getTime();
        Meteor.subscribe('messages', Session.get('currentRoom'), Session.get('messageLimit'), {
            onReady: function () {
                isReady.messages = true;
                if (scroll.needScroll) {
                    var room = $("#roomContainer");
                    scroll.needScroll = false;
                    var offset = $("#scrollContainer").height() - scroll.previousHeight;
                    room.scrollTop(room.scrollTop() + offset);
                }
                else {
                    scrollChatToBottom();
                }
            }
        });
        Meteor.subscribe('feedbackMessages', Session.get('currentRoom'));
    });

    var clickSound = new buzz.sound('/sounds/click_04.wav');
    var chimeSound = new buzz.sound('/sounds/chime_bell_ding.wav');

    var permission = notify.permissionLevel();
    if (permission === notify.PERMISSION_DEFAULT) {
        notify.requestPermission();
    }
    notify.config({pageVisibility: false, autoClose: 5000});


    Notifications.find({timestamp: {$gt: nowTimestamp}}).observe({
        added: function (document) {
            if (isReady.notifications) {
                // HACK: should be replaced by a full 'seen' message sub system
                if((new Date().getTime() - document.timestamp) < 10000) {
                    chimeSound.play();
                    if (roomPreferencesOrDefault(document.roomId).desktopNotificationMention) {
                        if (permission === notify.PERMISSION_GRANTED) {
                            var title = document.authorName + "(#" + document.roomName + ")";
                            var user = Meteor.users.findOne({_id: document.authorId}, {fields: {"profile.avatar": 1}});
                            var avatar = user && user.profile && user.profile.avatar || '/images/logo64.png';
                            notify.createNotification(title, {
                                body: document.message,
                                icon: avatar,
                                tag: document.messageId
                            });
                        }
                    }
                }
            }
        }
    });
    Messages.find({timestamp: {$gt: nowTimestamp}}).observe({
        added: function (doc) {
            if (isReady.messages && doc && doc.type !== 'feedback' && doc.authorId !== Meteor.userId()) {
                // HACK: should be replaced by a full 'seen' message sub system
                if((new Date().getTime() - doc.timestamp) < 10000) {
                    if (roomPreferencesOrDefault(doc.roomId).playMessageSound) {
                        clickSound.play();
                    }

                    if (roomPreferencesOrDefault(doc.roomId).desktopNotificationAllMessages && doc.type !== 'rich') {
                        if (permission === notify.PERMISSION_GRANTED) {
                            var user = Meteor.users.findOne({_id: doc.authorId}, {
                                fields: {
                                    "profile.avatar": 1,
                                    "username": 1
                                }
                            });
                            var room = Rooms.findOne({_id: doc.roomId});
                            var title = user.username + "(#" + room.name + ")";
                            var avatar = user && user.profile && user.profile.avatar || '/images/logo64.png';
                            notify.createNotification(title, {body: doc.message, icon: avatar, tag: doc._id});
                        }
                    }

                    if (!document.hasFocus()) {
                        var currentUnreadMessageCount = Session.get('unreadMessages');
                        currentUnreadMessageCount += 1;
                        Session.set('unreadMessages', currentUnreadMessageCount);
                    }

                    if (doc.roomId !== Session.get('currentRoom')) {
                        incRoomUnread(doc.roomId);
                    }
                }
            }
            if (!scroll.needScroll) {
                // rougly percentage towards the top fo the scrollbar; less than 5% sticky scroll to bottom
                if ((($("#scrollContainer").height() - $("#roomContainer").scrollTop() - $("#roomContainer").height()) / $("#scrollContainer").height()) < 0.05) {
                    setTimeout(scrollChatToBottom, 100);
                }
            }
        }
    });

    Messages.find({authorId: Meteor.userId()}).observe({
        changed: function (newDoc, oldDoc) {
            if (newDoc.likedBy.length - oldDoc.likedBy.length === 1) {
                var likedBy = _.difference(newDoc.likedBy, oldDoc.likedBy)[0];
                if (likedBy === Meteor.userId()) {return;}
                if (permission === notify.PERMISSION_GRANTED) {
                    var user = Meteor.users.findOne({_id: likedBy}, {fields: {"profile.avatar": 1, "username": 1}});
                    if (!user) {return;}
                    var avatar = user.profile && user.profile.avatar || '/images/logo64.png';
                    var title = user.username + " gave you a star.";
                    var body = "For \"" + newDoc.message + "\"";
                    notify.createNotification(title, {body: body, icon: avatar, tag: newDoc._id});
                }
            }
        }
    });

    Session.set('unreadMessages', 0);
    Deps.autorun(function () {
        var numberOfUnreadMessages = Session.get('unreadMessages');
        var currentRoom = Rooms.findOne({_id: Session.get('currentRoom')});

        var currentRoomString = '';

        if (currentRoom) {
            currentRoomString = '#' + currentRoom.name + ' ';
        }

        if (numberOfUnreadMessages > 0) {
            document.title = "(" + numberOfUnreadMessages + ")" + " " + currentRoomString + window.location.hostname;
        }
        else {
            document.title = currentRoomString + window.location.hostname;
        }
    });

    Deps.autorun(function(){
        var rooms = Rooms.find({users:Meteor.userId()},{fields:{_id:1}}).fetch();
        if(rooms){
            for(var i=0;i<rooms.length;i++){
                var roomId = rooms[i]._id;
                Meteor.subscribe('newMessagesForRoom', roomId);
            }
        }
    });
    isReady.notifications = true;
};
Template.roomView.destroyed = function () {
    isReady.notifications = false;
    isReady.messages = false;
}