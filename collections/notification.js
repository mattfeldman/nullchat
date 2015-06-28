Notifications = new Meteor.Collection('notifications'); // jshint ignore:line

Meteor.methods({
    'setSeen': function (roomId) {
        check(roomId, String);
        Notifications.update({seen: false, userId: Meteor.userId(), roomId: roomId}, {$set: {seen: true}}, {multi: true});
    },
    'setNotificationSeen':function(notificationId){
        check(notificationId, String);
        Notifications.update({seen: false, userId: Meteor.userId(),_id:notificationId},{$set:{seen:true}});
    },
    'setAllNotificationsSeen':function(){
        Notifications.update({seen: false, userId: Meteor.userId()},{$set:{seen:true}},{multi:true});
    }
});
