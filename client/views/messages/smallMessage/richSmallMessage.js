Template.richSmallMessage.helpers({
    layoutName: function () {
        return this.layout + "Message";
    }
});
Template.richSmallMessage.onRendered(function(){
    this.$('.ui.accordion').accordion();
});