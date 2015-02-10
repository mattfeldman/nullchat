Template.roomPreferences.helpers({
    playMessageSound: function () {
        return Template.instance().playMessageSound.get() ? "checked" : "";
    },
    desktopNotificationMention: function () {
        return Template.instance().desktopNotificationMention.get() ? "checked" : "";
    },
    desktopNotificationAllMessages: function () {
        return Template.instance().desktopNotificationAllMessages.get() ? "checked" : "";
    }
});
Template.roomPreferences.events({
    'change': function (event, template) {
        var userPreferences = {
            roomId: Session.get('currentRoom'),
            playMessageSound: $("#playMessageSound").is(":checked"),
            desktopNotificationMention: $("#desktopNotificationMention").is(":checked"),
            desktopNotificationAllMessages: $("#desktopNotificationAllMessages").is(":checked")
        };

        if (userPreferences.desktopNotificationMention || userPreferences.desktopNotificationAllMessages) {
            var permission = notify.permissionLevel();
            if (permission === notify.PERMISSION_DEFAULT) {
                notify.requestPermission();
            }
        }

        Meteor.call('updateRoomPreferences', userPreferences);
    }
});
Template.roomPreferences.created = function () {
    var instance = this;
    instance.playMessageSound = new ReactiveVar();
    instance.desktopNotificationMention = new ReactiveVar();
    instance.desktopNotificationAllMessages = new ReactiveVar();
    Deps.autorun(function () {
        instance.playMessageSound.set(Schemas.roomPreferenceDefault.playMessageSound);
        instance.desktopNotificationMention.set(Schemas.roomPreferenceDefault.desktopNotificationMention);
        instance.desktopNotificationAllMessages.set(Schemas.roomPreferenceDefault.desktopNotificationAllMessages);
        var prefUser = Meteor.users.findOne({_id: Meteor.userId()}, {fields: {"preferences": 1}});
        var currentRoom = Session.get('currentRoom');
        if (prefUser && prefUser.preferences && prefUser.preferences.room) {
            var currentPreferences = _(prefUser.preferences.room).find(function (p) {
                return p.roomId === currentRoom;
            });
            if (currentPreferences) {
                instance.playMessageSound.set(currentPreferences.playMessageSound);
                instance.desktopNotificationMention.set(currentPreferences.desktopNotificationMention);
                instance.desktopNotificationAllMessages.set(currentPreferences.desktopNotificationAllMessages);
            }
        }
    });
};