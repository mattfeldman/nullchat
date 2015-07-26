describe('RoomHelpers', function () {
    describe('activeRoomFromId', function () {
        function test(actual, room, expected) {
            Session.set("currentRoom", actual)
            expect(RoomHelpers.activeRoomFromId(room)).toBe(expected);
        }
        it('should return "active" if room is active', function () {
            test("someid", "someid", 'active');
        });
        it('should return empty string for undefined values', function () {
            test("someid", undefined, '');
            test(undefined,"someid", '');
        });
    });
});
