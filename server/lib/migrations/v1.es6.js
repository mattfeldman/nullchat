Meteor.startup(function () {
   Migrations.add({
       version: 1,
       name: 'Removes feedback messages',
       up() {
           Messages.remove({type: 'feedback'});
       }
   });
});
