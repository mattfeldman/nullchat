Template.roomList.helpers({
    locked: function () {
        return this.isPrivate ? "[LOCKED] -" : "";
    },
    selected: function () {
        return this._id === Session.get("currentRoom") ? "background: yellow;" : "";
    },
    notificationString: function () {
        var count = Notifications.find({userId: Meteor.userId(), roomId: this._id, seen: false}).count();
        return count ? "(" + count + ")" : "";
    }
});