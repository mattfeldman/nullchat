Template.roomList.helpers({
    currentRooms: function () {
        return Rooms.find({users: Meteor.userId(), direct: {$ne: true}});
    },
    opts: function () {
        return {
            group: "roomOrder",
            store:{
                get:function(sortable){
                    var userPreferences = Meteor.user().preferences;
                    return userPreferences && userPreferences.roomOrder ? userPreferences.roomOrder : [];
                },
                set:function(sortable){
                    Meteor.call('updateRoomOrder',sortable.toArray());
                }
            }
        };
    },
    currentDirectMessages: function () {
        return Rooms.find({users: Meteor.userId(), direct: true});
    }
});