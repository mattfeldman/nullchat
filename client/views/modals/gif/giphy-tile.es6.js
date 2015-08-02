Template.giphyTile.events({
    'click .giphyTile'(event, template) {
        event.preventDefault();
        Meteor.call('message', {
            roomId: Session.get('currentRoom'),
            message: template.data.images.original.url
        });
        $(".giphyModal").modal('hide');
    },
    'mouseenter .giphyTile'(event, template) {
        Template.instance().imgSrc.set(this.images.fixed_height.url);
    },
    'mouseout .giphyTile'(event, template) {
        Template.instance().imgSrc.set(this.images.fixed_height_still.url);
    }
});

Template.giphyTile.helpers({
    imgSrc() {
        return Template.instance().imgSrc.get();
    }
});

Template.giphyTile.onCreated(function () {
    this.imgSrc = new ReactiveVar(this.data.images.fixed_height_still.url);
});
