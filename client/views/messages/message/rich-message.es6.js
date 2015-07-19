Template.richMessage.helpers({
    layoutName: function () {
        return this.layout + "Message";
    }
});
Template.richMessage.onRendered(function(){
    this.$('.ui.accordion').accordion();
});