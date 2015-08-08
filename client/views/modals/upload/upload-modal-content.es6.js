Template.uploadModalContent.helpers({
    uploadCallback() {
        return {
            finished(index, fileInfo, context) {
                check(fileInfo, Match.ObjectIncluding({
                    size: Match.Integer,
                    url: String
                }));
                Meteor.call('message', {
                    roomId: Session.get('currentRoom'),
                    message: `**Upload: **${fileInfo.url} (${fileInfo.size / 1000000}mb)`
                }, AlertFeedback);
                $(".uploadModal").modal('hide');
            }
        };
    },
});
