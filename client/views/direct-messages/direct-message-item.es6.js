Template.directMessageItem.events({
    'click'(event, template) {
        event.preventDefault();
        Client.setCurrentRoom(template.data._id);
    }
});

Template.directMessageItem.helpers({
    unreadCount() {
        return Session.get('unread_' + this._id);
    }
});
