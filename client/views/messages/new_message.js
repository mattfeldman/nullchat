var sendMessage = function (e) {
    e.preventDefault();
    if (!$("#message").val()) { return;}
    var messageStub = {
        message: $("#message").val(),
        roomId: Session.get('currentRoom')
    };
    Meteor.call('message', messageStub);
    $("#message").val('');
    scrollChatToBottom(); //TODO: This looks like an ugly hack
};


var _typingDep = new Deps.Dependency;
Template.newMessage.helpers({
    typingUsers: function () {
        _typingDep.depend();
        var cutoff = new Date(new Date().getTime() - 5 * 1000);
        var typingUsers = Meteor.users.find({
            "status.lastActiveRoom": Session.get("currentRoom"),
            "status.lastTyping": {$gte: cutoff},
            "_id": {$ne: Meteor.userId()}
        }).fetch();

        var users = _.map(typingUsers, function (user) {
            return user.username;
        }).join(',');

        if (users) {
            Meteor.setTimeout(function () {
                _typingDep.changed();
            }, 5000);

            return users + " currently typing...";
        }
    },
    settings: function () {
        return {
            position: "top",
            limit: 5,
            rules: [
                {
                    collection: Emojis,
                    field: "name",
                    template: Template.emojiPill,
                    token: ':',
                    matchAll: false,
                    callback: function (doc, element) {
                        var text = $(element).val();
                        var newText = text.replace(':' + doc.name + ' ', ':' + doc.name + ': '); // Add trailing :
                        $(element).val(newText);
                    }
                },
                {
                    collection: Meteor.users,
                    field: "username",
                    template: Template.userPill,
                    token: '@',
                    matchAll: false,
                },
                {
                    collection: Rooms,
                    field: "name",
                    template: Template.roomPill,
                    token: '#',
                    matchAll: false,
                },
                {
                    collection: Memes,
                    field: "searchName",
                    template: Template.memePill,
                    token: '/meme ',
                    matchAll: true,
                    callback: function (doc, element) {
                        $(element).val("/meme " + doc.id + " ");
                    }
                }
            ],
            rooms: function () {
                return Rooms.find();
            }
        };
    }
});

var recallMessageWithNewOffset = function (offsetDelta) {
    var messageElement = $("#message");

    var offset = Session.get("offset") || 0;
    var findParams = {authorId: Meteor.userId(), type: 'plain'};
    if ((offset !== Messages.find(findParams).count() && offsetDelta > 0) || (offset !== 0 && offsetDelta < 0)) {
        offset = offset + offsetDelta;
    }
    Session.set("offset", offset);

    var message = Messages.findOne(findParams, {skip: offset, limit: 1, sort: {timestamp: -1}});
    if (message) {
        var currentVal = messageElement.val();
        if (Session.equals('lastmessage', currentVal) || currentVal === "") {
            messageElement.val(message.message);
            Session.set('lastmessage', message.message);
        }
    }
};

Template.newMessage.events({
    'click .send': function (e) {
        sendMessage(e);
    },
    'keydown input': function (e) {
        throttledLastTyping();

        switch (e.keyCode) {
            case 13: // Return Key
                sendMessage(e);
                break;
            case 38: // Up Arrow Key
                recallMessageWithNewOffset(1);
                break;
            case 40: // Down Arrow Key
                recallMessageWithNewOffset(-1);
                break;
            default:
                break;
        }
    },
    'focus': function (e) {
        Session.set('unreadMessages', 0);
    },
    'paste': function (e) {
        var items = (e.clipboardData || e.originalEvent.clipboardData).items;
        var blob;

        var blobItem = _(items).find(function (item) {
            return item.type.indexOf("image") === 0;
        });

        if (blobItem) {
            blob = blobItem.getAsFile();
            var reader = new FileReader();
            reader.onload = function (event) {
                var options = {};
                options.data = {};
                options.data.pasteImageUrl = event.target.result;
                showModal("pasteImage", options.data);
            };

            reader.readAsDataURL(blob);
        }
    }
});

var throttledLastTyping = _.throttle(function () {
    Meteor.call('updateTypingActivity', Session.get('currentRoom'));
}, 1000, {trailing: false});

Template.newMessage.created = function () {
    Session.get("offset");
}