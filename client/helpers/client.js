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
    Session.set('unread_'+roomId,"");
};

incMessageLimit = function(inc){
    Session.set("messageLimit",Session.get("messageLimit")+inc);
};

incRoomUnread = function(roomId) {
    var key = 'unread_'+roomId;
    Session.set(key,(Session.get(key) || 0) +1);
};

// Set up a now session variable to allow for easy reactivity for date calculations involving 'now'
Meteor.setInterval(function(){
    Session.set("now",new Date());
},500);


// Assumes .templateName.modal modal container naming
showModal = function(templateName, data, options){
    var ModalContainer = $('.modal-container')[0];
    var modal = Blaze.renderWithData(Template[templateName],data,ModalContainer);
    $('.'+templateName+'.modal').modal({
        onHidden:function(){Blaze.remove(modal);},
    }).modal('show');
}

showPopup = function(targetNode, templateName, data, options){
    var PopupContainer = this.$('.popup-container')[0];
    var popup = Blaze.renderWithData(Template[templateName],data,PopupContainer);
    $(targetNode).popup({
        popup:'.'+templateName,
        //position: "right center",
        onHidden:function(){Blaze.remove(popup);},
        hoverable: true,
        closable: true,
        movePopup: true,
        delay: {
            show: 300,
            hide: 500
        }
    });//.popup('show');
};