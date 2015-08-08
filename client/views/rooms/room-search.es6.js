Template.roomSearch.helpers({
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

Template.roomSearch.events({
    'autocompleteselect input'(event, template, doc) {
        Meteor.call('joinRoom', doc._id, (err, data) => {
            AlertFeedback(err, data);
            if (!err) {
                Client.setCurrentRoom(data);
                template.$('input').val('');
                $("#message").focus();
            }
        });
    }
});

Template.roomSearch.onRendered(function () {
    jQuery.hotkeys.options.filterInputAcceptingElements = false;
    jQuery.hotkeys.options.filterTextInputs = false;

    $(document).bind('keydown', 'ctrl+q', () => {
        this.$('input').focus();
    });
});
