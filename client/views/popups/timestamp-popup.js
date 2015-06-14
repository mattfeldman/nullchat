Template.timestampPopup.helpers({
    'timeago':function(){
        /*function createTimestampPopup(timestamp) {
            var m = moment(timestamp);
            this.$('.message-timestamp').popup({
                title: m.fromNow(),
                content: m.format("dddd, MMMM Do YYYY"),
                position: "top right",
            });*/return Session.get('now');
    }
})