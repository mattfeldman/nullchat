Template.newMessage.events({
    'submit form':function(e){
        e.preventDefault();
        var message = $(e.target).find('[name=message]').val();
            Meteor.call('message', message, function (error, id) {

            });
        $(e.target).find('[name=message]').val('');
    }
});