MessageHelpers = {
    myMessageFromId: function(id){
        return id && id === Meteor.userId() ? "my-message" : "";
    }
}
Template.registerHelper('myMessageFromId', MessageHelpers.myMessageFromId);
