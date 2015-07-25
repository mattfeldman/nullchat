describe('MessageHelpers', () => {
    describe('myMessageFromId', () => {
        it('should return falsy default', () => {
            expect(MessageHelpers.myMessageFromId()).toBeFalsy();
        });
        it('should return "my-message" when given current id', () => {
            spyOn(Meteor, 'userId').and.returnValue("testUser");
            expect(MessageHelpers.myMessageFromId("testUser")).toBe("my-message");
        });
        it('should return default when not my message', () => {
            spyOn(Meteor, 'userId').and.returnValue("testUser");
            expect(MessageHelpers.myMessageFromId("testUser2")).toBe("");
        });
    });
});
