Template.emojiPopupContent.helpers({
    emojisForCategory(category){
        check(category, String);
        return _.chain(emojis)
                        .filter(e=>{return e.category === category;})
                        .sortBy(e=>{return parseInt(e.category_order);})
                        .value();
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