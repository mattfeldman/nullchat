Template.emojiPopupContent.helpers({
    emojisForCategory(category){
        check(category, String);
        return emojis[category] || [];
    },
    emojiDisplay:function(emoji){
        return emojione.toImage(emoji);
    }
});
Template.emojiPopupContent.onRendered(function(){
    this.$(".menu .item").tab();
});
Template.emojiPopupContent.events({
    'click .emojione': function (event, target) {
        // TODO: Less Hacky jQuery
        addTextToInput($(event.target).parent().data('emoji'));
    },
});