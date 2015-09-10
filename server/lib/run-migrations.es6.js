Meteor.startup(function  () {
    Migrations.migrateTo('latest');
});
