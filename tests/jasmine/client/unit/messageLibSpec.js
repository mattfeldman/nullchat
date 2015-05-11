describe('hasUserMentions',function(){
    it('should check parameters',function(){
        expect(hasUserMentions(undefined)).toBe(false);
        expect(hasUserMentions({})).toBe(false);
        expect(hasUserMentions("")).toBe(false);
    });
    it('should be true for current user',function(){
        spyOn(Meteor, "user").and.returnValue({username:"testuser"});
        expect(hasUserMentions("hey @testuser")).toBe(true);
    });
    it('should be false for different user',function(){
        spyOn(Meteor, "user").and.returnValue({username:"testuser"});
        expect(hasUserMentions("hey @falseuser")).toBe(false);
    });
});
describe('parseRoomLinks',function(){
    it('should handle unexpected values',function(){
        expect(parseRoomLinks("")).toBe("");
        expect(parseRoomLinks(null)).toBe(null);
    });
    it('should return message unmodified if no room links',function(){
        var message = 'hey @testuser some #nontestroom';
        expect(parseRoomLinks(message)).toBe(message);
    });
    it('should replace room link',function(){
        var roomName = "#testroom";
        var roomId = "testroomid";
        spyOn(window,"getRoomNames").and.returnValue([{_id:roomId,name:roomName}]);
        var message = 'hey @testuser this is '+roomName+' some message';
        var parsedMessage = parseRoomLinks(message);
        expect(parsedMessage.indexOf(roomId));
        expect(parsedMessage.indexOf('class="roomLink"')).not.toBe(-1);
    });
});