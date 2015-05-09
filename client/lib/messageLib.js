/**
 * Parses out #room mentions in message
 * @param message
 * @returns message with html room replacements
 */
parseRoomLinks = function (message) {
    if (!message) { return message;}
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
};

/**
 * Parses @mentions in messages
 * @param message
 * @returns message with html name replacements
 */
parseNameMentions = function (message) {
    if (!message) {return message;}
    var users = Meteor.users.find({}, {fields: {'_id': 1, 'username': 1, 'profile.color': 1}}).fetch();
    users = _(users).sortBy(function (user) {
        return -user.username.length;
    }); // TODO: Not this every message
    var loc = -1;
    while ((loc = message.indexOf("@", loc + 1)) >= 0) {
        for (var i = 0; i < users.length; i++) {
            var userName = users[i].username;
            if (message.toLowerCase().indexOf(userName.toLowerCase(), loc) === loc + 1) {
                var leftHalf = message.substring(0, loc);
                var userColor = (users[i].profile && users[i].profile.color) || "black";
                var styleString = 'style="border-bottom: 2px solid ' + userColor + ';' + 'background: ' + tinycolor(userColor).setAlpha(0.075).toRgbString() + ';"';
                var middle = '<span class="message-user-mention" ' + styleString + ' data-userId="' + users[i]._id + '">@' + userName + '</span>';
                var rightHalf = message.substring(loc + userName.length + 1, message.length + middle.length);
                message = leftHalf + middle + rightHalf;
                loc = loc + middle.length - 1;
                break;
            }
        }
    }
    return message;
};

/**
 * Determines if message contains current users username
 * @param message
 * @returns true if message contains current username, false otherwise
 */
hasUserMentions = function (message) {
    if (!message || typeof  message !== "string") {return false;}
    var regex = new RegExp("[@\\s]+(" + Meteor.user({}, {fields: {'username': 1}}).username + ")($|[\\s!.?]+)");
    var regexMatch = message.match(regex);

    return regexMatch && regexMatch.length > 0 ? true : false;
};

renderMessage = function (message){
    check(message,String);
    var emojiString = emojify.replace(parseNameMentions(parseRoomLinks(_s.escapeHTML(message))));
    return Autolinker.link(emojiString, {twitter: false, className: "message-link"});
}