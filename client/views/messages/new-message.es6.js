var sendMessage = function (e) {
    e.preventDefault();
    if (!$("#message").val()) { return;}
    var messageStub = {
        message: $("#message").val(),
        roomId: Session.get('currentRoom')
    };
    Meteor.call('message', messageStub);
    $("#message").val('');
    Client.scrollChatToBottom();
};


var _typingDep = new Deps.Dependency;
Template.newMessage.helpers({
    typingUsers() {
        _typingDep.depend();
        const cutoff = new Date(new Date().getTime() - 5 * 1000);
        const typingUsers = Meteor.users.find({
            "status.lastActiveRoom": Session.get("currentRoom"),
            "status.lastTyping": {$gte: cutoff},
            "_id": {$ne: Meteor.userId()}
        }).fetch();

        const users = _.map(typingUsers, user => user.username).join(',');

        if (users) {
            Meteor.setTimeout(function() {
                _typingDep.changed();
            }, 5000);

            return users + " currently typing...";
        }
    },
    settings() {
        return {
            position: "top",
            limit: 5,
            rules: [
                {
                    collection: Emojis,
                    field: "name",
                    template: Template.emojiPill,
                    token: ':',
                    matchAll: false
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
                    collection: Rooms,
                    field: "name",
                    template: Template.roomPill,
                    token: '@#',
                    matchAll: false,
                },
                {
                    collection: Memes,
                    field: "searchName",
                    template: Template.memePill,
                    token: '/meme ',
                    matchAll: true
                }
            ]
        };
    }
});

const recallMessageWithNewOffset = function(offsetDelta) {
    const messageElement = $("#message");

    let offset = Session.get("offset") || 0;
    const findParams = {authorId: Meteor.userId(), type: 'plain'};
    if ((offset !== Messages.find(findParams).count() && offsetDelta > 0) || (offset !== 0 && offsetDelta < 0)) {
        offset = offset + offsetDelta;
    }
    Session.set("offset", offset);

    const message = Messages.findOne(findParams, {skip: offset, limit: 1, sort: {timestamp: -1}});
    if (message) {
        const currentVal = messageElement.val();
        if (Session.equals('lastmessage', currentVal) || currentVal === "") {
            messageElement.val(message.message);
            Session.set('lastmessage', message.message);
        }
    }
};
Template.newMessage.events({
    'mouseover .smile'(event, template) {
        Client.showPopup(event.target, "emojiPopup");
    },
    'click .send'(e) {
        sendMessage(e);
    },
    'keydown input'(e) {
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
    'focus'(e) {
        Session.set('unreadMessages', 0);
    },
    'paste'(e) {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        const blobItem = _(items).find(item => item.type.indexOf("image") === 0);

        if (blobItem) {
            const blob = blobItem.getAsFile();
            var reader = new FileReader();
            reader.onload = function(event) {
                var options = {};
                options.data = {};
                options.data.pasteImageUrl = event.target.result;
                Client.showModal("pasteImage", options.data);
            };

            reader.readAsDataURL(blob);
        }
    },
    'autocompleteselect input'(event, template, doc) {
        // This is a hack that uses unique properties to sort callbacks
        // because mizzao:meteor-autocomplete removed support for explicit callbacks
        // For now it seems all of the callbacks get shoved into this single event
        //
        // doc.searchName is defined IFF the callback is a meme autocomplete
        // doc.html is defined IFF the callback is a emoji autocomplete
        if (doc.searchName) {
            template.$(event.target).val("/meme " + doc.id + " ");
        }
        else if(doc.shortname) {
            const text = template.$(event.target).val();
            const newText = text.replace(':' + doc.name + ' ', doc.shortname + ' '); // Add trailing :
            template.$(event.target).val(newText);
        }
    },
    'click .gif.button'(event, template) {
        Client.showModal("giphyModal");
    },
    'click .meme.button'(event, template) {
        Client.showModal("memeModal");
    },
    'click .upload.button'(event, template) {
        Client.showModal("uploadModal");
    }
});

const throttledLastTyping = _.throttle(function () {
    Meteor.call('updateTypingActivity', Session.get('currentRoom'));
}, 1000, {trailing: false});