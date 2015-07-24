Template.notificationsModalContent.helpers({
    unseenNotifications() {
        return Notifications.find({seen: false});
    }
});

Template.notificationsModalContent.events({
    'click .notificatpions-dismiss-all'(event, template) {
        Meteor.call("setAllNotificationsSeen");
    }
});
