Template.richMessage.helpers({
    layoutName() {
        return this.layout + "Message";
    }
});
Template.richMessage.onRendered(function () {
    this.$('.ui.accordion').accordion();
});
