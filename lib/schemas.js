Schemas = {};
Schemas.regex = {};

<<<<<<< HEAD
Schemas.regex.color = /^#([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?$/;
Schemas.regex.phoneNumber = /\+\d{11}/;
Schemas.regex.room = /^[\w]*$/;
=======
Schemas.regex.color = /#([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?\b/;
Schemas.regex.phoneNumber = /^\+\d{11}\b$/;

>>>>>>> Fixed slight bug with Phone Regex. Added start and end checks to prevent invalid numbers

Schemas.userProfile = new SimpleSchema({
    color: {
        type: String,
        label: "User Color",
        regEx: Schemas.regex.color
    },
    avatar: {
        type: String,
        label: "Avatar URL",
        optional: true
    },
    number: {
        type: String,
        label: "Phone Number",
        regEx: Schemas.regex.phoneNumber,
        optional: true
    }
});

Schemas.userProfile.messages({
    regEx: [
        {exp: Schemas.regex.color, msg: "[label] must be color string (e.g.) #FF0000 or #F00"},
        {exp: Schemas.regex.phoneNumber, msg: "[label] must be a phone number in this format +12223334444"}
    ]
});


Schemas.createRoom = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        regEx: Schemas.regex.room
    }
});