Template.userElement.helpers({
    user:function(){
        var user =  Meteor.users.findOne({_id:this.toString()});
        return user;
    }
});