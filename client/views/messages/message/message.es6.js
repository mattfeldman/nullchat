Template.message.helpers({
    messageTemplate() {
        if (this.type === "plain") {
            return "plainMessage";
        }
        else {
            return "richMessage";
        }
    }
});
