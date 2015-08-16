UserHelpers = {
    usernameForUserId(userId) {
        const user = Meteor.users.findOne({_id: userId}, {fields: {username: 1}});
        return user && user.username || "[not found]";
    },
    avatarForUserId(userId) {
        const user = Meteor.users.findOne({_id: userId}, {fields: {'profile.avatar': 1}});
        return user && user.profile && user.profile.avatar || "/images/logo128.png";
    },
    colorForUserId(userId) {
        const user = Meteor.users.findOne({_id: userId}, {fields: {'profile.color': 1}});
        return user && user.profile && user.profile.color || "transparent";
    },
    userFromId(userId) {
        return Meteor.users.findOne({_id: userId});
    },
    otherUserId(users) {
        const otherUsersId = _(users).without(Meteor.userId());
        return otherUsersId && otherUsersId[0] || "";
    },
    idleTextForUserId(userId) {
        const user = Meteor.users.findOne({_id: userId}, {fields: {'status': 1}});
        if(user.status.online) {
            return "online";
        }
        if (user.status && user.status.lastActivity) {
            return moment(user.status.lastActivity).fromNow();
        }
        else if (!user.status.online && user.status && user.status.lastLogin && user.status.lastLogin.date) {
            return moment(user.status.lastLogin.date).fromNow();
        }
    }
};
Template.registerHelper('usernameForUserId', UserHelpers.usernameForUserId);
Template.registerHelper('avatarForUserId', UserHelpers.avatarForUserId);
Template.registerHelper('colorForUserId', UserHelpers.colorForUserId);
Template.registerHelper('userFromId', UserHelpers.userFromId);
Template.registerHelper('otherUserId', UserHelpers.otherUserId);
Template.registerHelper('idleTextForUserId', UserHelpers.idleTextForUserId);