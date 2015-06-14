Template.notificationButton.onCreated(function () {
    this.subscribe('notifications');
});

Template.notificationButton.events({
    'click .notification-button': function (event, template) {
        showModal("notifications");
    }
});

Template.notificationButton.helpers({
    'unreadCount': function () {
        var count = Notifications.find({seen: false}).count();
        return count ? count : false;
    }
});