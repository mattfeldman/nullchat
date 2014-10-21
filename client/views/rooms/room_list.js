Template.roomList.helpers({
    locked: function(){
        return this.isPrivate ? "[LOCKED] -" : "";
    }
});