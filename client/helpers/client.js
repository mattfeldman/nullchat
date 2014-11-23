scrollChatToBottom = function() {
    $("#roomContainer").scrollTop(100000);
};

scrollToMessage = function(messageId){
    var message = $("#"+messageId);
    if(message){
        var container = $("#roomContainer");
        container.scrollTop(container.scrollTop() + message.offset().top);
    }
};

setCurrentRoom = function(roomId){
    Session.set('currentRoom',roomId);
}