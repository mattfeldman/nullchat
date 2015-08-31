function getRoomUserIds() {
    const room = Rooms.find({_id: Session.get('currentRoom')}, {fields: {users: 1}}).fetch()[0];
    return room.users || [];
}

Template.roomUsers.helpers({
    roomOnlineUsers() {
        const users = getRoomUserIds();
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
    roomTotalUsers() {
        const users = getRoomUserIds();
        return users && users.length;
    },
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

Template.roomUsers.onRendered(function () {
    this.$('.room-users').popup({
        inline: true,
        hoverable: true,
        position: 'bottom left',
        delay: {show: 100, hide: 300}
    });
    this.$('.ui.checkbox').checkbox();
});

Template.roomUsers.events({
    'autocompleteselect input'(event, template, doc) {
        const input = template.$('input');
        Meteor.call('roomInvitation', doc._id, Session.get('currentRoom'), AlertFeedback);
        input.val('');
        input.focus();
    }
});
