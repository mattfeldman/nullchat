/**
 * Parses out #room mentions in message
 * @param message
 * @returns message with html room replacements
 */
parseRoomLinks = function(message){
    if(!message){ return message;}
    var rooms = Rooms.find({}, {'_id': 1, 'name': 1}).fetch();
    rooms = _.sortBy(rooms, function (room) {
        return -room.name.length;
    }); // TODO: Not this every message
    var loc = -1;
    while ((loc = message.indexOf("#", loc + 1)) >= 0) {
        for (var i = 0; i < rooms.length; i++) {
            var roomName = rooms[i].name;
            var roomNameLowercase = rooms[i].name.toLowerCase();
            if (message.toLowerCase().indexOf(roomNameLowercase, loc) === loc + 1) {
                var leftHalf = message.substring(0, loc);
                var middle = '<a href="room/' + rooms[i]._id + '" class="roomLink" >#' + roomName + '</a>';
                var rightHalf = message.substring(loc + roomName.length + 1, message.length + middle.length);
                message = leftHalf + middle + rightHalf;
                loc = loc + middle.length - 1;
                break;
            }
        }
    }
    return message;
}