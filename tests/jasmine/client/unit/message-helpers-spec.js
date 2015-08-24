describe('MessageHelpers', function () {
    describe('myMessageFromId', function () {
        it('should return falsy default', function () {
            expect(MessageHelpers.myMessageFromId()).toBeFalsy();
        });
        it('should return "my-message" when given current id', function () {
            spyOn(Meteor, 'userId').and.returnValue("testUser");
            expect(MessageHelpers.myMessageFromId("testUser")).toBe("my-message");
        });
        it('should return default when not my message', function () {
            spyOn(Meteor, 'userId').and.returnValue("testUser");
            expect(MessageHelpers.myMessageFromId("testUser2")).toBe("");
        });
    });
});
