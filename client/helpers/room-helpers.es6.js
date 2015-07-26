RoomHelpers = {
    activeRoomFromId(id) {
        return id && id === Session.get("currentRoom") ? "active" : "";
    },
    currentRoomName() {
        const room = Rooms.findOne({_id: Session.get('currentRoom')}, {fields: {'name': 1}});
        return room && room.name || "[unknown]";
    }
};
Template.registerHelper('activeRoomFromId', RoomHelpers.activeRoomFromId);
Template.registerHelper('currentRoomName', RoomHelpers.currentRoomName);
