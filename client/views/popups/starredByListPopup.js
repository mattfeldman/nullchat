Template.starredByListPopup.helpers({
    usernames: function () {
        var likedByMessage = Messages.findOne({_id: this.toString()}, {fields: {likedBy: 1}});
        
        if (!likedByMessage && !likedByMessage.likedBy) return;

        var users = Meteor.users.find({_id: {$in: likedByMessage.likedBy}}, {fields: {username: 1}}).fetch();

        users = _(users).map(function (user) {
            return user.username;
        });

        return users;
    }
});