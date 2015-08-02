Template.notificationButton.onCreated(function () {
    this.subscribe('notifications');
});

Template.notificationButton.events({
    'click .notification-button'(event, template) {
        Client.showModal("notifications");
    }
});

Template.notificationButton.helpers({
    unreadCount() {
        const count = Notifications.find({seen: false}).count();
        return count ? count : false;
    }
});
