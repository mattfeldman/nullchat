Template.roomListItem.helpers({
    locked() {
        return this.isPrivate ? "[LOCKED] -" : "";
    },
    isSelectedClass() {
        return this.room._id === Session.get("currentRoom") ? "active" : "";
    },
    notificationCount() {
        const count = Notifications.find({userId: Meteor.userId(), roomId: this.room._id, seen: false}).count();
        return count || "";
    },
    leaveLinkEnabled() {
        return this.ownerId !== Meteor.userId() ? "room-leave-link-enabled" : "";
    },
    unreadCount() {
        return Session.get('unread_' + this.room._id);
    }
});

Template.roomListItem.events({
    'click .room-leave-link-enabled'(event, template) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const leaveRoomId = template.data.room._id;
        if (leaveRoomId) {
            if (Session.equals('currentRoom', leaveRoomId)) {
                // Find a different room
                let newRoom = Rooms.findOne({_id: {$ne: leaveRoomId}, users: Meteor.userId()});
                if (!newRoom) {
                    newRoom = Rooms.findOne({name: "welcome"});
                    if (!newRoom) {
                        return;
                    }
                }
                Client.setCurrentRoom(newRoom._id);
            }
            Meteor.call('leaveRoom', leaveRoomId, AlertFeedback);
        }
    },
    'click .setRoomLink'(event, template) {
        event.preventDefault();
        event.stopImmediatePropagation();
        Client.setCurrentRoom(template.data.room._id);
    },
    'click .pin-room-link'(event, template) {
        event.preventDefault();
        event.stopImmediatePropagation();
        Meteor.call('pinRoom', template.data.room._id, AlertFeedback);
    },
    'click .unpin-room-link'(event, template) {
        event.preventDefault();
        event.stopImmediatePropagation();
        Meteor.call('unpinRoom', template.data.room._id, AlertFeedback);
    }
});
