function parseRoomLinks(message) {
    var rooms = Rooms.find({}).fetch();
    rooms = _.sortBy(rooms, function (room) {
        return -room.name.length;
    }); // TODO: Not this every message
    var loc = -1;
    while ((loc = message.indexOf("#", loc + 1)) >= 0) {
        for (var i = 0; i < rooms.length; i++) {
            var roomName = rooms[i].name;
            if (message.indexOf(rooms[i].name, loc) === loc + 1) {
                var leftHalf = message.substring(0, loc);
                var middle = '<a href="#" class="roomLink" data-roomId="' + rooms[i]._id + '">#' + roomName + '</a>';
                var rightHalf = message.substring(loc + roomName.length + 1, message.length + middle.length);
                message = leftHalf + middle + rightHalf;
                loc = loc + middle.length - 1;
                break;
            }
        }
    }
    return message;
}
function hasUserMentions(message) {
    if (!message || typeof  message !== "string") return false;
    var regex = new RegExp("[@\\s]+(" + Meteor.user().username + ")($|[\\s!.?]+)");
    var regexMatch = message.match(regex);

    return regexMatch && regexMatch.length > 0;
}
Template.message.created = function () {
    Messages.find({_id: this.data._id}).observeChanges({
        changed: function (id, fields) {
            if (fields.message) {
                var animateElement = $("#" + id + " .clickableMessageBody");
                animateElement.removeClass('animated flipInX');
                Meteor.setTimeout(function () {
                    animateElement.addClass('animated flipInX');
                }, 1);
            }
            if (fields.likedBy) {
                var animateElement = $("#" + id + " .likedBy");
                //animateElement.removeClass('animated tada');
                //Meteor.setTimeout(function () {
                //    animateElement.addClass('animated tada');
                //},1);
                triggerCssAnimation(animateElement, 'flipInY');
            }
        }
    });
};
Template.message.helpers({
    myMessage: function () {
        return this.authorId === Meteor.userId() ? "my-message" : "";
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
    hasEdits: function () {
        return this.lastedited;
    },
    lastEditTime: function () {
        if (!this.lastedited) return;
        return moment(this.lastedited).format("h:mm:ss a");
    },
    showTimestamp: function () {
        var d = new Date(this.timestamp);
        return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
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
            var emojiString = emojify.replace(parseRoomLinks(this.message));
            return Autolinker.link(emojiString, {twitter: false, className: "message-link"});
        }
    },
    emojifiedMessage: function () {
    }
});
Template.message.events({
    "click .likeMessageLink": function (event, template) {
        event.preventDefault();
        var element = $("#" + template.data._id + " .likedBy");
        triggerCssAnimation(element, 'flipInY');
        Meteor.call('likeMessage', template.data._id);
    },
    "click .roomLink": function (event, template) {
        var roomId = $(event.target).data("roomid");
        var room = Rooms.findOne({_id: roomId});
        if (room && !_(room.users).contains(Meteor.userId())) {
            Meteor.call('joinRoom', roomId);
        }
        setCurrentRoom(roomId);
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
    "click .canceleEditSubmit": function (event, template) {
        Session.set('editingId', "");
    }
});

triggerCssAnimation = function (element, animation) {
    var animateElement = element;
    animateElement.removeClass('animated ' + animation);
    Meteor.setTimeout(function () {
        animateElement.addClass('animated ' + animation);
    }, 1);
};
