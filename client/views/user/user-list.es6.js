Template.userList.helpers({
    filteredUsers() {
        const room = Rooms.findOne({_id: Session.get('currentRoom'),});
        if (room) {
            const query = {_id: {$in: room.users}};
            if (!Session.get('showOfflineUsers')) {
                query['status.online'] = true;
            }
            return Meteor.users.find(query);
        }
        return [];
    },
    isChecked() {
        return Session.get('showOfflineUsers') ? " checked" : "";
    }
});

Template.userList.events({
    'change .show-offline-users'(event, template) {
        Session.set('showOfflineUsers', $(event.target).prop('checked'));
    }
});
