Template.emojiCard.helpers({
    emojis: function () {
        var skip = Template.instance().offset.get() || 0;
        return Emojis.find({}, {limit: 20, skip: skip});
    }
});
Template.emojiCard.onCreated(function () {
    var self = this;
    self.offset = new ReactiveVar(0);
    self.totalEmojis = new ReactiveVar(0);
    Deps.autorun(function () {
        self.totalEmojis.set(Emojis.find().count());
    });
});
Template.emojiCard.events({
    'click .left-arrow': function (event, target) {
        target.offset.set(target.offset.get() - 20 % (target.totalEmojis.get() - 20));
    },
    'click .right-arrow': function (event, target) {
        target.offset.set(target.offset.get() + 20 % (target.totalEmojis.get() - 20));
    },
});