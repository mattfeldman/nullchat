Template.directMessageItem.events({
    'click': function (event, template) {
        event.preventDefault();
        Client.setCurrentRoom(template.data._id);
    }
});

Template.directMessageItem.helpers({
    unreadCount:function(){
        return Session.get('unread_'+this._id);
    }
});
