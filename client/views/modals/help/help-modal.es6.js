Template.helpModal.helpers({
    commands() {
        return Commands.find({}, {sort: {name: 1}});
    }
});
