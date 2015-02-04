Template.notificationItem.events({
    'click .notification-item-dismiss': function (event, template) {
      Meteor.call("setNotificationSeen",template.data._id);
    }
});