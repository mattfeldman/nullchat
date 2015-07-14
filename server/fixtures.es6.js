Meteor.startup(()=> {
    const room = Rooms.findOne({name: "welcome"});
    if (!room) {
        Rooms.insert({
            name: "welcome",
            topic: "welcome",
            isPrivate: false,
            ownerId: 0,
            invited: [],
            users: [],
            moderators: []
        });
    }
});
