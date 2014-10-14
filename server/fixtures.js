if(Messages.find().count() === 0){
    var now = new Date().getTime();
    var bobId = Meteor.users.insert({
        profile:{name:"Bob"}
    });
    var bob = Meteor.users.findOne(bobId);
    for(var i=0;i<10;i++){
        Messages.insert({
            author: bob.profile.name,
            timestamp: now - i*3600,
            message: "Test Message #"+i
        });
    }
}