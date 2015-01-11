scrollChatToBottom = function() {
    $("#roomContainer").scrollTop($("#scrollContainer").height());
};

scrollToMessage = function(messageId){
    var message = $("#"+messageId);
    if(message){
        var container = $("#roomContainer");
        container.scrollTop(container.scrollTop() + message.offset().top);
    }
};

setCurrentRoom = function(roomId){
    Session.set('messageLimit', 10);
    Session.set('currentRoom',roomId);
    Meteor.call('setCurrentRoom',roomId);
    Meteor.call('setSeen',roomId);
};

incMessageLimit = function(inc){
    Session.set("messageLimit",Session.get("messageLimit")+inc);
};

Meteor.startup(function() {
    // These need to be set in order for the function below to be reactive
    Session.set('unreadMessages', 0);
    Session.set('currentRoom', -1);
    Deps.autorun(function() {
        var numberOfUnreadMessages = Session.get('unreadMessages');
        var currentRoom = Rooms.findOne({_id: Session.get('currentRoom')});

        var currentRoomString = '';

        if(currentRoom) {
            currentRoomString = '#' + currentRoom.name + ' ';
        }

        if(numberOfUnreadMessages > 0) {
            document.title = "(" + numberOfUnreadMessages + ")" + " " + currentRoomString + window.location.hostname;
        } else {
            document.title = currentRoomString + window.location.hostname;
        }
    });
});