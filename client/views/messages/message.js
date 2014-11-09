Template.message.created = function () {

};
Template.message.helpers({
    myMessage: function () {
        return this.authorId === Meteor.userId() ? "my-message" : ""; // TODO: Be better
    },
    user: function () {
        return Meteor.users.findOne({_id: this.authorId});
    },
    color: function () {
        var user = Meteor.users.findOne({_id: this.authorId});
        if (user && user.profile && user.profile.color) {
            return "border-left: 3px solid" + user.profile.color;
        }
        else {
            return "border-left: 3px solid transparent";
        }
    },
    showTimestamp: function () {
        var d = new Date(this.timestamp);
        return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    },
    isPlain: function () {
        return this.type === "plain";
    },
    isImage: function () {
        return this.type === "rich" && this.layout === "image";
    },
    isFeedback: function () {
        return this.type === "feedback";
    }
});