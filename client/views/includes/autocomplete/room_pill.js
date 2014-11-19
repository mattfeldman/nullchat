Template.roomPill.helpers({
    isPrivate: function () {
        if (this.isPrivate) {
            return "[LOCKED]";
        }
    }
});
