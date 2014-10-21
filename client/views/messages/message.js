Template.message.helpers({
    myMessage: function(){
        return this.author === Meteor.user().username ? "my-message" : ""; // TODO: Be better
    }
});