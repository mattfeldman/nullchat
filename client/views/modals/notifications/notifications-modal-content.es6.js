Template.notificationsModalContent.helpers({
    unseenNotifications() {
        return Notifications.find({seen: false});
    }
});

Template.notificationsModalContent.events({
    'click .notifications-dismiss-all'(event, template) {
        Meteor.call("setAllNotificationsSeen");
        $('.ui.modal').modal('hide');
    }
});
