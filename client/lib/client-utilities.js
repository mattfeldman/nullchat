scrollChatToBottom = function () {
    $("#roomContainer").scrollTop($("#scrollContainer").height());
};

scrollToMessage = function (messageId) {
    var message = $("#" + messageId);
    if (message) {
        var container = $("#roomContainer");
        container.scrollTop(container.scrollTop() + message.offset().top);
    }
};

setCurrentRoom = function (roomId) {
    Session.set('messageLimit', 10);
    Session.set('currentRoom', roomId);
    Meteor.call('setCurrentRoom', roomId);
    Meteor.call('setSeen', roomId);
    Session.set('unread_' + roomId, "");
};

incMessageLimit = function (inc) {
    Session.set("messageLimit", Session.get("messageLimit") + inc);
};

incRoomUnread = function (roomId) {
    var key = 'unread_' + roomId;
    Session.set(key, (Session.get(key) || 0) + 1);
};

// Set up a now session variable to allow for easy reactivity for date calculations involving 'now'
Meteor.setInterval(function () {
    Session.set("now", new Date());
}, 500);

/**
 * Shows a modal
 * @param templateName - template to render and make modal
 * @param data - data for template
 * @param options - options to render the modal with
 *
 * Assumes .templateName.modal modal container naming
 */
showModal = function (templateName, data, options) {
    var ModalContainer = $('.modal-container')[0];
    var modal = Blaze.renderWithData(Template[templateName], data, ModalContainer);
    options = _.extend(options || {}, {
        onHidden: function () {
            Blaze.remove(modal);
        },
        onVisible: function () {
            // Hack for scroll height from: https://github.com/Semantic-Org/Semantic-UI/issues/165
            $('.' + templateName + '.modal').modal("refresh");
        }
    });
    $('.' + templateName + '.modal').modal(options).modal('show');
};

/**
 * Shows a popup
 * @param targetNode - node to trigger and spawnpopup from
 * @param templateName - template to render as popup
 * @param data - data for template
 * @param options - options to render the popup with
 */
showPopup = function (targetNode, templateName, data, options) {
    var PopupContainer = this.$('.popup-container')[0];

    $("." + templateName).remove();
    var popup = Blaze.renderWithData(Template[templateName], data, PopupContainer);

    options = _.extend(options || {}, {
        popup: '.' + templateName,
        onHidden: function () {
            Blaze.remove(popup);
        },
        content:'Loading...',
        hoverable: true,
        closable: true,
        movePopup: true,
        delay: {
            show: 300,
            hide: 500
        }
    });

    $(targetNode).popup(options).popup('show');
};

/**
 * Adds text to the message input
 * @param {string} text - text to append
 *
 */
addTextToInput = function(text){
    var currentInput = $("#message").val();
    $("#message").val(currentInput + text);
}

freezeGif = function(i) {
    
    var c = document.createElement('canvas');
    var w = c.width = i.width;
    var h = c.height = i.height;
    c.getContext('2d').drawImage(i, 0, 0, w, h);

    for (var j = 0, a; a = i.attributes[j]; j++)
        c.setAttribute(a.name, a.value);
    i.parentNode.replaceChild(c, i);
}

