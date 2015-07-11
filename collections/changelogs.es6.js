Changelogs = new Meteor.Collection('changelogs');
Schemas.changelog = new SimpleSchema({
    message: {
        type: String,
        label: "Change Message",
    },
    authorId: {
        type: String,
        label: "Author Id",
    },
    timestamp: {
        type: Date,
        label: "Timestamp",
    }
});

Meteor.methods({
    updateChangelogCursor() {
        Meteor.users.update({_id: Meteor.userId()}, {$set: {'cursors.changelog': new Date()}});
    },
    addChangelog(message) {
        if (Meteor.user().admin !== true) throw new Meteor.Error("TODO: Better Admin roles, but in anycase you don't have permission.");
        const changelog = {
            message: message,
            authorId: Meteor.userId(),
            timestamp: new Date()
        };
        check(changelog, Schemas.changelog);
        Changelogs.insert(changelog);
    }
});
