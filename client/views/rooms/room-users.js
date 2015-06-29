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

Template.roomUsers.onRendered(function () {
    this.$('.room-users').popup({
        inline: true,
        hoverable: true,
        position: 'bottom left',
        delay: {show: 100, hide: 300}
    });
    this.$('.ui.checkbox').checkbox();
});
function getRoomUserIds() {
    var room = Rooms.find({_id: Session.get('currentRoom')}, {fields: {users: 1}}).fetch()[0];
    return room.users || [];
}