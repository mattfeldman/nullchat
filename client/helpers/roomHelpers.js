Template.registerHelper('activeRoomFromId',function(id){
    return id && id === Session.get("currentRoom") ? "active" : "";
});