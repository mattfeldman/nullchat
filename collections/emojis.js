Emojis = new Meteor.Collection("emojis");

// Populate emojis
if (Meteor.isServer) {
    if (emojify.emojiNames.length !== 0 && emojify.emojiNames.length !== Emojis.find().count()) {
        _.forEach(emojify.emojiNames, function (emojiName) {
            var emoji = ':'+emojiName+':';
            var html = emojify.replace(emoji);
            Emojis.upsert({name: emojiName}, {name: emojiName, html: html});
        });
    }
}