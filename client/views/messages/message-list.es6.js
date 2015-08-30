Template.messageList.helpers({
    messages() {
        return Messages.find({roomId: Session.get('currentRoom')}, {sort: {timestamp: 1}});
    },
    shouldShowLoadMore() {
        return Session.get('messageLimit') === Messages.find({roomId: Session.get('currentRoom'), type: 'plain'}).count();
    }
});

Template.messageList.onCreated(function () {
    Client.scrollChatToBottom();
});

Template.messageList.events({
    'click .loadMore'(event, template) {
        Session.set('messageLimit', Session.get('messageLimit') + 50);
        Client.focusMessageEntry();
    }
});
