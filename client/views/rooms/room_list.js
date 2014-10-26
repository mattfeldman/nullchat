Template.roomList.helpers({
    locked: function(){
        return this.isPrivate ? "[LOCKED] -" : "";
    }
});
//Template.roomList.created = function(){
//    console.log(this);
//};