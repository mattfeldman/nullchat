/**
 * Creates the timestamp popup
 * @param target is a dom element to show the popup on
 * @param timestamp is the timestamp to use for the popup
 */
function createTimestampPopup(target, timestamp) {
    var m = moment(timestamp);
    $(target).popup({
        title: m.fromNow(),
        content: m.format("dddd, MMMM Do YYYY"),
        //popup: '.timestampPopup',
        position: "top right"
        //hoverable: true,
        //movePopup: true
    }).popup('show');
}

Template.plainMessage.helpers({
    hasEdits: function () {
        return this.lastedited;
    },
    lastEditTime: function () {
        if (!this.lastedited) {
            return;
        }
        return moment(this.lastedited).format("h:mm:ss a");
    },
    showTimestamp: function () {
        var m = moment(new Date(this.timestamp));
        var user = Meteor.users.findOne({_id: Meteor.userId()}, {fields: {"profile.use24HrTime": 1}});
        return user && user.profile && user.profile.use24HrTime ? m.format("HH:mm:ss") : m.format("hh:mm:ss a");
    },
    isUnderEdit: function () {
        return Session.get('editingId') === this._id;
    },
    canEdit: function () {
        return this.authorId === Meteor.userId();
    },
    hasMention: function () {
        return this.authorId !== Meteor.userId() && hasUserMentions(this.message) ? "has-mention" : "";
    },
    finalMessageBody: function () {
        return renderMessage(this.message);
    },
    starIcon: function () {
        return _(this.likedBy).contains(Meteor.userId()) ? "fa-star" : "fa-star-o";
    },
    fontSizePercent: function () {
        var parentContext = Template.instance().parentTemplate();
        if (parentContext && parentContext.supressStarSizing) {
            return 100;
        }
        if (this.likedBy.length === 0) {
            return 100;
        }
        var room = Rooms.findOne({_id: this.roomId}, {fields: {users: 1}});
        if (!room || !room.users || room.users.length < 1) {
            return 100;
        }
        switch (this.likedBy.length || 0){
            case 0: return 100;
            case 1: return 166;
            case 2: return 232;
            default: return 300;
        }
    }
});

Template.plainMessage.events({
    "click .likeMessageLink": function (event, template) {
        event.preventDefault();

        if (!_(this.likedBy).contains(Meteor.userId())) {
            Meteor.call('likeMessage', template.data._id);
        }
        else {
            Meteor.call('unlikeMessage', template.data._id);
        }

    },
    "dblclick, click .editMessageButton": function (event, template) {
        if (template.data.authorId === Meteor.userId()) {
            Session.set('editingId', template.data._id);
        }
    },
    "submit .editForm": function (event, template) {
        event.preventDefault();
        var newMessage = template.find('input[name=newMessageText]').value;

        Meteor.call('editMessage', {_id: template.data._id, message: newMessage});
        Session.set('editingId', "");
    },
    "click .canceleEditSubmit": function () {
        Session.set('editingId', "");
    },
    'mouseenter .message-timestamp': function (event, template) {
        createTimestampPopup(event.target, template.data.timestamp);
    },
    'mouseenter .message-user-mention': function (event, template) {
        var userId = $(event.target).data("userid");
        showPopup(event.target, "userProfileCard", userId);
    },
    'mouseenter .likeMessageLink' : function(event, template){
        var userId = $(event.target).data("userid");
        showPopup(event.target, "starredByListPopup", template.data._id);
    },
    'click .removeMessageButton': function (event, template) {
        event.preventDefault();
        if(confirm("Are you sure you want to delete this message?")) {
            Meteor.call('removeMessage', template.data._id);
        }
    }
});
Template.plainMessage.onRendered(function(){
    this.$('.ui.accordion').accordion();
});