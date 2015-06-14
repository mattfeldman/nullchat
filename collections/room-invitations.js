RoomInvitations = new Meteor.Collection('room_invitations');

Meteor.methods({
    'roomInvitation': function (targetUserId, targetRoomId) {
        var targetUser = Meteor.users.findOne(targetUserId);
        var room = Rooms.findOne(targetRoomId);

        if (!room) {
            throw new Meteor.Error("Room could not be found.");
        }
        if (!targetUser) {
            throw new Meteor.Error("User could not be found.");
        }
        if(room.direct){
            throw new Meteor.Error("Can not invite to direct message rooms.");
        }

        // currentUser has to have permission on targetRoom
        if (room.isPrivate && !_(room.invited).contains(Meteor.userId())) {
            throw new Meteor.Error("You don't have permission to invite to that room.");
        }
        if (_(room.users).contains(targetUser._id)){
            throw new Meteor.Error("User in that room.");
        }

        var roomInvitation = {
            invitingUser: Meteor.userId(),
            invitedUser: targetUser._id,
            roomId: room._id,
            timestamp: new Date(),
            active: true
        };
        check(roomInvitation, Schemas.roomInvitation);

        var existingInvitation = RoomInvitations.findOne({
            invitingUser: roomInvitation.invitingUser,
            invitedUser: roomInvitation.invitedUser,
            roomId: roomInvitation.roomId,
            active: true // NOTE: This could be harassed, reconsider later
        });
        if (existingInvitation) {
            throw new Meteor.Error("You've already invited that user to that room.");
        }
        RoomInvitations.insert(roomInvitation);
        Rooms.update({_id: room._id}, {$addToSet: {invited: targetUser._id}});
    },
    'acceptRoomInvitation': function (roomInvitationId) {
        updateRoomInvitation(roomInvitationId, true);
    },
    'dismissRoomInvitation': function (roomInvitationId) {
        updateRoomInvitation(roomInvitationId,false);
    }
});
function updateRoomInvitation(id,accepted){
    var roomInvitation = RoomInvitations.findOne({_id:id});

    if(!roomInvitation){
        throw new Meteor.Error("Can't find room invitation.");
    }
    if(roomInvitation.invitedUser !== Meteor.userId()){
        throw new Meteor.Error("Can only update your own invitations.");
    }

    RoomInvitations.update({_id: id}, {
        $set: {
            didAccept: accepted,
            completedTime: new Date(),
            active: false
        }
    });
    if(accepted){
        Meteor.call('joinRoom',roomInvitation.roomId);
    }
}
Schemas.roomInvitation = new SimpleSchema({
    invitingUser: {
        type: String,
        label: "Inviting User",
    },
    invitedUser: {
        type: String,
        label: "Invited User",
    },
    roomId: {
        type: String,
        label: "Room Id",
    },
    timestamp: {
        type: Date,
        label: "Timestamp",
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