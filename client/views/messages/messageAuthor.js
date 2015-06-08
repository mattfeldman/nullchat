Template.messageAuthor.events({
    'click': function (event, template) {
        var authorId = template.data;
        if (!authorId || authorId === Meteor.userId()) return;
        Meteor.call('getDirectMessageRoom', authorId, function (err, data) {
            if (!err && data && !Session.equals('currentRoom',data)) {
                setCurrentRoom(data);
            }
        });
    }
});