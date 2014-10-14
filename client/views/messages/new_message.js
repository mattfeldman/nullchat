Template.newMessage.events({
    'submit form': function (e) {
        e.preventDefault();
        var messageStub = {
            message: $(e.target).find('[name=message]').val(),
            roomId: Session.get('currentRoom')
        };
        Meteor.call('message', messageStub, function (error, id) {

        });
        $(e.target).find('[name=message]').val('');
    }
});