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