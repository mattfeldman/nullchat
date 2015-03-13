Template.changelogButton.events({
    'click .changelogButton' : function(event, template){
        event.preventDefault();
        showModal("changelogModal");
    }
})