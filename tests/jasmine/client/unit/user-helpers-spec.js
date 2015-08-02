describe('UserHelpers', function () {
    describe('usernameForUserId', function () {
        function testWithUser(returnUser, expected) {
            spyOn(Meteor.users, 'findOne').and.returnValue(returnUser);
            expect(UserHelpers.usernameForUserId()).toBe(expected);
        }

        it('should retrive users name', function () {
            testWithUser({username: "foo"}, "foo");
        });
        it('should return a default value', function () {
            testWithUser({}, "[not found]");
        });
    });

    describe('avatarForUserId', function () {
        function testWithUser(returnUser, expected) {
            spyOn(Meteor.users, 'findOne').and.returnValue(returnUser);
            expect(UserHelpers.avatarForUserId()).toBe(expected);
        }

        it('should retrive users avatar', function () {
            testWithUser({profile: {avatar: "some-avatar"}}, "some-avatar");
        });
        it('should return a default value with no profile', function () {
            testWithUser({}, "/images/logo128.png");
        });
        it('should return a default value with no avatar in profile', function () {
            testWithUser({profile: {other: "stuff"}}, "/images/logo128.png");
        });
    });

    describe('colorForUserId', function () {
        function testWithUser(returnUser, expected) {
            spyOn(Meteor.users, 'findOne').and.returnValue(returnUser);
            expect(UserHelpers.colorForUserId()).toBe(expected);
        }

        it('should retrive users color', function () {
            testWithUser({profile: {color: "#FF0000"}}, "#FF0000");
        });
        it('should return a default value with no profile', function () {
            testWithUser({}, "transparent");
        });
        it('should return a default value with no color in profile', function () {
            testWithUser({profile: {notColor: "#FF0000"}}, "transparent");
        });
    });

    describe('userFromId', function () {
        it('should find the userId specified', function () {
            spyOn(Meteor.users, 'findOne');
            UserHelpers.userFromId("foo");
            expect(Meteor.users.findOne).toHaveBeenCalledWith({_id: "foo"});
        });
    });
    describe('otherUserId', function () {
        it('should remove current user from list', function () {
            spyOn(Meteor, 'userId').and.returnValue('myId');
            expect(UserHelpers.otherUserId(['foo', 'myId'])).toBe('foo');
        });

        it('should return a default value', function () {
            spyOn(Meteor, 'userId').and.returnValue('myId');
            expect(UserHelpers.otherUserId(['myId'])).toBe('');
        });
    });
});
