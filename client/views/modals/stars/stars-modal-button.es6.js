Template.starsModalButton.events({
    'click .starsModalButton'(e, t) {
        e.preventDefault();
        Client.showModal('starsModal');
    }
});
