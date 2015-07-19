Template.directMessageUserSearch.helpers({
    settings() {
        return {
            position: "bottom",
            limit: 5,
            rules: [
                {
                    collection: Meteor.users,
                    field: "username",
                    filter: {_id: {$ne: Meteor.userId()}},
                    template: Template.userPill,
                    matchAll: true

                }
            ]
        };
    }
});
Template.directMessageUserSearch.events({
    'autocompleteselect input'(event, template, doc) {
        Meteor.call('getDirectMessageRoom', doc._id, (err, data) => {
            if (!err) {
                Client.setCurrentRoom(data);
                template.$('input').val('');
                $("#message").focus();
            }
        });
    }
});

Template.directMessageUserSearch.onRendered(function() {
    $(document).bind('keydown', 'ctrl+m', () => { this.$('input').focus(); });
});
