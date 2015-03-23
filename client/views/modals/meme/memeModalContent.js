Template.memeModalContent.created = function () {
    var instance = this;
    instance.selectedMeme = new ReactiveVar(false);
    instance.currentMemeUrl = new ReactiveVar(false);

};
Template.memeModalContent.rendered = function () {
    $('.dropdown').dropdown();
};


Template.memeModalContent.helpers({
    memes: function () {
        return Memes.find({}).fetch();
    },
    selectedMeme: function () {
        var selectedMeme = Template.instance().selectedMeme.get();
        return selectedMeme || false;
    },
    currentMemeUrl: function () {
        return Template.instance().currentMemeUrl.get() || false;
    }
});

var debouncedUpdate = _.throttle(function (params, template) {
    Meteor.call('createMeme', params, function (error, result) {
        if (!error) {
            template.currentMemeUrl.set(result);
        }
    });
}, 750);

Template.memeModalContent.events({
    //update the search session when the search input changes
    'keyup .search, change .search': function (event, template) {
        var meme = Memes.findOne({_id: event.target.value});
        if (meme) {
            template.selectedMeme.set(meme);
            template.currentMemeUrl.set(meme.url);
        }
    },
    'keyup input': function (event, template) {
        var top = template.$('input[name=top]').val();
        var bottom = template.$('input[name=bottom]').val();
        var selectedMeme = template.selectedMeme.get();
        var params = {id: selectedMeme.id, topLine: top, bottomLine: bottom};

        debouncedUpdate(params, template);

    },
    'click .insert': function (event, template) {
        var currentMemeUrl = template.currentMemeUrl.get();
        event.preventDefault();
        if (!currentMemeUrl) { return;}
        Meteor.call('message', {
            roomId: Session.get('currentRoom'),
            message: currentMemeUrl
        });
        $(".memeModal").modal('hide');
    }
});