Template.roomView.helpers({
    room: function(){
        return Rooms.findOne({_id:Session.get('currentRoom')});
    }
});

Template.roomView.events({
    'click #loadMore':function(e){
        e.preventDefault();
        Session.set('messageLimit', Session.get('messageLimit')+100);
    }
});