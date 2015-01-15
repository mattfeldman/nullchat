Template.userList.helpers({
    'filteredUsers': function () {
        var room = Rooms.findOne({_id: Session.get('currentRoom'),});
        if (room) {
            var query = {_id: {$in: room.users}};
            if(Session.get('hideOfflineUsers')){
                query['status.online']=true;
            }
            return Meteor.users.find(query);
        }
        else {
            return [];
        }
    },
    'isChecked': function () {
        return Session.get('hideOfflineUsers') ? " checked" : "";
    }
});
Template.userList.events({
    'change .hide-offline-users': function (event, template) {
        Session.set('hideOfflineUsers', $(event.target).prop('checked'));
    }
});







