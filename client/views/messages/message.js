Template.message.helpers({
    myMessage: function(){
        return this.authorId === Meteor.userId() ? "my-message" : ""; // TODO: Be better
    },
    userName: function(){
        return Meteor.users.findOne({_id:this.authorId}).username;
    },
    avatar: function(){
        return Meteor.users.findOne({_id:this.authorId}).profile.avatar;
    },
    color: function(){
        user = Meteor.users.findOne({_id:this.authorId});
        if(user && user.profile.color){
            return "border-left: 3px solid"+user.profile.color;
        }
        else{
            return "border-left: 3px solid transparent";
        }
    }
});