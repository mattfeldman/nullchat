Template.userPill.helpers({
    statusColor: function () {
        var status = this.status;
        if (!status) {
            return "grey";
        }
        else if (status.idle) { // ordering is important as online can be true at the same time
            return "orange";
        }
        else if (status.online) {
            return "green";
        }
        else {
            return "darkred";
        }

    },
    userColor: function(){
        if(this && this.profile && this.profile.color) {
            return "border-right: 3px solid" + this.profile.color;
        }
        else {
            return "border-right: 3px solid transparent";
        }
    }
});
