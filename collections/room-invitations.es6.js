RoomInvitations = new Meteor.Collection('room_invitations');
function updateRoomInvitation(id, accepted) {
    const roomInvitation = RoomInvitations.findOne({_id: id});

    if (!roomInvitation) {
        throw new Meteor.Error("Can't find room invitation.");
    }
    if (roomInvitation.invitedUser !== Meteor.userId()) {
        throw new Meteor.Error("Can only update your own invitations.");
    }

    RoomInvitations.update({_id: id}, {
        $set: {
            didAccept: accepted,
            completedTime: new Date(),
            active: false
        }
    });
    if (accepted) {
        Meteor.call('joinRoom', roomInvitation.roomId, AlertFeedback);
    }
}
Meteor.methods({
    roomInvitation(targetUserId, targetRoomId) {
        check(targetUserId, String);
        check(targetRoomId, String);

        const targetUser = Meteor.users.findOne(targetUserId);
        const room = Rooms.findOne(targetRoomId);

        if (!room) {
            throw new Meteor.Error("room-not-found");
        }
        if (!targetUser) {
            throw new Meteor.Error("user-not-found");
        }
        if (room.direct) {
            throw new Meteor.Error("invite-to-direct");
        }

        // currentUser has to have permission on targetRoom
        if (room.isPrivate && !_(room.invited).contains(Meteor.userId())) {
            throw new Meteor.Error("invite-no-permission");
        }
        if (_(room.users).contains(targetUser._id)) {
            throw new Meteor.Error("invite-already");
        }

        const roomInvitation = {
            invitingUser: Meteor.userId(),
            invitedUser: targetUser._id,
            roomId: room._id,
            timestamp: new Date(),
            active: true
        };
        check(roomInvitation, Schemas.roomInvitation);

        const existingInvitation = RoomInvitations.findOne({
            invitingUser: roomInvitation.invitingUser,
            invitedUser: roomInvitation.invitedUser,
            roomId: roomInvitation.roomId,
            active: true // NOTE: This could be harassed, reconsider later
        });
        if (existingInvitation) {
            throw new Meteor.Error("invite-already");
        }
        RoomInvitations.insert(roomInvitation);
        Rooms.update({_id: room._id}, {$addToSet: {invited: targetUser._id}});
    },
    acceptRoomInvitation(roomInvitationId) {
        check(roomInvitationId, String);
        updateRoomInvitation(roomInvitationId, true);
    },
    dismissRoomInvitation(roomInvitationId) {
        check(roomInvitationId, String);
        updateRoomInvitation(roomInvitationId, false);
    }
});
Schemas.roomInvitation = new SimpleSchema({
    invitingUser: {
        type: String,
        label: "Inviting User"
    },
    invitedUser: {
        type: String,
        label: "Invited User"
    },
    roomId: {
        type: String,
        label: "Room Id"
    },
    timestamp: {
        type: Date,
        label: "Timestamp"
    },
    active: {
        type: Boolean,
        label: "Active"
    },
    completedTime: {
        type: Date,
        label: "Completed Time",
        optional: true // deferred until completion
    },
    didAccept: {
        type: Boolean,
        label: "Accepted or Rejected",
        optional: true // deferred until completion
    }
});
