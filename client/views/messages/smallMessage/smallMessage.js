Template.smallMessage.helpers({
    'messageTemplate': function () {
        if (this.type === "plain") {
            return "plainSmallMessage";
        }
        else if (this.type === "feedback") {
            return "feedbackMessage";
        }
        else if (this.type === "rich") {
            return "richSmallMessage";
        }
    }
});