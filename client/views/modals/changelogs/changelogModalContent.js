Template.changelogModalContent.helpers({
    'changelogs': function () {
        return Changelogs.find({}, {sort: {timestamp: -1}});
    }
});