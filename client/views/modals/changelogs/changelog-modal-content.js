Template.changelogModalContent.helpers({
    'changelogs': function () {
        return Changelogs.find({}, {sort: {timestamp: -1}});
    }
});

Template.changelogModalContent.events({
    'change .markdownInput, keyup .markdownInput, paste .markdownInput': function (event, template) {
        var md = marked(event.target.value);
        template.$('.markdown').html(md);
    },
    'click .post':function(event,template){
        Meteor.call("addChangelog",template.$('.markdownInput').val());
        template.$('.markdownInput').val('');
        template.$('.markdown').html('');
        Meteor.call("updateChangelogCursor");
    }
});