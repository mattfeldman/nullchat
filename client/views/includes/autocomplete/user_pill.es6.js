Template.userPill.helpers({
    statusColor() {
        const status = this.status;
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
    }
});
