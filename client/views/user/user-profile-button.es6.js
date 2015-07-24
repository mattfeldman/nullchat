Template.userProfileButton.events({
    'click .userProfileButton': function (e,t) {
        e.preventDefault();
        Client.showModal('userProfile', Meteor.user().profile);
    }
});