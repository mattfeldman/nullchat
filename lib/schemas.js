Schemas = {};
Schemas.regex = {};

Schemas.regex.color = /#([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?\b/;

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
    }
});