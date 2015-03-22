Template.giphyTile.events({
    'click .giphyTile': function (event, template) {
        Meteor.call('message', {
            roomId: Session.get('currentRoom'),
            message: template.data.images.original.url
        });
        $(".giphyModal").modal('hide');
    },
});
