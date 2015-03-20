Template.joinRoom.helpers({
    settings: function () {
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
            ],
            rooms: function () {
                return Rooms.find();
            }
        };
    }
});
Template.joinRoom.events({
    'autocompleteselect input': function (event, template, doc) {
        Meteor.call('joinRoom', doc._id, function (err, data) {
            if (!err) {
                setCurrentRoom(data);
                template.$('input').val('');
                $("#message").focus();
            }
        });
    }
});