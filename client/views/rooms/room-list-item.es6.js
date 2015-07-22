Template.roomListItem.helpers({
    locked() {
        return this.isPrivate ? "[LOCKED] -" : "";
    },
    isSelectedClass() {
        return this._id === Session.get("currentRoom") ? "active" : "";
    },
    notificationCount() {
        const count = Notifications.find({userId: Meteor.userId(), roomId: this._id, seen: false}).count();
        return count || "";
    },
    leaveLinkEnabled() {
        return this.ownerId !== Meteor.userId() ? "room-leave-link-enabled" : "";
    },
    unreadCount() {
        return Session.get('unread_' + this._id);
    }
});

Template.roomListItem.events({
    'click .room-leave-link-enabled'(event, template) {
        event.preventDefault();
        const leaveRoomId = template.data._id;
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
            Meteor.call('leaveRoom', leaveRoomId);
        }
    },
    'click .setRoomLink'(event, template) {
        event.preventDefault();
        Client.setCurrentRoom(template.data._id);
    }
});
