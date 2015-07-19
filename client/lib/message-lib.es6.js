MessageLib = {
    /*
     * Parses out #room mentions in message
     * @param message
     * @returns message with html room replacements
     */
    parseRoomLinks(message) {
        if (!message) {
            return message;
        }
        let rooms = this.getRoomNames();
        rooms = _.sortBy(rooms, room => -room.name.length); // TODO: Not this every message
        let loc = -1;
        while ((loc = message.indexOf("#", loc + 1)) >= 0) {
            for (let i = 0; i < rooms.length; i++) {
                const roomName = rooms[i].name;
                const roomNameLowercase = rooms[i].name.toLowerCase();
                if (message.toLowerCase().indexOf(roomNameLowercase, loc) === loc + 1) {
                    const leftHalf = message.substring(0, loc);
                    const middle = `<a href="room/${rooms[i]._id}" class="roomLink" >#${roomName}</a>`;
                    const rightHalf = message.substring(loc + roomName.length + 1, message.length + middle.length);
                    message = leftHalf + middle + rightHalf;
                    loc = loc + middle.length - 1;
                    break;
                }
            }
        }
        return message;
    },
    /*
     * Factored out room name query
     * @returns array of room id's and names
     */
    getRoomNames() {
        return Rooms.find({direct: {$ne: true}}, {'_id': 1, 'name': 1}).fetch();
    },
    /*
     * Parses @mentions in messages
     * @param message
     * @returns message with html name replacements
     */
    parseUserMentions(message) {
        if (!message) {
            return message;
        }
        let users = this.getUserNamesAndColors();
        users = _(users).sortBy(user => -user.username.length); // TODO: Not this every message
        let loc = -1;
        while ((loc = message.indexOf("@", loc + 1)) >= 0) {
            for (let i = 0; i < users.length; i++) {
                const userName = users[i].username;
                if (message.toLowerCase().indexOf(userName.toLowerCase(), loc) === loc + 1) {
                    const leftHalf = message.substring(0, loc);
                    const userColor = (users[i].profile && users[i].profile.color) || "black";
                    const userBackgroundColor = tinycolor(userColor).setAlpha(0.075).toRgbString();
                    const styleString = `style="border-bottom: 2px solid ${userColor}; background: ${userBackgroundColor};"`;
                    const middle = `<span class="message-user-mention" ${styleString} data-userId="${users[i]._id}">@${userName}</span>`;
                    const rightHalf = message.substring(loc + userName.length + 1, message.length + middle.length);
                    message = leftHalf + middle + rightHalf;
                    loc = loc + middle.length - 1;
                    break;
                }
            }
        }
        return message;
    },
    /*
     * Factored out username and color query
     * @returns [{_id,username,profile:{color}}]
     *
     */
    getUserNamesAndColors() {
        return Meteor.users.find({}, {fields: {'_id': 1, 'username': 1, 'profile.color': 1}}).fetch();
    },
    /*
     * Determines if message contains current users username
     * @param message
     * @returns true if message contains current username, false otherwise
     */
    hasUserMentions(message) {
        if (!message || typeof message !== "string") {
            return false;
        }
        const regex = new RegExp("[@\\s]+(" + Meteor.user({}, {fields: {'username': 1}}).username + ")($|[\\s!.?]+)");
        const regexMatch = message.match(regex);

        return regexMatch && regexMatch.length > 0 ? true : false;
    },
    renderMessage(message) {
        check(message, String);
        const emojiString = emojione.toImage(
            this.parseUserMentions(
                this.parseRoomLinks(
                    _s.escapeHTML(message))));
        return marked(emojiString);
    }
};
