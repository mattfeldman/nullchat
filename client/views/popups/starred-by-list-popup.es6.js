Template.starredByListPopup.helpers({
    usernames() {
        const likedByMessage = Messages.findOne({_id: this.toString()}, {fields: {likedBy: 1}});

        if (!likedByMessage && !likedByMessage.likedBy) { return; }

        let users = Meteor.users.find({_id: {$in: likedByMessage.likedBy}}, {fields: {username: 1}}).fetch();
        users = _(users).map(user => user.username);

        return users;
    }
});
