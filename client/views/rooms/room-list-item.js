Template.roomListItem.helpers({
    locked: function () {
        return this.isPrivate ? "[LOCKED] -" : "";
    },
    isSelectedClass: function () {
        return this._id === Session.get("currentRoom") ? "active" : "";
    },
    notificationCount: function () {
        var count = Notifications.find({userId: Meteor.userId(), roomId: this._id, seen: false}).count();
        return count || "";
    },
    leaveLinkEnabled: function(){
        return this.ownerId !== Meteor.userId() ? "room-leave-link-enabled" : "";
    },
    unreadCount:function(){
        return Session.get('unread_'+this._id);
    }
});
Template.roomListItem.events({
    'click .room-leave-link-enabled':function(event, template){
        event.preventDefault();
        var leaveRoomId =template.data._id;
        if(leaveRoomId) {
            if(Session.equals('currentRoom',leaveRoomId)){
                // Find a different room
                var newRoom = Rooms.findOne({_id:{$ne:leaveRoomId},users:Meteor.userId()});
                if(!newRoom){
                    newRoom = Rooms.findOne({name:"welcome"});
                    if(!newRoom){
                        return;
                    }
                }
                Client.setCurrentRoom(newRoom._id);
            }
            Meteor.call('leaveRoom', leaveRoomId);
        }
    },
    'click .setRoomLink':function(event,template){
        event.preventDefault();
        Client.setCurrentRoom(template.data._id);
    }
})