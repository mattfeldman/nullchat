Template.memeModalContent.onCreated(function() {
    const instance = this;
    instance.selectedMeme = new ReactiveVar(false);
    instance.currentMemeUrl = new ReactiveVar(false);
});

Template.memeModalContent.onRendered(function() {
    $('.dropdown').dropdown();
});

Template.memeModalContent.helpers({
    memes() {
        return Memes.find({}).fetch();
    },
    selectedMeme() {
        const selectedMeme = Template.instance().selectedMeme.get();
        return selectedMeme || false;
    },
    currentMemeUrl() {
        return Template.instance().currentMemeUrl.get() || false;
    }
});

const debouncedUpdate = _.throttle((params, template) => {
    Meteor.call('createMeme', params, (error, result) => {
        if (!error) {
            template.currentMemeUrl.set(result);
        }
    });
}, 750);

Template.memeModalContent.events({
    // update the search session when the search input changes
    'keyup .search, change .search'(event, template) {
        const meme = Memes.findOne({_id: event.target.value});
        if (meme) {
            template.selectedMeme.set(meme);
            template.currentMemeUrl.set(meme.url);
        }
    },
    'keyup input'(event, template) {
        const top = template.$('input[name=top]').val();
        const bottom = template.$('input[name=bottom]').val();
        const selectedMeme = template.selectedMeme.get();
        const params = {id: selectedMeme.id, topLine: top, bottomLine: bottom};
        debouncedUpdate(params, template);
    },
    'click .insert'(event, template) {
        const currentMemeUrl = template.currentMemeUrl.get();
        event.preventDefault();
        if (!currentMemeUrl) { return; }
        Meteor.call('message', {
            roomId: Session.get('currentRoom'),
            message: currentMemeUrl
        });
        $(".memeModal").modal('hide');
    }
});
