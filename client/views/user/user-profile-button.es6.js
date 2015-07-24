Template.userProfileButton.events({
    'click .userProfileButton'(event, template) {
        event.preventDefault();
        Client.showModal('userProfile', Meteor.user().profile);
    }
});
