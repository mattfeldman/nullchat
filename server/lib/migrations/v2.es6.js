Meteor.startup(function () {
    Migrations.add({
        version: 2,
        name: 'Defaults continued messages on for all usersgi',
        up() {
            Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.continueMessages": true}}, {multi: true});
        }
    });
});
