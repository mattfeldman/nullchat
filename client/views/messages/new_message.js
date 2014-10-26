var sendMessage = function(e){
    e.preventDefault();
    var messageStub = {
        message: $("#message").val(),
        roomId: Session.get('currentRoom')
    };
    Meteor.call('message', messageStub, function (error, id) {

    });
    $("#message").val('');
};


Template.newMessage.events({
    'submit form': function (e) {
        sendMessage(e);
    },
    'keypress textarea':function(e){
        if(e.keyCode === 13){
            sendMessage(e);
        }
    }
});