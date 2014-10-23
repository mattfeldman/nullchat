Template.message.helpers({
    myMessage: function(){
        return this.authorId === Meteor.userId() ? "my-message" : ""; // TODO: Be better
    },
    userName: function(){
        user = Meteor.users.findOne({_id:this.authorId});
        return user && user.username;
    },
    avatar: function(){
        user = Meteor.users.findOne({_id:this.authorId});
        if(user && user.profile && user.profile.avatar)
            return user.profile.avatar;
    },
    color: function(){
        user = Meteor.users.findOne({_id:this.authorId});
        if(user && user.profile && user.profile.color){
            return "border-left: 3px solid"+user.profile.color;
        }
        else{
            return "border-left: 3px solid transparent";
        }
    },
    showTimestamp:function(){
        return new Date(this.timestamp);
    }
});