describe('RoomHelpers', () => {
    describe('activeRoomFromId', () => {
        function test(actual, room, expected) {
            Session.set("currentRoom", actual);
            expect(RoomHelpers.activeRoomFromId(room)).toBe(expected);
        }
        it('should return "active" if room is active', () => {
            test("someid", "someid", 'active');
        });
        it('should return empty string for undefined values', () => {
            test("someid", undefined, '');
            test(undefined, "someid", '');
        });
    });
});
