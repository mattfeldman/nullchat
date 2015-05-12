describe('hasUserMentions', function () {
    it('should check parameters', function () {
        expect(hasUserMentions(undefined)).toBe(false);
        expect(hasUserMentions({})).toBe(false);
        expect(hasUserMentions("")).toBe(false);
    });
    it('should be true for current user', function () {
        spyOn(Meteor, "user").and.returnValue({username: "testuser"});
        expect(hasUserMentions("hey @testuser")).toBe(true);
    });
    it('should be false for different user', function () {
        spyOn(Meteor, "user").and.returnValue({username: "testuser"});
        expect(hasUserMentions("hey @falseuser")).toBe(false);
    });
});
describe('parseRoomLinks', function () {
    it('should handle unexpected values', function () {
        expect(parseRoomLinks("")).toBe("");
        expect(parseRoomLinks(null)).toBe(null);
    });
    it('should return message unmodified if no room links', function () {
        var message = 'hey @testuser some #nontestroom';
        expect(parseRoomLinks(message)).toBe(message);
    });
    it('should replace room links', function () {
        spyOn(window, "getRoomNames").and.returnValue(
            [{_id: "testroomid1", name: "testroom1"}, {_id: "testroomid2", name: "testroom2"}]
        );
        function countInstances(string, word) {
            var substrings = string.split(word);
            return substrings.length - 1;
        }
        var message = '#testroom1#testroom1#testroom2#notatestroom';
        var parsedMessage = parseRoomLinks(message);
        expect(countInstances(parsedMessage,'testroomid1')).toBe(2);
        expect(parsedMessage.indexOf('testroomid2')).not.toBe(-1);
        expect(countInstances(parsedMessage,'class="roomLink"')).toBe(3);
    });
});