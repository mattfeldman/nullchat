Template.message.helpers({
    myMessage: function(){
        return this.authorId === Meteor.userId() ? "my-message" : ""; // TODO: Be better
    },
    userName: function(){
        return Meteor.users.findOne({_id:this.authorId}).username;
    },
    avatar: function(){
        return Meteor.users.findOne({_id:this.authorId}).profile.avatar;
    }
});