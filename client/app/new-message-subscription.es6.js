Meteor.startup(function () {
    Deps.autorun(function () {
        const rooms = Rooms.find({users: Meteor.userId()}, {fields: {_id: 1}}).fetch();
        if (rooms) {
            for (let i = 0; i < rooms.length; i++) {
                const roomId = rooms[i]._id;
                Meteor.subscribe('newMessagesForRoom', roomId);
            }
        }
    });
});
