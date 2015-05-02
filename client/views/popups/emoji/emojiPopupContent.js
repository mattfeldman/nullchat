var pageSize = 35;
Template.emojiPopupContent.helpers({
    emojis: function () {
        var page = Template.instance().currentPage.get() || 0;
        return Emojis.find({}, {sort: {name: 1}, limit: pageSize, skip: page*pageSize});
    },
});
Template.emojiPopupContent.onCreated(function () {
    var self = this;
    self.currentPage = new ReactiveVar(0);
    self.pageLimit = new ReactiveVar(0);
    Deps.autorun(function () {
        var emojiCount = Emojis.find().count();
        self.pageLimit.set(Math.floor(emojiCount / pageSize) + 1);
    });
});
Template.emojiPopupContent.events({
    'click .emoji': function (event, target) {
        addTextToInput($(event.target)[0].title);
    },
    'click .left-arrow': function (event, target) {
        target.currentPage.set((target.currentPage.get()-1) % target.pageLimit.get());
    },
    'click .right-arrow': function (event, target) {
        target.currentPage.set((target.currentPage.get()+1) % target.pageLimit.get());
    },
});