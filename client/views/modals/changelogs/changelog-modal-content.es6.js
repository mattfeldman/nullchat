Template.changelogModalContent.helpers({
    changelogs() {
        return Changelogs.find({}, {sort: {timestamp: -1}});
    }
});

Template.changelogModalContent.events({
    'change .markdownInput, keyup .markdownInput, paste .markdownInput'(event, template) {
        const md = marked(event.target.value);
        template.$('.markdown').html(md);
    },
    'click .post'(event, template) {
        Meteor.call("addChangelog", template.$('.markdownInput').val());
        template.$('.markdownInput').val('');
        template.$('.markdown').html('');
        Meteor.call("updateChangelogCursor");
    }
});
