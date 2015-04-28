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

/**
 * Parses @mentions in messages
 * @param message
 * @returns message with html name replacements
 */
function parseNameMentions(message) {
    var users = Meteor.users.find({}, {fields: {'_id': 1, 'username': 1, 'profile.color': 1}}).fetch();
    users = _(users).sortBy(function (user) {
        return -user.username.length;
    }); // TODO: Not this every message
    var loc = -1;
    while ((loc = message.indexOf("@", loc + 1)) >= 0) {
        for (var i = 0; i < users.length; i++) {
            var userName = users[i].username;
            if (message.indexOf(userName, loc) === loc + 1) {
                var leftHalf = message.substring(0, loc);
                var userColor = (users[i].profile && users[i].profile.color) || "black";
                var styleString = 'style="border-bottom: 2px solid ' + userColor + ';' + 'background: ' + tinycolor(userColor).setAlpha(0.075).toRgbString() + ';"';
                var middle = '<span class="message-user-mention" ' + styleString + ' data-userId="' + users[i]._id + '">@' + userName + '</span>';
                var rightHalf = message.substring(loc + userName.length + 1, message.length + middle.length);
                message = leftHalf + middle + rightHalf;
                loc = loc + middle.length - 1;
                break;
            }
        }
    }
    return message;
}

/**
 * Determines if message contains current users username
 * @param message
 * @returns true if message contains current username, false otherwise
 */
function hasUserMentions(message) {
    if (!message || typeof  message !== "string") {return false;}
    var regex = new RegExp("[@\\s]+(" + Meteor.user({}, {fields: {'username': 1}}).username + ")($|[\\s!.?]+)");
    var regexMatch = message.match(regex);

    return regexMatch && regexMatch.length > 0;
}

Template.message.helpers({
    myMessage: function () {
        return this.authorId === Meteor.userId() ? "my-message" : "";
    },
    color: function () {
        var user = Meteor.users.findOne({_id: this.authorId}, {fields: {'profile.color': 1}});
        if (user && user.profile && user.profile.color) {
            return "border-left: 3px solid" + user.profile.color;
        }
        else {
            return "border-left: 3px solid transparent";
        }
    },
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
    isPlain: function () {
        return this.type === "plain";
    },
    isRich: function () {
        return this.type === "rich";
    },
    layoutName: function () {
        return this.layout + "Message";
    },
    isFeedback: function () {
        return this.type === "feedback";
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
        if (this.message && typeof(this.message) === "string") {
            var emojiString = emojify.replace(parseRoomLinks(parseNameMentions(_s.escapeHTML(this.message))));
            return Autolinker.link(emojiString, {twitter: false, className: "message-link"});
        }
    },
    starIcon: function () {
        return _(this.likedBy).contains(Meteor.userId()) ? "fa-star" : "fa-star-o";
    },
    starSizingStyle: function () {
        var parentContext = Template.instance().parentTemplate();
        if (parentContext && parentContext.supressStarSizing) {
            return "";
        }
        if (this.likedBy.length === 0) {
            return "";
        }
        var room = Rooms.findOne({_id: this.roomId}, {fields: {users: 1}});
        if (!room || !room.users || room.users.length < 1) {
            return "";
        }
        var scale = this.likedBy.length / (room.users.length / 1.5);
        var bonus = 400;
        var total = 100 + _.min([bonus * scale, 400]);
        return "font-size: " + total + "%;";
    }
});

Template.message.events({
    "click .likeMessageLink": function (event, template) {
        event.preventDefault();

        if (!_(this.likedBy).contains(Meteor.userId())) {
            Meteor.call('likeMessage', template.data._id);
        }
        else {
            Meteor.call('unlikeMessage', template.data._id);
        }

    },
    "click .editMessageButton": function (event, template) {
        if (template.data.authorId === Meteor.userId()) {
            Session.set('editingId', template.data._id);
        }
    },
    "click .messageEditSubmit": function (event, template) {
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
        Meteor.call('removeMessage', template.data._id);
    },
});