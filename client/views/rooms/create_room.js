Template.createRoom.helpers({
    'creatingRoom': function () {
        return Template.instance().creatingRoom.get();
    }
});

Template.createRoom.events({
    'click .create-room-link': function (e, instance) {
        instance.creatingRoom.set(true);
        e.preventDefault();
    },
    'click .create-room-cancel': function (e, instance) {
        instance.creatingRoom.set(false);
        e.preventDefault();
    }
});

Template.createRoom.created = function () {
    var instance = this;
    instance.creatingRoom = new ReactiveVar(false);
}