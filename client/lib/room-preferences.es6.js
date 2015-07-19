let currentUserRoomPreferences = [];
roomPreferencesOrDefault = function(roomId) {
    const currentPreferences = _(currentUserRoomPreferences).find(p => p.roomId === roomId);
    if (currentPreferences) {
        return currentPreferences;
    }
    else{
        return _.extend({}, Schemas.roomPreferenceDefault);
    }
};

Deps.autorun(function() {
    const prefUser = Meteor.users.findOne({_id: Meteor.userId()}, {fields: {"preferences": 1}});
    if (prefUser && prefUser.preferences && prefUser.preferences.room) {
        currentUserRoomPreferences = prefUser.preferences.room;
    }
});
