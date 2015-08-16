Client = {
    scrollChatToBottom() {
        $("#roomContainer").scrollTop($("#scrollContainer").height());
    },
    scrollToMessage(messageId) {
        const message = $("#" + messageId);
        if (message) {
            const container = $("#roomContainer");
            container.scrollTop(container.scrollTop() + message.offset().top);
        }
    },
    setCurrentRoom(roomId) {
        Session.set('messageLimit', 10);
        Session.set('currentRoom', roomId);
        Meteor.call('setCurrentRoom', roomId, AlertFeedback);
        Meteor.call('setSeen', roomId);
        Session.set('unread_' + roomId, "");
    },
    incMessageLimit(inc) {
        Session.set("messageLimit", Session.get("messageLimit") + inc);
    },
    incRoomUnread(roomId) {
        const key = 'unread_' + roomId;
        Session.set(key, (Session.get(key) || 0) + 1);
    },
    /*
     * Shows a modal
     * @param templateName - template to render and make modal
     * @param data - data for template
     * @param options - options to render the modal with
     *
     * Assumes .templateName.modal modal container naming
     */
    showModal(templateName, data, options) {
        const ModalContainer = $('.modal-container')[0];
        const modal = Blaze.renderWithData(Template[templateName], data, ModalContainer);
        const modalSettings = _.extend(options || {}, {
            onHidden() {
                Blaze.remove(modal);
            },
            onVisible() {
                // Hack for scroll height from: https://github.com/Semantic-Org/Semantic-UI/issues/165
                $(`.${templateName}.modal`).modal("refresh");
            }
        });
        $(`.${templateName}.modal`).modal(modalSettings).modal('show');
    },
    /*
     * Shows a popup
     * @param targetNode - node to trigger and spawnpopup from
     * @param templateName - template to render as popup
     * @param data - data for template
     * @param options - options to render the popup with
     */
    showPopup(targetNode, templateName, data, options) {
        const PopupContainer = $('.popup-container')[0];

        $("." + templateName).remove();
        const popup = Blaze.renderWithData(Template[templateName], data, PopupContainer);

        const popupSettings = _.extend(options || {}, {
            popup: '.' + templateName,
            onHidden() {
                Blaze.remove(popup);
            },
            content: 'Loading...',
            hoverable: true,
            closable: true,
            movePopup: true,
            delay: {
                show: 100,
                hide: 100
            }
        });

        $(targetNode).popup(popupSettings).popup('show');
    },
    /*
     * Adds text to the message input
     * @param {string} text - text to append
     *
     */
    addTextToInput(text) {
        const currentInput = $("#message").val();
        $("#message").val(currentInput + text);
    },
    editLatestMessage() {
        const lastMessage = Messages.findOne(
            {
                roomId: Session.get('currentRoom'),
                authorId: Meteor.userId()
            },
            {
                sort: {timestamp: -1},
                fields: {'_id': 1}
            }
        );
        Client.editMessage(lastMessage._id);
    },
    editMessage(id) {
        check(id, String);
        Session.set('editingId', id);
        Meteor.defer(() => $('.messageEditInput').focus());
    },
    stopEditing() {
        Session.set('editingId', '');
        Meteor.defer(() => $('#message').focus());
    }
};

// Set up a now session variable to allow for easy reactivity for date calculations involving 'now'
Meteor.startup(()=> {
    Meteor.setInterval(()=> {
        Session.set("now", new Date());
    }, 500);
    $(document).bind('keydown', 'Ctrl+up', Client.editLatestMessage);
});
