describe('hasUserMentions', function () {
    it('should check parameters', function () {
        expect(MessageLib.hasUserMentions(undefined)).toBe(false);
        expect(MessageLib.hasUserMentions({})).toBe(false);
        expect(MessageLib.hasUserMentions("")).toBe(false);
    });
    it('should be true for current user', function () {
        spyOn(Meteor, "user").and.returnValue({username: "testuser"});
        expect(MessageLib.hasUserMentions("hey @testuser")).toBe(true);
    });
    it('should be false for different user', function () {
        spyOn(Meteor, "user").and.returnValue({username: "testuser"});
        expect(MessageLib.hasUserMentions("hey @falseuser")).toBe(false);
    });
});

describe('parseRoomLinks', function () {
    it('should handle unexpected values', function () {
        expect(MessageLib.parseRoomLinks("")).toBe("");
        expect(MessageLib.parseRoomLinks(null)).toBe(null);
    });
    it('should return message unmodified if no room links', function () {
        var message = 'hey @testuser some #nontestroom';
        expect(MessageLib.parseRoomLinks(message)).toBe(message);
    });
    it('should replace room links', function () {
        spyOn(MessageLib, "getRoomNames").and.returnValue(
            [{_id: "testroomid1", name: "testroom1"}, {_id: "testroomid2", name: "testroom2"}]
        );

        var message = '#testroom1#testroom1#testroom2#notatestroom';
        var parsedMessage = MessageLib.parseRoomLinks(message);
        expect(countInstances(parsedMessage, 'testroomid1')).toBe(2);
        expect(parsedMessage.indexOf('testroomid2')).not.toBe(-1);
        expect(countInstances(parsedMessage, 'class="roomLink"')).toBe(3);
    });
});

describe('parseUserMentions', function () {
    it('should handle unexpected values', function () {
        expect(MessageLib.parseUserMentions("")).toBe("");
        expect(MessageLib.parseUserMentions(null)).toBe(null);
    });
    it('should replace user mentions', function () {
        spyOn(MessageLib, "getUserNamesAndColors").and.returnValue(
            [{_id: "id1", username: "user1", color: "#FF0000"}, {_id: "id2", username: "user2"}]
        );

        var message = '@user1@user2@user3@user2';
        var parsedMessage = MessageLib.parseUserMentions(message);

        expect(countInstances(parsedMessage, 'id1')).toBe(1);
        expect(countInstances(parsedMessage, 'id2')).toBe(2);
        expect(countInstances(parsedMessage, 'class="message-user-mention"')).toBe(3);
    });
    it('should handle usernames that are substrings of other usernames', function () {
        spyOn(MessageLib, "getUserNamesAndColors").and.returnValue(
            [{_id: "id1", username: "blah", color: "#FF0000"}, {_id: "id2", username: "blahblah"}]
        );
        var message = '@blah@blahblah';
        var parsedMessage = MessageLib.parseUserMentions(message);

        expect(countInstances(parsedMessage, 'id1')).toBe(1);
        expect(countInstances(parsedMessage, 'id2')).toBe(1);
        expect(countInstances(parsedMessage, 'class="message-user-mention"')).toBe(2);
    });
});

function countInstances(string, word) {
    var substrings = string.split(word);
    return substrings.length - 1;
}