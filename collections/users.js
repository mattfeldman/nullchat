Meteor.methods({
   'updateTypingActivity':function(room){
       //TODO: Validate room
       var timestamp = new Date();
       Meteor.users.update({_id:Meteor.userId()},{$set:{"status.lastTyping":timestamp,"status.lastActiveRoom":room}});
   }
});