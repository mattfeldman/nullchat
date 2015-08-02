Template.discoverRoomsContent.helpers({
    rooms() {
        const queryParams = Template.instance().hideMyRooms.get() ? {users: {$ne: Meteor.userId()}} : {};
        queryParams.direct = {$ne: true};
        let rooms = Rooms.find(queryParams).fetch();
        rooms = _(rooms).sortBy(room => -room.users.length);
        return rooms;
    }
});

Template.discoverRoomsContent.events({
    'change #hideMyRooms'(event, template) {
        template.hideMyRooms.set($(event.target).is(':checked'));
    }
});

Template.discoverRoomsContent.onCreated(function () {
    this.hideMyRooms = new ReactiveVar(false);
});
