Template.roomList.helpers({
    currentRooms() {
        return Rooms.find({users: Meteor.userId(), direct: {$ne: true}});
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
    }
});