Template.roomPreferences.rendered = function () {
    this.$('.room-settings-button').popup({
        inline: true,
        hoverable: true,
        position: 'bottom left',
        delay: {show: 100, hide: 300}
    });
    this.$('.ui.checkbox').checkbox();
};
Template.roomPreferences.helpers({
    playMessageSound: function () {
        return Template.instance().playMessageSound.get() ? "checked" : "";
    },
    desktopNotificationMention: function () {
        return Template.instance().desktopNotificationMention.get() ? "checked" : "";
    },
    desktopNotificationAllMessages: function () {
        return Template.instance().desktopNotificationAllMessages.get() ? "checked" : "";
    },
    smsAllMessages: function () {
        return Template.instance().smsAllMessages.get() ? "checked" : "";
    }
});
Template.roomPreferences.events({
    'change': function (event, template) {
        var userPreferences = {
            roomId: Session.get('currentRoom'),
            playMessageSound: $("#playMessageSound").is(":checked"),
            desktopNotificationMention: $("#desktopNotificationMention").is(":checked"),
            desktopNotificationAllMessages: $("#desktopNotificationAllMessages").is(":checked"),
            smsAllMessages: $("#smsAllMessages").is(":checked"),
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
    instance.smsAllMessages = new ReactiveVar();
    Deps.autorun(function () {
        instance.playMessageSound.set(Schemas.roomPreferenceDefault.playMessageSound);
        instance.desktopNotificationMention.set(Schemas.roomPreferenceDefault.desktopNotificationMention);
        instance.desktopNotificationAllMessages.set(Schemas.roomPreferenceDefault.desktopNotificationAllMessages);
        instance.smsAllMessages.set(Schemas.roomPreferenceDefault.smsAllMessages);
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
                instance.smsAllMessages.set(currentPreferences.smsAllMessages);
            }
        }
    });
};