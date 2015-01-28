Template.roomPreferences.helpers({
    playMessageSound:function(){
        console.log("playMessageSound) is now "+Session.get('currentRoomSettings_playMessageSound') );
        return Session.get('currentRoomSettings_playMessageSound') ? "checked" : "";
    }
});
Template.roomPreferences.events({
    'change': function (event, template) {
        var userPreferences = {
            roomId: Session.get('currentRoom'),
            playMessageSound: $("#playMessageSound").is(":checked")
        };
        Meteor.call('updateRoomPreferences', userPreferences);
    }
});
Template.roomPreferences.created = function () {
    Deps.autorun(function () {
        Session.set('currentRoomSettings_playMessageSound', false);
        var prefUser = Meteor.users.findOne({_id:Meteor.userId()},{fields:{"preferences":1}});
        var currentRoom = Session.get('currentRoom');
        if(prefUser && prefUser.preferences && prefUser.preferences.room) {
            console.log(prefUser.preferences.room);
            var currentPreferences = _(prefUser.preferences.room).find(function(p){console.log(p);return p.roomId === currentRoom;});
            Session.set('currentRoomSettings_playMessageSound', currentPreferences.playMessageSound);
        }
        else{
            // Populate from defaults somewhere
        }
        console.log("currentPreferences.playMessageSound) is now "+Session.get('currentRoomSettings_playMessageSound') );
    });
};