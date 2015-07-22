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
            smsAllMessages: $("#smsAllMessages").is(":checked"),
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
        instance.playMessageSound.set(Schemas.roomPreferenceDefault.playMessageSound);
        instance.desktopNotificationMention.set(Schemas.roomPreferenceDefault.desktopNotificationMention);
        instance.desktopNotificationAllMessages.set(Schemas.roomPreferenceDefault.desktopNotificationAllMessages);
        instance.smsAllMessages.set(Schemas.roomPreferenceDefault.smsAllMessages);
        const prefUser = Meteor.users.findOne({_id: Meteor.userId()}, {fields: {"preferences": 1}});
        const currentRoom = Session.get('currentRoom');
        if (prefUser && prefUser.preferences && prefUser.preferences.room) {
            const currentPreferences = _(prefUser.preferences.room).find(p => p.roomId === currentRoom);
            if (currentPreferences) {
                instance.playMessageSound.set(currentPreferences.playMessageSound);
                instance.desktopNotificationMention.set(currentPreferences.desktopNotificationMention);
                instance.desktopNotificationAllMessages.set(currentPreferences.desktopNotificationAllMessages);
                instance.smsAllMessages.set(currentPreferences.smsAllMessages);
            }
        }
    });
});