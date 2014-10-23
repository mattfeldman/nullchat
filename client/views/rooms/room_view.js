Template.roomView.helpers({
});

Template.roomView.events({
    'click #loadMore':function(e){
        e.preventDefault();
        Session.set('messageLimit', Session.get('messageLimit')+100);
    }
});