Meteor.users.deny({
    update() {
        return true;
    }
});

Meteor.methods({
    updateTypingActivity(room) {
        check(room, String);
        const timestamp = new Date();
        Meteor.users.update({_id: Meteor.userId()}, {
            $set: {
                "status.lastTyping": timestamp,
                "status.lastActiveRoom": room
            }
        });
    },
    updateUsername(username) {
        check(username, String);
        const usernameRegex = new RegExp("$" + username + "^", "i");
        const user = Meteor.users.findOne({username: {$regex: usernameRegex}});
        if (user) {
            throw new Meteor.Error("username-taken");
        }
        else if (!Schemas.regex.username.test(username)) {
            throw new Meteor.Error("username-alphanumeric");
        }
        else {
            Meteor.users.update({_id: Meteor.userId()}, {$set: {'username': username}});
        }
    },
    updateProfile(profile) {
        check(profile, Schemas.userProfile);
        Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile': profile}});
    },
    updateRoomOrder(roomOrderArr) {
        check(roomOrderArr, [String]);
        Meteor.users.update({_id: Meteor.userId()}, {$set: {"preferences.roomOrder": roomOrderArr}});
    },
    updateRoomPreferences(roomPreference) {
        if (!Match.test(roomPreference, Schemas.roomPreference)) {
            throw new Meteor.Error(roomPreference + " did not match schema.");
        }

        const preferenceUser = Meteor.user();
        let preferences = {};
        let roomPreferences = [];
        if (preferenceUser && preferenceUser.preferences) {
            preferences = preferenceUser.preferences;
            if (preferenceUser.preferences.room) {
                roomPreferences = preferenceUser.preferences.room;
            }
        }

        let i;
        for (i = 0; i < roomPreferences.length; i++) {
            if (roomPreferences[i].roomId === roomPreference.roomId) {
                roomPreferences[i] = roomPreference;
                break;
            }
        }
        // No current preference found
        if (i === roomPreferences.length) {
            roomPreferences.push(roomPreference);
        }

        preferences.room = roomPreferences;
        Meteor.users.update({_id: Meteor.userId()}, {$set: {"preferences": preferences}});
    },
    punchcard(userId) {
        check(userId, String);

        const metricUser = userId || Meteor.userId();
        if (Meteor.isServer) {
            const milisecondsInWeek = 60 * 1000 * 60 * 24;
            const milisecondsIn5Minutes = 60 * 1000 * 5;
            const pipeline = [
                {$match: {authorId: metricUser, type: "plain"}},
                {
                    $project: {
                        "timestamp": {"$divide": [{"$mod": ["$timestamp", milisecondsInWeek]}, milisecondsIn5Minutes]}
                    }
                },
                {
                    $project: {
                        "timestamp": {"$subtract": ["$timestamp", {"$mod": ["$timestamp", 1]}]}
                    }
                },
                {$group: {_id: "$timestamp", count: {$sum: 1}}}
            ];
            return Messages.aggregate(pipeline);
        }
    },
    roomPunchcard(options) {
        if (!options.roomId) {
            throw new Meteor.Error("Need room id");
        }
        const userId = options.userId || Meteor.userId();
        const roomId = options.roomId;
        if (Meteor.isServer) {
            const milisecondsInWeek = 60 * 1000 * 60 * 24;
            const milisecondsIn15Minutes = 60 * 1000 * 15;
            const pipeline = [
                {$match: {authorId: userId, type: "plain", roomId: roomId}},
                {
                    $project: {
                        "timestamp": {"$divide": [{"$mod": ["$timestamp", milisecondsInWeek]}, milisecondsIn15Minutes]}
                    }
                },
                {
                    $project: {
                        "timestamp": {"$subtract": ["$timestamp", {"$mod": ["$timestamp", 1]}]}
                    }
                },
                {$group: {_id: "$timestamp", count: {$sum: 1}}}
            ];
            return Messages.aggregate(pipeline);
        }
    }
});
