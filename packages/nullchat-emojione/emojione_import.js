Meteor.startup(function() {
    Emojis.remove({});
    _(emojioneRaw).each(function(emoji) {
        emoji.category_order = parseInt(emoji.category_order);
        Emojis.insert(emoji);
    });
});
