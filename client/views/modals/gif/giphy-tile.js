Template.giphyTile.events({
    'click .giphyTile': function (event, template) {
        event.preventDefault();
        Meteor.call('message', {
            roomId: Session.get('currentRoom'),
            message: template.data.images.original.url
        });
        $(".giphyModal").modal('hide');
    },
    'mouseenter .giphyTile': function (event, template) {
        Template.instance().imgSrc.set(this.images.fixed_height.url);
    },
    'mouseout .giphyTile': function (event, template) {
        Template.instance().imgSrc.set(this.images.fixed_height_still.url);
    }
});

Template.giphyTile.helpers({
    'imgSrc' :function(){
        return Template.instance().imgSrc.get();
    }
});

Template.giphyTile.created = function(){
    var instance = this;
    instance.imgSrc = new ReactiveVar(this.data.images.fixed_height_still.url);
};