function getEarliestMessageId() {
    const message = Messages.findOne({roomId: Session.get('currentRoom')}, {
        fields: {"_id": 1},
        sort: {timestamp: 1}
    });

    return message && message._id;
}

Template.roomView.helpers({
    room() {
        return Rooms.findOne({_id: Session.get('currentRoom')});
    },
    currentRoom() {
        return Session.get('currentRoom');
    },
    availableRooms() {
        return Rooms.find();
    },
    messageLimit() {
        return Session.get('messageLimit');
    },
    messages() {
        return Messages.find({roomId: Session.get('currentRoom')}, {sort: {timestamp: 1}});
    },
    shouldShowLoadMore() {
        return Session.get('messageLimit') === Messages.find({roomId: Session.get('currentRoom'), type: 'plain'}).count();
    }
});

const isReady = {};
const scroll = {};

Template.roomView.events({
    'click .launch'(event, template) {
        $('.sidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
    },
    'click, scroll'() {
        Session.set('unreadMessages', 0);
    },
    'click .loadMore'(event, template) {
        scroll.needScroll = true;
        scroll.previousMessage = getEarliestMessageId();
        Client.incMessageLimit(25);
        Client.focusMessageEntry();
    }
});

Template.roomView.onRendered(function () {
    Meteor.call('setSeen', Session.get('currentRoom'));
    $('.ui.sidebar').sidebar({dimPage: false, closable: false}).sidebar('toggle');
});

Template.roomView.onCreated(function () {
    isReady.messages = false;
    let nowTimestamp;
    Session.setDefault('messageLimit', 10);
    Deps.autorun(function () {
        nowTimestamp = new Date().getTime();
        Meteor.subscribe('messages', Session.get('currentRoom'), Session.get('messageLimit'), {
            onReady() {
                isReady.messages = true;
                if (scroll.needScroll) {
                    scroll.needScroll = false;
                    if (scroll.previousMessage) {
                        Client.scrollToMessage(scroll.previousMessage);
                    }
                }
                else {
                    Client.scrollChatToBottom();
                }
            }
        });
        Meteor.subscribe('feedbackMessages', Session.get('currentRoom'));
    });

    const clickSound = new buzz.sound('/sounds/click_04.wav');

    Messages.find({timestamp: {$gt: nowTimestamp}}).observe({
        added(doc) {
            if (isReady.messages && doc && doc.type !== 'feedback' && doc.authorId !== Meteor.userId()) {
                // HACK: should be replaced by a full 'seen' message sub system
                if ((new Date().getTime() - doc.timestamp) < 10000) {
                    if (roomPreferencesOrDefault(doc.roomId).playMessageSound) {
                        clickSound.play();
                    }

                    if (roomPreferencesOrDefault(doc.roomId).desktopNotificationAllMessages && doc.type !== 'rich') {
                        if (hasDesktopPermission()) {
                            const title = UserHelpers.usernameForUserId(doc.authorId) + "(#" + RoomHelpers.roomNameFromRoomId(doc.roomId) + ")";
                            const avatar = UserHelpers.avatarForUserId(doc.authorId);
                            notify.createNotification(title, {body: doc.message, icon: avatar, tag: doc._id});
                        }
                    }

                    if (!document.hasFocus()) {
                        let currentUnreadMessageCount = Session.get('unreadMessages');
                        currentUnreadMessageCount += 1;
                        Session.set('unreadMessages', currentUnreadMessageCount);
                    }

                    if (doc.roomId !== Session.get('currentRoom')) {
                        Client.incRoomUnread(doc.roomId);
                    }
                }
            }
            if (!scroll.needScroll) {
                // rough percentage toward the top of the scroll view
                const perctentToTop = ($("#scrollContainer").height() - $("#roomContainer").scrollTop() - $("#roomContainer").height()) / $("#scrollContainer").height();
                if (perctentToTop < 0.05) {
                    setTimeout(Client.scrollChatToBottom, 100);
                }
            }
        }
    });
});

Template.roomView.destroyed = function () {
    isReady.messages = false;
};

