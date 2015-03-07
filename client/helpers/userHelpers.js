UI.registerHelper('usernameForUserId', function (userId) {
    var user = Meteor.users.findOne({_id: userId}, {fields: {username: 1}});
    return user && user.username || "[not found]";
});

UI.registerHelper('avatarForUserId', function (userId) {
    var user = Meteor.users.findOne({_id: userId}, {fields: {'profile.avatar': 1}});
    return user && user.profile && user.profile.avatar || "/images/logo128.png";
});

UI.registerHelper('colorForUserId', function (userId) {
    var user = Meteor.users.findOne({_id: userId}, {fields: {username: 1}});
    return user && user.username || "[not found]";
});
