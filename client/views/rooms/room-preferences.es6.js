Template.roomPreferences.onRendered(function() {
    this.$('.room-settings-button').popup({
        inline: true,
        hoverable: true,
        position: 'bottom left',
        delay: {show: 100, hide: 300}
    });
    this.$('.ui.checkbox').checkbox();
});
Template.roomPreferences.helpers({
    playMessageSound() {
        return Template.instance().playMessageSound.get() ? "checked" : "";
    },
    desktopNotificationMention() {
        return Template.instance().desktopNotificationMention.get() ? "checked" : "";
    },
    desktopNotificationAllMessages() {
        return Template.instance().desktopNotificationAllMessages.get() ? "checked" : "";
    },
    smsAllMessages() {
        return Template.instance().smsAllMessages.get() ? "checked" : "";
    }
});
Template.roomPreferences.events({
    'change'(event, template) {
        const userPreferences = {
            roomId: Session.get('currentRoom'),
            playMessageSound: $("#playMessageSound").is(":checked"),
            desktopNotificationMention: $("#desktopNotificationMention").is(":checked"),
            desktopNotificationAllMessages: $("#desktopNotificationAllMessages").is(":checked"),
            smsAllMessages: $("#smsAllMessages").is(":checked")
        };

        if (userPreferences.desktopNotificationMention || userPreferences.desktopNotificationAllMessages) {
            const permission = notify.permissionLevel();
            if (permission === notify.PERMISSION_DEFAULT) {
                notify.requestPermission();
            }
        }

        Meteor.call('updateRoomPreferences', userPreferences);
    }
});
Template.roomPreferences.onCreated(function() {
    const instance = this;
    instance.playMessageSound = new ReactiveVar();
    instance.desktopNotificationMention = new ReactiveVar();
    instance.desktopNotificationAllMessages = new ReactiveVar();
    instance.smsAllMessages = new ReactiveVar();
    Deps.autorun(function() {
        const currentRoom = Session.get('currentRoom');
        RoomPreferencesDep.depend();
        const prefs = roomPreferencesOrDefault(currentRoom);
        instance.playMessageSound.set(prefs.playMessageSound);
        instance.desktopNotificationMention.set(prefs.desktopNotificationMention);
        instance.desktopNotificationAllMessages.set(prefs.desktopNotificationAllMessages);
        instance.smsAllMessages.set(prefs.smsAllMessages);
    });
});