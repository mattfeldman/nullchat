Template.roomInvitation.helpers({
    'user':function(){
        return Meteor.users.findOne({_id:this.invitingUser});
    },
    'room':function(){
        return Rooms.findOne({_id:this.roomId});
    },
    'agoText':function(){
        return moment(this.timestamp).fromNow();
    }
});
Template.roomInvitation.events({
    'click .room-invitation-accept':function(event,template){
        Meteor.call('acceptRoomInvitation',template.data._id);
        event.preventDefault();
    },
    'click .room-invitation-dismiss':function(event,template){
        Meteor.call('dismissRoomInvitation',template.data._id);
        event.preventDefault();
    }
});