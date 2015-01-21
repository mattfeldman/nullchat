Template.roomTile.events({
    'click .room-tile':function(event,template){
        Meteor.call('joinRoom',template.data._id);
    }
});