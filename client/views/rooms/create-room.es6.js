Template.createRoom.helpers({
    creatingRoom() {
        return Template.instance().creatingRoom.get();
    }
});

Template.createRoom.events({
    'submit #createRoomForm'(event, template) {
        event.preventDefault();
        const roomName = template.$('input[name=roomName]').val();
        if (roomName) {
            Meteor.call('createRoom', {name: roomName}, (err, data)=> {
                AlertFeedback(err, data);
                if (!err) {
                    template.$('input[name=roomName]').val('');
                }
            });
        }
    },
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
