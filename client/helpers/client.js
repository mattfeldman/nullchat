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
}