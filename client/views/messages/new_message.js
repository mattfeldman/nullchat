var sendMessage = function (e) {
    e.preventDefault();
    var messageStub = {
        message: $("#message").val(),
        roomId: Session.get('currentRoom')
    };
    Meteor.call('message', messageStub, function (error, id) {

    });
    $("#message").val('');
    scrollChatToBottom(); //TODO: This looks like an ugly hack
};


var _typingDep = new Deps.Dependency;
Template.newMessage.helpers({
    typingUsers: function () {
        _typingDep.depend();

        var cutoff = new Date(new Date().getTime() - 15 * 1000); // This timeout is odd; possible latency compensation at play?
        var typingUsers = Meteor.users.find({
            "status.lastActiveRoom": Session.get("currentRoom"),
            "status.lastTyping": {$gte: cutoff}
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
                        var newText = text.replace(':'+doc.name+' ',':'+doc.name+': '); // Add trailing :
                        $(element).val(newText);
                    }
                },
                {
                    collection: Meteor.users,
                    field: "username",
                    template: Template.userPill,
                    token: '@',
                    matchAll: false,
                    callback: function (doc, element) {
                        //$(element).val(newText);
                    }
                }
            ],
            rooms: function () {
                return Rooms.find();
            }
        };
    }
});

var recallMessageWithNewOffset = function(offsetDelta){
    var offset = Session.get("offset");
    var findParams = {authorId:Meteor.userId(),type:'plain'};
    if(offset === Messages.find(findParams).count() && offsetDelta > 0) return;
    if(offset === 0 && offsetDelta < 0) return;
    offset = offset+offsetDelta || 0;
    Session.set("offset",offset);

    var message = Messages.findOne(findParams,{skip:offset,limit:1, sort: {timestamp: -1}});
    if(message) {
        $("#message").val(message.message);
    }
}

Template.newMessage.events({
    'submit form': function (e) {
        sendMessage(e);
    },
    'keydown textarea': function (e) {
        throttledLastTyping();

        switch(e.keyCode){
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
    }
});
var throttledLastTyping = _.throttle(function () {
    Meteor.call('updateTypingActivity', Session.get('currentRoom'));
}, 1000);