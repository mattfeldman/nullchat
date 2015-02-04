Template.notifications.helpers({
    'unseenNotifications':function(){
        return Notifications.find({seen:false});
    }
});

Template.notifications.events({
    'click .notifications-dismiss-all':function(event,template){
        Meteor.call("setAllNotificationsSeen");
    }
});

