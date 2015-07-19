Template.starsModalButton.events({
    'click .starsModalButton': function (e,t) {
        e.preventDefault();
        Client.showModal('starsModal');
    }
});