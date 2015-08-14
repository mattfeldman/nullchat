Template.richMessage.helpers({
    layoutName() {
        return this.layout + "Message";
    }
});
Template.richMessage.onRendered(function () {
    this.$('.ui.accordion').accordion();
});
Template.richMessage.events({
    'mouseenter .avatar'(event, template) {
        Client.showPopup(event.target, "userProfileCard", template.data.authorId);
    }
});
