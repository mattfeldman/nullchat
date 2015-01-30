Template.discoverRooms.helpers({
   unreadCountBadge:function(){
       var count = RoomInvitations.find({invitedUser:Meteor.userId(),active:true}).count();
       if(count){
           return "data-unread="+count;
       }
   }
});

Template.discoverRooms.events({
    'click #discoverRooms':function(event,template){
        AntiModals.overlay("rooms");
    }
});

Template.discoverRooms.created = function(){
    var instance = this;
    instance.roomInvitationsSub = Meteor.subscribe("roomInvitations");
};

Template.discoverRooms.destroyed = function(){
    if(instance.roomInvitationsSub){
        instance.roomInvitationsSub.stop();
    }
};