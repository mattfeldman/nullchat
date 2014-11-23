Template.joinRoom.helpers({
    settings: function () {
        return {
            position: "top",
            limit: 5,
            rules: [
                {
                    collection: Rooms,
                    field: "name",
                    template: Template.roomPill,
                    matchAll: true,
                    callback: function (doc, ele) {
                        Meteor.call('joinRoom', doc._id, function (err, data) {
                            if (!err) {
                                setCurrentRoom(data);
                                ele.val('');
                                $("#message").focus();
                            }
                        });
                    }
                }
            ],
            rooms: function () {
                return Rooms.find();
            }
        };
    }
});