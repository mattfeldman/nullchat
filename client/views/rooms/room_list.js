Template.roomList.helpers({
    locked: function(){
        return this.isPrivate ? "[LOCKED] -" : "";
    },
    selected: function(){
        return this._id === Session.get("currentRoom") ? "background: yellow;" : "";
    }
});
//Template.roomList.created = function(){
//    console.log(this);
//};