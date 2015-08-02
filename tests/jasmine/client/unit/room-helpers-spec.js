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
            test(undefined, "someid", '');
        });
    });
    describe('currentRoomName', function () {
        function test(room, expected) {
            spyOn(Rooms, "findOne").and.returnValue(room);
            expect(RoomHelpers.currentRoomName()).toBe(expected);
        }

        it('should return room\'s name', function () {
            Session.set('currentRoom', 'foo');
            test({name: '123'}, '123');
            var arg = Rooms.findOne.calls.mostRecent().args[0];
            expect(_.isEqual(arg, {_id: 'foo'})).toBeTruthy();
        });
        it('should return room\'s name', function () {
            test({name: '123'}, '123');
        });
        it('should return default if room not found', function () {
            test(undefined, '[unknown]');
        });
        it('should return default if room name not found', function () {
            test({prop: '123'}, '[unknown]');
        });
    });
});
