function parseRoomLinks(message) {
    var rooms = Rooms.find({}).fetch();
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
Template.message.helpers({
    myMessage: function () {
        return this.authorId === Meteor.userId() ? "my-message" : "";
    },
    user: function () {
        return Meteor.users.findOne({_id: this.authorId}); //TODO: This is causing a lot of updates
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
    },
    hasMention: function () {
        return this.authorId !== Meteor.userId() && hasUserMentions(this.message) ? "has-mention" : "";
    },
    finalMessageBody: function () {
        if (this.message && typeof  this.message === "string") {
            return emojify.replace(parseRoomLinks(this.message));
        }
    },
    emojifiedMessage: function () {
    }
});
Template.message.events({
    "click .likeMessageLink": function (event, template) {
        console.log(template);
        Meteor.call('likeMessage', template.data._id);
    },
    "click .roomLink": function (event, template) {
        var roomId = $(event.target).data("roomid");
        setCurrentRoom(roomId);
    }
});
