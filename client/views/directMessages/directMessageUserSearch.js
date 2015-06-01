Template.directMessageUserSearch.helpers({
    settings: function () {
        return {
            position: "bottom",
            limit: 5,
            rules: [
                {
                    collection: Meteor.users,
                    field: "username",
                    filter: {_id:{$ne:Meteor.userId()}},
                    template: Template.userPill,
                    matchAll: true

                }
            ]
        };
    }
});
Template.directMessageUserSearch.events({
    'autocompleteselect input': function (event, template, doc) {
        Meteor.call('getDirectMessageRoom', doc._id, function (err, data) {
            if (!err) {
                setCurrentRoom(data);
                template.$('input').val('');
                $("#message").focus();
            }
        });
    }
});

Template.directMessageUserSearch.onRendered(function() {
    var self = this;
    $(document).bind('keydown','ctrl+m',function(){
        self.$('input').focus();
    });
});