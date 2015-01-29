Template.roomPreferences.helpers({
    playMessageSound: function () {
        return Template.instance().playMessageSound.get() ? "checked" : "";
    }
});
Template.roomPreferences.events({
    'change': function (event, template) {
        var userPreferences = {
            roomId: Session.get('currentRoom'),
            playMessageSound: $("#playMessageSound").is(":checked")
        };
        Meteor.call('updateRoomPreferences', userPreferences);
    }
});
Template.roomPreferences.created = function () {
    var instance = this;
    instance.playMessageSound = new ReactiveVar();
    Deps.autorun(function () {
        instance.playMessageSound.set(true);
        var prefUser = Meteor.users.findOne({_id: Meteor.userId()}, {fields: {"preferences": 1}});
        var currentRoom = Session.get('currentRoom');
        if (prefUser && prefUser.preferences && prefUser.preferences.room) {
            var currentPreferences = _(prefUser.preferences.room).find(function (p) {
                return p.roomId === currentRoom;
            });
            if (currentPreferences) {

                instance.playMessageSound.set(currentPreferences.playMessageSound);
            }
        }
    });
};