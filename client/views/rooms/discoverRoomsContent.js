Template.discoverRoomsContent.helpers({
    'rooms': function () {
        var queryParams = Template.instance().hideMyRooms.get() ? {users:{$ne:Meteor.userId()}} : {};
        queryParams.direct = {$ne:true};
        var rooms = Rooms.find(queryParams).fetch();
        rooms = _(rooms).sortBy(function (room) {
            return -room.users.length;
        });
        return rooms;
    }
});

Template.discoverRoomsContent.events({
    'change #hideMyRooms': function (event, template) {
        template.hideMyRooms.set($(event.target).is(':checked'));
    }
});

Template.discoverRoomsContent.created = function () {
    var instance = this;
    instance.hideMyRooms = new ReactiveVar(false);
};
