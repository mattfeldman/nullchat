RoomHelpers = {
    activeRoomFromId: function(id){
        return id && id === Session.get("currentRoom") ? "active" : "";
    }
};
Template.registerHelper('activeRoomFromId', RoomHelpers.activeRoomFromId);
