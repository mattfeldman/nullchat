Template.userPill.helpers({
    statusColor() {
        var status = this.status;
        if (!status) {
            return "unknown";
        }
        else if (status.idle) { // ordering is important as online can be true at the same time
            return "idle";
        }
        else if (status.online) {
            return "online";
        }
        else {
            return "offline";
        }
    },
    userColor() {
        if (this && this.profile && this.profile.color) {
            return "border-right: 3px solid" + this.profile.color;
        }
        else {
            return "border-right: 3px solid transparent";
        }
    },
    idleTime() {
        const now = Session.get("now"); // Time reactivity hack
        if (this.status && this.status.lastActivity) {
            return moment(this.status.lastActivity).fromNow();
        }
        else if(!this.status.online && this.status && this.status.lastLogin && this.status.lastLogin.date) {
            return moment(this.status.lastLogin.date).fromNow();
        }
    }
});
