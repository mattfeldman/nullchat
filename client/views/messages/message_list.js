Template.messageList.helpers({
    messages: function() {
        return Messages.find({roomId: Session.get('currentRoom')}, {sort: {timestamp: 1}});
    },
    shouldShowLoadMore: function(){
        return Session.get('messageLimit') === Messages.find({roomId: Session.get('currentRoom'),type:'plain'}).count();
    }
});

Template.messageList.created = function(){
    scrollChatToBottom();
};
Template.messageList.events({
   'click .loadMore':function(event,template){
       Session.set('messageLimit',Session.get('messageLimit')+20);
   }
});
