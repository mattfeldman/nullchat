Template.userList.helpers({
    'filteredUsers': function () {
        var room = Rooms.findOne({_id: Session.get('currentRoom'),});
        if (room) {
            var query = {_id: {$in: room.users}};
            if(!Session.get('showOfflineUsers')){
                query['status.online']=true;
            }
            return Meteor.users.find(query);
        }
        else {
            return [];
        }
    },
    'isChecked': function () {
        return Session.get('showOfflineUsers') ? " checked" : "";
    }
});

Template.userList.events({
    'change .show-offline-users': function (event, template) {
        Session.set('showOfflineUsers', $(event.target).prop('checked'));
    }
});



