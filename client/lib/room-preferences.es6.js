RoomPreferencesDep = new Tracker.Dependency;
let currentUserRoomPreferences = [];
roomPreferencesOrDefault = function(roomId) {
    const currentPreferences = _(currentUserRoomPreferences).find(p => p.roomId === roomId);
    if (currentPreferences) {
        return currentPreferences;
    }
    else {
        const room = Rooms.findOne({_id: roomId}, {fields: {direct: 1}});
        const isDirect = room && room.direct || false;
        return _.extend({}, isDirect ? Schemas.directRoomPreferenceDefault : Schemas.roomPreferenceDefault);
    }
};

function getFieldOrDefault(collection, selector, fieldName, defaultValue){
    const fieldSelector = {};
    fieldSelector[fieldName] = 1;
    const result = collection.findOne(selector, fieldSelector);
    return result && result[fieldName] || defaultValue;
}

Deps.autorun(function() {
    const prefUser = Meteor.users.findOne({_id: Meteor.userId()}, {fields: {"preferences": 1}});
    if (prefUser && prefUser.preferences && prefUser.preferences.room) {
        currentUserRoomPreferences = prefUser.preferences.room;
        RoomPreferencesDep.changed();
    }
});
