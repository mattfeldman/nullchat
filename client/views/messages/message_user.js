Template.messageUser.rendered = function () {

}
Template.messageUser.helpers({
    'username': function () {
        var user = Meteor.users.findOne({_id:this.toString()},{fields:{"username":1}});
        return user.username;
    },
    'avatar': function () {
        var user = Meteor.users.findOne({_id:this.toString()},{fields:{"profile.avatar":1}});
        return user.profile.avatar;
    }
});