Template.uploadModalContent.helpers({
    'uploadCallback': function () {
        return {
            finished: function (index, fileInfo, context) {
                check(fileInfo, Match.ObjectIncluding({
                    size: Match.Integer,
                    url: String
                }));
                Meteor.call('message', {
                    roomId: Session.get('currentRoom'),
                    message: '**Uploaded:** ' + fileInfo.url + ' (' + fileInfo.size / 1000000 + 'mb)'
                });
                $(".uploadModal").modal('hide');
            }
        };
    },
});