describe('hasUserMentions', () => {
    it('should check parameters', () => {
        expect(MessageLib.hasUserMentions(undefined)).toBe(false);
        expect(MessageLib.hasUserMentions({})).toBe(false);
        expect(MessageLib.hasUserMentions("")).toBe(false);
    });
    it('should be true for current user', () => {
        spyOn(Meteor, "user").and.returnValue({username: "testuser"});
        expect(MessageLib.hasUserMentions("hey @testuser")).toBe(true);
    });
    it('should be false for different user', () => {
        spyOn(Meteor, "user").and.returnValue({username: "testuser"});
        expect(MessageLib.hasUserMentions("hey @falseuser")).toBe(false);
    });
});

describe('parseRoomLinks', () => {
    it('should handle unexpected values', () => {
        expect(MessageLib.parseRoomLinks("")).toBe("");
        expect(MessageLib.parseRoomLinks(null)).toBe(null);
    });
    it('should return message unmodified if no room links', () => {
        const message = 'hey @testuser some #nontestroom';
        expect(MessageLib.parseRoomLinks(message)).toBe(message);
    });
    it('should replace room links', () => {
        spyOn(MessageLib, "getRoomNames").and.returnValue(
            [{_id: "testroomid1", name: "testroom1"}, {_id: "testroomid2", name: "testroom2"}]
        );

        const message = '#testroom1#testroom1#testroom2#notatestroom';
        const parsedMessage = MessageLib.parseRoomLinks(message);
        expect(countInstances(parsedMessage, 'testroomid1')).toBe(2);
        expect(parsedMessage.indexOf('testroomid2')).not.toBe(-1);
        expect(countInstances(parsedMessage, 'class="roomLink"')).toBe(3);
    });
});

describe('parseUserMentions', () => {
    it('should handle unexpected values', () => {
        expect(MessageLib.parseUserMentions("")).toBe("");
        expect(MessageLib.parseUserMentions(null)).toBe(null);
    });
    it('should replace user mentions', () => {
        spyOn(MessageLib, "getUserNamesAndColors").and.returnValue(
            [{_id: "id1", username: "user1", color: "#FF0000"}, {_id: "id2", username: "user2"}]
        );

        const message = '@user1@user2@user3@user2';
        const parsedMessage = MessageLib.parseUserMentions(message);

        expect(countInstances(parsedMessage, 'id1')).toBe(1);
        expect(countInstances(parsedMessage, 'id2')).toBe(2);
        expect(countInstances(parsedMessage, 'class="message-user-mention"')).toBe(3);
    });
    it('should handle usernames that are substrings of other usernames', () => {
        spyOn(MessageLib, "getUserNamesAndColors").and.returnValue(
            [{_id: "id1", username: "blah", color: "#FF0000"}, {_id: "id2", username: "blahblah"}]
        );
        const message = '@blah@blahblah';
        const parsedMessage = MessageLib.parseUserMentions(message);

        expect(countInstances(parsedMessage, 'id1')).toBe(1);
        expect(countInstances(parsedMessage, 'id2')).toBe(1);
        expect(countInstances(parsedMessage, 'class="message-user-mention"')).toBe(2);
    });
});

function countInstances(string, word) {
    const substrings = string.split(word);
    return substrings.length - 1;
}