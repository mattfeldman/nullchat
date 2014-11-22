Template.messageList.helpers({
    messages: function() {
        return Messages.find({roomId: Session.get('currentRoom')}, {sort: {timestamp: 1}});
    }
});

Template.messageList.created = function(){
    console.log("rendered");
    scrollChatToBottom();
};
