Notifications = new Meteor.Collection('notifications'); // jshint ignore:line

Meteor.methods({
    setSeen(roomId) {
        check(roomId, String);
        Notifications.update({
            seen: false,
            userId: Meteor.userId(),
            roomId: roomId
        }, {$set: {seen: true}}, {multi: true});
    },
    setNotificationSeen(notificationId){
        check(notificationId, String);
        Notifications.update({seen: false, userId: Meteor.userId(), _id: notificationId}, {$set: {seen: true}});
    },
    setAllNotificationsSeen(){
        Notifications.update({seen: false, userId: Meteor.userId()}, {$set: {seen: true}}, {multi: true});
    }
});
