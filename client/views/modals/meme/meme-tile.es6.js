Template.memeTile.events({
    'click .memeTile'(event, template) {
        event.preventDefault();
        Meteor.call('message', {
            roomId: Session.get('currentRoom'),
            message: template.data.images.original.url
        }, AlertFeedback);
        $(".memeModal").modal('hide');
    },
    'mouseenter .memeTile'(event, template) {
        Template.instance().imgSrc.set(this.images.fixed_height.url);
    },
    'mouseout .memeTile'(event, template) {
        Template.instance().imgSrc.set(this.images.fixed_height_still.url);
    }
});

Template.memeTile.helpers({
    imgSrc() {
        return Template.instance().imgSrc.get();
    }
});

Template.memeTile.onCreated(function () {
    this.imgSrc = new ReactiveVar(this.data.images.fixed_height_still.url);
});
