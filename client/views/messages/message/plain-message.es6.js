/**
 * Creates the timestamp popup
 * @param target is a dom element to show the popup on
 * @param timestamp is the timestamp to use for the popup
 */
function createTimestampPopup(target, timestamp) {
    const m = moment(timestamp);
    $(target).popup({
        title: m.fromNow(),
        content: m.format("dddd, MMMM Do YYYY"),
        position: "top right"
    }).popup('show');
}

Template.plainMessage.helpers({
    hasEdits() {
        return this.lastedited;
    },
    lastEditTime() {
        if (!this.lastedited) {
            return;
        }
        return moment(this.lastedited).format("h:mm:ss a");
    },
    showTimestamp() {
        const m = moment(new Date(this.timestamp));
        const user = Meteor.users.findOne({_id: Meteor.userId()}, {fields: {"profile.use24HrTime": 1}});
        return user && user.profile && user.profile.use24HrTime ? m.format("HH:mm:ss") : m.format("hh:mm:ss a");
    },
    isUnderEdit() {
        return Session.get('editingId') === this._id;
    },
    canEdit() {
        return this.authorId === Meteor.userId();
    },
    hasMention() {
        return this.authorId !== Meteor.userId() && MessageLib.hasUserMentions(this.message) ? "has-mention" : "";
    },
    finalMessageBody() {
        return MessageLib.renderMessage(this.message);
    },
    starIcon() {
        return _(this.likedBy).contains(Meteor.userId()) ? "fa-star" : "fa-star-o";
    },
    fontSizePercent() {
        const parentContext = Template.instance().parentTemplate();
        if (parentContext && parentContext.supressStarSizing) {
            return 100;
        }
        if (this.likedBy.length === 0) {
            return 100;
        }
        const room = Rooms.findOne({_id: this.roomId}, {fields: {users: 1}});
        if (!room || !room.users || room.users.length < 1) {
            return 100;
        }
        switch (this.likedBy.length || 0) {
        case 0:
            return 100;
        case 1:
            return 166;
        case 2:
            return 232;
        default:
            return 300;
        }
    },
    continuedMessage() {
        const user = Meteor.users.findOne({_id: Meteor.userId()}, {fields: {"profile.continueMessages": 1}});
        return  user &&
                user.profile &&
                user.profile.continueMessages &&
                Template.instance().continuedMessage.get();
    }
});

Template.plainMessage.events({
    'click .likeMessageLink'(event, template) {
        event.preventDefault();

        if (!_(this.likedBy).contains(Meteor.userId())) {
            Meteor.call('likeMessage', template.data._id, AlertFeedback);
        }
        else {
            Meteor.call('unlikeMessage', template.data._id, AlertFeedback);
        }
    },
    'dblclick, click .editMessageButton'(event, template) {
        if (template.data.authorId === Meteor.userId()) {
            Client.editMessage(template.data._id);
        }
    },
    'submit .editForm'(event, template) {
        event.preventDefault();
        const newMessage = template.find('input[name=newMessageText]').value;

        Meteor.call('editMessage', {_id: template.data._id, message: newMessage});
        Client.stopEditing();
    },
    'click .cancelEditSubmit'() {
        Client.stopEditing();
    },
    'mouseenter .message-timestamp'(event, template) {
        createTimestampPopup(event.target, template.data.timestamp);
    },
    'mouseenter .message-user-mention'(event, template) {
        const userId = $(event.target).data("userid");
        Client.showPopup(event.target, "userProfileCard", userId);
    },
    'mouseenter .likeMessageLink'(event, template) {
        Client.showPopup(event.target, "starredByListPopup", template.data._id);
    },
    'click .removeMessageButton'(event, template) {
        event.preventDefault();
        if (confirm("Are you sure you want to delete this message?")) {
            Meteor.call('removeMessage', template.data._id);
        }
    },
    'mouseenter .user-popup'(event, template) {
        Client.showPopup(event.target, "userProfileCard", template.data.authorId);
    },
    'keydown .editForm'(event, template) {
        if (event.keyCode === 27) {
            Client.stopEditing();
            event.preventDefault();
        }
    }
});
function shouldContinue(message, previousMessageId) {
    const prevMessage = Messages.findOne({_id: previousMessageId});
    return prevMessage && message && prevMessage.authorId === message.authorId &&
        (message.timestamp - prevMessage.timestamp) < 60000;
}
Template.plainMessage.onCreated(function () {
    this.continuedMessage = new ReactiveVar(false);
});
Template.plainMessage.onRendered(function () {
    this.$('.ui.accordion').accordion();
    Meteor.defer(() => {
        const prevId = this.$('.comment').prev().attr("id");
        this.continuedMessage.set(shouldContinue(this.data, prevId));
    });
});

