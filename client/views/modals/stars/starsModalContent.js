Template.starsModalContent.helpers({
    'starredMessages':function(){
        return Messages.find({likedBy:Meteor.userId()});
    }
});

Template.starsModalContent.created = function () {
    console.log("created");
}