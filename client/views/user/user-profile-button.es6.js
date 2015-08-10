Template.userProfileButton.events({
    'click .userProfileButton'(event, template) {
        event.preventDefault();
        Client.showModal('userProfileModal', Meteor.user().profile);
    }
});
