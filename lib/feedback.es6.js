Feedback = {
    "help-no-room": {type: "error", message: "Can't get help outside a room, lame."},
    "kick-no-user": {type: "error", message: "You must specify a valid user to kick."},
    "kick-no-room": {type: "error", message: "Invalid room specified."},
    "moderator-no-user": {type: "error", message: "You must specify a valid user to make a moderator."},
    "moderator-no-room": {type: "error", message: "Invalid room specified."},
    "moderator-not-owner": {type: "error", message: "You must specify a valid user to make a moderator."},
    "moderator-already-moderator": {type: "error", message: "User is already a moderator"},
    "invite-no-user": {type: "error", message: "You must specify a user to invite."},
    "invite-no-room": {type: "error", message: "Invalid room specified."},
    "topic-no-topic": {type: "error", message: "You must specify a topic."},
    "topic-not-owner": {type: "error", message: "You must be the owner to change topics."},
    "number-no-number": {type: "error", message: "Specify phone number in this format: +12223334444"},
    "gravatar-no-email": {type: "error", message: "Must specify a gravatar email address."},
    "color-no-color": {type: "error", message: "Must specify a color string (e.g.) #FF000 or #F00"},
    "avatar-no-url": {type: "error", message: "Must specify url"},
    "meme-error-creating": {type: "error", message: "Error creating meme."},
    "meme-bad-usage": {type: "error", message: "Usage: /meme name [top line text] [bottom line text"},
    "join-no-room": {type: "error", message: "Can not find room."},
};

AlertFeedback = (err, data) => {
    if (err && err.error) {
        const feedback = Feedback[err.error];
        console.log(feedback);
        if (feedback && feedback.message) {
            sAlert.error(feedback.message);
        }
    }
};
//const feedback = Feedback[message];
//const content = feedback && feedback.message || message;