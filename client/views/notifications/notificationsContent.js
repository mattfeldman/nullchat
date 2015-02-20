Template.notificationsContent.helpers({
    'unseenNotifications':function(){
        return Notifications.find({seen:false});
    }
});

Template.notificationsContent.events({
    'click .notifications-dismiss-all':function(event,template){
        Meteor.call("setAllNotificationsSeen");
    }
});

