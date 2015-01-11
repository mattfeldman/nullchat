Schemas = {};
Schemas.regex = {};

Schemas.regex.color = /#([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?\b/;
Schemas.regex.phoneNumber = /\+\d{11}/;


Schemas.userProfile = new SimpleSchema({
    color: {
        type: String,
        label: "User Color",
        regEx:Schemas.regex.color
    },
    avatar: {
        type: String,
        label: "Avatar URL",
        optional: true
    },
    number: {
        type: String,
        label: "Phone Number",
        regEx:Schemas.regex.phoneNumber
    }
});

Schemas.userProfile.messages({
    regEx: [
        { exp: Schemas.regex.color, msg: "[label] must be color string (e.g.) #FF0000 or #FF00" },
        { exp: Schemas.regex.phoneNumber, msg: "[label] must be a phone number in this format +12223334444"}
    ]
});