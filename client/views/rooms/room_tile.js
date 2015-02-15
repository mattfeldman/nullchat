Template.roomTile.events({
    'click .room.card':function(event,template){
        Meteor.call('joinRoom',template.data._id);
    }
});
Template.roomTile.helpers({
  'myRoomClass':function(){
      return _(this.users).contains(Meteor.userId()) ? "my-room" : "";
  }
});