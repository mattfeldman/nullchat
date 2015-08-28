RoomHelpers = {
    activeRoomFromId(id) {
        return id && id === Session.get("currentRoom") ? "active" : "";
    },
    currentRoomName() {
        return RoomHelpers.roomNameFromRoomId(Session.get("currentRoom"));
    },
    roomNameFromRoomId(roomId) {
        check(roomId, String);
        const room = Rooms.findOne({_id: roomId}, {fields: {'name': 1, 'direct': 1, 'users': 1}});
        let name = room && room.name;
        if (room && room.direct) {
            const directUserId = UserHelpers.otherUserId(room.users);
            name = UserHelpers.usernameForUserId(directUserId);
        }
        return name || "[unknown]";
    }
};
Template.registerHelper('activeRoomFromId', RoomHelpers.activeRoomFromId);
Template.registerHelper('currentRoomName', RoomHelpers.currentRoomName);
Template.registerHelper('roomNameFromRoomId', RoomHelpers.roomNameFromRoomId);
