Template.memeTile.events({
    'click .memeTile': function (event, template) {
        event.preventDefault();
        Meteor.call('message', {
            roomId: Session.get('currentRoom'),
            message: template.data.images.original.url
        });
        $(".memeModal").modal('hide');
    },
    'mouseenter .memeTile': function (event, template) {
        Template.instance().imgSrc.set(this.images.fixed_height.url);HN
    },
    'mouseout .memeTile': function (event, template) {
        Template.instance().imgSrc.set(this.images.fixed_height_still.url);
    }
});

Template.memeTile.helpers({
    'imgSrc' :function(){
        return Template.instance().imgSrc.get();
    }
});

Template.memeTile.created = function(){
    var instance = this;
    instance.imgSrc = new ReactiveVar(this.data.images.fixed_height_still.url);
};