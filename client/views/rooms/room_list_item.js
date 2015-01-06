Template.roomListItem.helpers({
    locked: function () {
        return this.isPrivate ? "[LOCKED] -" : "";
    },
    isSelectedClass: function () {
        return this._id === Session.get("currentRoom") ? "selected-room" : "";
    },
    notificationCount: function () {
        var count = Notifications.find({userId: Meteor.userId(), roomId: this._id, seen: false}).count();
        return count || "";
    },
    leaveLinkEnabled: function(){
        return this.ownerId === Meteor.userId() || Session.equals("currentRoom",this._id) ? "disabled" : "";
    }
});
Template.roomListItem.events({
    'click .leaveRoomButton':function(event, template){
        event.preventDefault();
        Meteor.call('leaveRoom',template.data._id);
    },
    'click .setRoomLink':function(event,template){
        event.preventDefault();
        setCurrentRoom(template.data._id);
    }
})