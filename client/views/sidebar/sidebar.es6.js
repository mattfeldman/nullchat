function getPinnedRooms() {
    const userPinnedRooms = Meteor.users.findOne({_id: Meteor.userId()}, { fields: {"preferences.pinnedRooms": 1}});
    return userPinnedRooms && userPinnedRooms.preferences && userPinnedRooms.preferences.pinnedRooms || [];
}
Template.sidebar.helpers({
    pinnedRooms() {
        console.log(getPinnedRooms());
        return Rooms.find({users: Meteor.userId(), direct: {$ne: true}, _id: {$in: getPinnedRooms()}});
    },
    unpinnedRooms() {
        return Rooms.find({users: Meteor.userId(), direct: {$ne: true}, _id: {$nin: getPinnedRooms()}});
    },
    opts() {
        return {
            group: "roomOrder",
            store: {
                get(sortable) {
                    const userPreferences = Meteor.user().preferences;
                    return userPreferences && userPreferences.roomOrder ? userPreferences.roomOrder : [];
                },
                set(sortable) {
                    Meteor.call('updateRoomOrder', sortable.toArray());
                }
            }
        };
    },
    currentDirectMessages() {
        return Rooms.find({users: Meteor.userId(), direct: true});
    },
    unpinnedTotalUnread() {
        const rooms = Rooms.find({users: Meteor.userId(), direct: {$ne: true}, _id: {$nin: getPinnedRooms()}}, {fields: {_id: 1}}).fetch();
        return rooms && _(rooms).map(r => r && r._id && Client.getRoomUnread(r._id)).reduce((a, b) => a + b);
    }
});

Template.sidebar.onRendered(function () {
    this.$('.ui.accordion').accordion();
});
