Template.userProfileCardContent.events({
    'click .direct-message'(event, template) {
        const authorId = template.data;
        if (!authorId || authorId === Meteor.userId()) return;
        Meteor.call('getDirectMessageRoom', authorId, (err, data) => {
            if (!err && data && !Session.equals('currentRoom', data)) {
                Client.setCurrentRoom(data);
            }
        });
    }
});
Template.userProfileCardContent.helpers({
    shouldShowMessageButton() {
        return !!this && this.toString() !== Meteor.userId();
    }
});
