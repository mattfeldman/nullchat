var sendMessage = function (e) {
    e.preventDefault();
    var messageStub = {
        message: $("#message").val(),
        roomId: Session.get('currentRoom')
    };
    Meteor.call('message', messageStub, function (error, id) {

    });
    $("#message").val('');
    $("#roomContainer").scrollTop(100000); //TODO: This looks like an ugly hack
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
                }
            ],
            rooms: function () {
                return Rooms.find();
            }
        };
    }
});

Template.newMessage.events({
    'submit form': function (e) {
        sendMessage(e);
    },
    'keypress textarea': function (e) {
        throttledLastTyping();
        if (e.keyCode === 13) {
            sendMessage(e);
        }
    }
});
var throttledLastTyping = _.throttle(function () {
    Meteor.call('updateTypingActivity', Session.get('currentRoom'));
}, 1000);