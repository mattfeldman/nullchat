Template.directMessageItem.events({
    'click': function (event, template) {
        event.preventDefault();
        setCurrentRoom(template.data._id);
    }
});