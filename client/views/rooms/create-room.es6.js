Template.createRoom.helpers({
    creatingRoom() {
        return Template.instance().creatingRoom.get();
    }
});

Template.createRoom.events({
    'click .create-room-link'(event, template) {
        template.creatingRoom.set(true);
        event.preventDefault();
    },
    'click .create-room-cancel'(event, template) {
        template.creatingRoom.set(false);
        event.preventDefault();
    }
});

Template.createRoom.onCreated(function () {
    this.creatingRoom = new ReactiveVar(false);
});
