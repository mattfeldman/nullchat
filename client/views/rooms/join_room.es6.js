Template.joinRoom.helpers({
    settings() {
        return {
            position: "bottom",
            limit: 5,
            rules: [
                {
                    collection: Rooms,
                    field: "name",
                    template: Template.roomPill,
                    matchAll: true
                }
            ]
        };
    }
});

Template.joinRoom.events({
    'autocompleteselect input'(event, template, doc) {
        Meteor.call('joinRoom', doc._id, (err, data) => {
            if (!err) {
                Client.setCurrentRoom(data);
                template.$('input').val('');
                $("#message").focus();
            }
        });
    }
});

Template.joinRoom.onRendered(function() {
    jQuery.hotkeys.options.filterInputAcceptingElements = false;
    jQuery.hotkeys.options.filterTextInputs = false;

    $(document).bind('keydown', 'ctrl+q', () => {
        this.$('input').focus();
    });
});
