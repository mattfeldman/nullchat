Template.rooms.helpers({
    'rooms': function () {
        var queryParams = Session.get('hideMyRooms') ? {users:{$ne:Meteor.userId()}} : {};
        var rooms = Rooms.find(queryParams).fetch();
        rooms = _(rooms).sortBy(function (room) {
            return -room.users.length;
        });
        return rooms;
    }
    // 'ownerOf"
    // 'invitedTo'
});
Template.rooms.events({
    'change .hide-my-rooms': function (event, template) {
        Session.set('hideMyRooms', $(event.target).prop('checked'));
    }
});