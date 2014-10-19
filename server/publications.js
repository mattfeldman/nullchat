Meteor.publish('messages', function () {
    return Messages.find();
});

Meteor.publish('currentRooms', function () {
    //return Rooms.find({users: this.userId});
});
Meteor.publish('availableRooms', function () {
    //return Rooms.find({isPrivate: false, $or: {isPrivate: true, $and: {invited: {$elemMatch: {value1: this.userId}}}}});
    return Rooms.find({$or: [{isPrivate: false}, {isPrivate: true,invited:this.userId}]});
});