describe('UserHelpers', () => {
    describe('usernameForUserId', () => {
        function testWithUser(returnUser, expected) {
            spyOn(Meteor.users, 'findOne').and.returnValue(returnUser);
            expect(UserHelpers.usernameForUserId()).toBe(expected);
        }
        it('should retrive users name', () => {
            testWithUser({username: "foo"}, "foo");
        });
        it('should return a default value', () => {
            testWithUser({}, "[not found]");
        });
    });

    describe('avatarForUserId', () => {
        function testWithUser(returnUser, expected) {
            spyOn(Meteor.users, 'findOne').and.returnValue(returnUser);
            expect(UserHelpers.avatarForUserId()).toBe(expected);
        }
        it('should retrive users avatar', () => {
            testWithUser({profile: {avatar: "some-avatar"}}, "some-avatar");
        });
        it('should return a default value with no profile', () => {
            testWithUser({}, "/images/logo128.png");
        });
        it('should return a default value with no avatar in profile', () => {
            testWithUser({profile: {other: "stuff"}}, "/images/logo128.png");
        });
    });

    describe('colorForUserId', () => {
        function testWithUser(returnUser, expected) {
            spyOn(Meteor.users, 'findOne').and.returnValue(returnUser);
            expect(UserHelpers.colorForUserId()).toBe(expected);
        }
        it('should retrive users color', () => {
            testWithUser({profile: {color: "#FF0000"}}, "#FF0000");
        });
        it('should return a default value with no profile', () => {
            testWithUser({}, "transparent");
        });
        it('should return a default value with no color in profile', () => {
            testWithUser({profile: {notColor: "#FF0000"}}, "transparent");
        });
    });

    describe('userFromId', () => {
        it('should find the userId specified', () => {
            spyOn(Meteor.users, 'findOne');
            UserHelpers.userFromId("foo");
            expect(Meteor.users.findOne).toHaveBeenCalledWith({_id: "foo"});
        });
    });
    describe('otherUserId', () => {
        it('should remove current user from list', () => {
            spyOn(Meteor, 'userId').and.returnValue('myId');
            expect(UserHelpers.otherUserId(['foo', 'myId'])).toBe('foo');
        });

        it('should return a default value', () => {
            spyOn(Meteor, 'userId').and.returnValue('myId');
            expect(UserHelpers.otherUserId(['myId'])).toBe('');
        });
    });
});