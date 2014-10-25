Template.message.created=function(){
    this.user = Meteor.users.findOne({_id:this.data.authorId});
};
Template.message.helpers({
    myMessage: function(){
        return this.authorId === Meteor.userId() ? "my-message" : ""; // TODO: Be better
    },
    userName: function(){
        user = Template.instance().user;
        return user && user.username;
    },
    avatar: function(){
        user = Template.instance().user;
        if(user && user.profile && user.profile.avatar)
            return user.profile.avatar;
    },
    color: function(){
        user = Template.instance().user;
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