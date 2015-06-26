describe('UserHelpers', function () {
    describe('usernameForUserId', function () {
        it('should retrive users name', function () {
            var mock = spyOn(Meteor.users, 'findOne');
            mock.and.returnValue({username: "foo"});
            expect(UserHelpers.usernameForUserId()).toBe("foo");
        });
        it('should return a default value', function () {
            var mock = spyOn(Meteor.users, 'findOne');
            mock.and.returnValue({});
            expect(UserHelpers.usernameForUserId()).toBe("[not found]");
        });
    });

    describe('avatarForUserId', function () {
        it('should retrive users avatar', function () {
            var mock = spyOn(Meteor.users, 'findOne');
            mock.and.returnValue({profile: {avatar: "some-avatar"}});
            expect(UserHelpers.avatarForUserId()).toBe("some-avatar");
        });
        it('should return a default value with no profile', function () {
            var mock = spyOn(Meteor.users, 'findOne');
            mock.and.returnValue({});
            expect(UserHelpers.avatarForUserId()).toBe("/images/logo128.png");
        });
        it('should return a default value with no avatar in profile', function () {
            var mock = spyOn(Meteor.users, 'findOne');
            mock.and.returnValue({profile:{other:"stuff"}});
            expect(UserHelpers.avatarForUserId()).toBe("/images/logo128.png");
        });
    });

    describe('colorForUserId', function () {
        it('should retrive users avatar', function () {
            var mock = spyOn(Meteor.users, 'findOne');
            mock.and.returnValue({profile: {color: "#FF0000"}});
            expect(UserHelpers.colorForUserId()).toBe("#FF0000");
        });
        it('should return a default value with no profile', function () {
            var mock = spyOn(Meteor.users, 'findOne');
            mock.and.returnValue({});
            expect(UserHelpers.colorForUserId()).toBe("transparent");
        });
        it('should return a default value with no color in profile', function () {
            var mock = spyOn(Meteor.users, 'findOne');
            mock.and.returnValue({profile:{other:"stuff"}});
            expect(UserHelpers.colorForUserId()).toBe("transparent");
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
            spyOn(Meteor,'userId').and.returnValue('myId');
            expect(UserHelpers.otherUserId(['foo','myId'])).toBe('foo');
        });

        it('should return a default value', function () {
            spyOn(Meteor,'userId').and.returnValue('myId');
            expect(UserHelpers.otherUserId(['myId'])).toBe('');
        });
    });
});