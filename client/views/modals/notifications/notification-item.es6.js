Template.notificationItem.events({
    'click .notification-item-dismiss'(event, template) {
        Meteor.call("setNotificationSeen", template.data._id);
    }
});
