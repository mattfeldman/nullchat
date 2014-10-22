Meteor.publish('messages', function () {
    return Messages.find();
});
Meteor.publish('currentRooms', function () {
    //return Rooms.find({users: this.userId});
});
Meteor.publish('availableRooms', function () {
    return Rooms.find({$or: [{isPrivate: false}, {isPrivate: true,invited:this.userId}]});
});
Meteor.publish('users',function(){
   return Meteor.users.find({},{_id:true,profile:true});
});