Template.messageContext.helpers({
    'messages':function(){
        return Messages.find({},{sort:{timestamp:1}});
    }
});

Template.messageContext.created = function(){
   Meteor.subscribe('message',this.data.messageId);
    Meteor.subscribe('messageContextAbove',this.data.messageId);
    Meteor.subscribe('messageContextBelow',this.data.messageId);
};