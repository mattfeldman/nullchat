var currentUserRoomPreferences = [];
roomPreferencesOrDefault = function (roomId) {
    var currentPreferences = _(currentUserRoomPreferences).find(function (p) {
        return p.roomId === roomId;
    });
    if (currentPreferences) {
        return currentPreferences;
    }
    else{
        return _.extend({}, Schemas.roomPreferenceDefault);
    }
};

Deps.autorun(function () {
    var prefUser = Meteor.users.findOne({_id: Meteor.userId()}, {fields: {"preferences": 1}});
    if (prefUser && prefUser.preferences && prefUser.preferences.room) {
        currentUserRoomPreferences = prefUser.preferences.room;
    }
});