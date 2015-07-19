Template.messageUser.helpers({
    username() {
        const user = Meteor.users.findOne({_id: this.toString()}, {fields: {"username": 1}});
        return user.username;
    },
    avatar() {
        const user = Meteor.users.findOne({_id: this.toString()}, {fields: {"profile.avatar": 1}});
        return (user && user.profile && user.profile.avatar) || "/images/logo64.png";
    },
    avatarBackgroundStyle() {
        const user = Meteor.users.findOne({_id: this.toString()}, {fields: {"profile.color": 1}});
        if (user && user.profile && user.profile.color) {
            return `background-color: ${user.profile.color};`;
        }
    }
});
