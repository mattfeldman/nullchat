Template.userProfileButton.events({
    'click .userProfileButton': function (e,t) {
        e.preventDefault();
        showModal('userProfile', Meteor.user().profile);
    }
});