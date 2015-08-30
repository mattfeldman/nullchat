Template.body.onCreated(function () {
    Session.set('unreadMessages', 0);
    Deps.autorun(function () {
        const numberOfUnreadMessages = Session.get('unreadMessages');
        const currentRoom = Rooms.findOne({_id: Session.get('currentRoom')});
        if (!currentRoom) return;

        let currentRoomString = '';

        if (currentRoom.direct) {
            const otherUserId = UserHelpers.otherUserId(currentRoom.users);
            currentRoomString = "@" + UserHelpers.usernameForUserId(otherUserId) + ' ';
        }
        else {
            currentRoomString = '#' + currentRoom.name + ' ';
        }

        if (numberOfUnreadMessages > 0) {
            document.title = "(" + numberOfUnreadMessages + ")" + " " + currentRoomString + window.location.hostname;
        }
        else {
            document.title = currentRoomString + window.location.hostname;
        }
    });
});
