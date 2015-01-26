Meteor.methods({
    'updateTypingActivity': function (room) {
        //TODO: Validate room
        var timestamp = new Date();
        Meteor.users.update({_id: Meteor.userId()}, {
            $set: {
                "status.lastTyping": timestamp,
                "status.lastActiveRoom": room
            }
        });
    },
    'updateProfile': function (profile) {
        check(profile, Schemas.userProfile);
        Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile': profile}});
    },
    'updateRoomPreferences': function (room, roomPreferences) {
        //TODO CHeck room
        console.log(roomPreferences);
        check(roomPreferences, Schemas.roomPreference);
        var roomPreferenceKey = 'preferences.' + room;
        Meteor.users.update({_id: Meteor.userId()}, {$set: {roomPreferenceKey: roomPreferences}});
    },
    'punchcard': function () {
        if (Meteor.isServer) {
            var milisecondsInWeek = 60 * 1000 * 60 * 24;
            var milisecondsIn15Minutes = 60 * 1000 * 15;
            var pipeline = [
                {$match: {authorId: Meteor.userId(), type: "plain"}},
                {
                    $project: {
                        "timestamp": {"$divide": [{"$mod": ["$timestamp", milisecondsInWeek]}, milisecondsIn15Minutes]},
                    }
                },
                {
                    $project: {
                        "timestamp": {"$subtract": ["$timestamp", {"$mod": ["$timestamp", 1]}]},
                    }
                },
                {$group: {"_id": "$timestamp", count: {$sum: 1}}}
            ];
            return Messages.aggregate(pipeline);
        }
    }
});