Template.notificationsModalContent.helpers({
    'unseenNotifications': function () {
        return Notifications.find({seen: false});
    }
});

Template.notificationsModalContent.events({
    'click .notificatpions-dismiss-all': function (event, template) {
        Meteor.call("setAllNotificationsSeen");
    }
});

