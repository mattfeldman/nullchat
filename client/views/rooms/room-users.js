Template.roomUsers.helpers({
    roomOnlineUsers: function () {
        var users = getRoomUserIds();
        return Meteor.users.find(
            {
                _id: {$in: users},
                $or: [
                    {"status.idle": true},
                    {"status.online": true}
                ]
            }, {
                fields: {
                    "status.idle": 1,
                    "status.online": 1
                }
            }).count();
    },
    roomTotalUsers: function () {
        var users = getRoomUserIds();
        return users && users.length;
    }
});
function getRoomUserIds() {
    var room = Rooms.find({_id: Session.get('currentRoom')}, {fields: {users: 1}}).fetch()[0];
    return room.users || [];
}