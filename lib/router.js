Router.configure({
    layoutTemplate: 'layout',
    //loadingTemplate: 'loading',
    waitOn: function () {
        return [Meteor.subscribe('users')];
    }
});
Router.map(function () {
    this.route('roomList', {
        path: '/',
        waitOn: function () {
            return Meteor.subscribe('availableRooms');
        },
        data: function () {
            return Rooms.find();
        }
    });
    this.route('roomView', {
        name: 'roomView',
        path: '/room/:_id',
        subscriptions: function () {
            Session.set('messageLimit', 10);
            return [
                Meteor.subscribe('feedbackMessages', this.params._ids),
                Meteor.subscribe('availableRooms'),
                Meteor.subscribe('currentRooms'),
                Meteor.subscribe('notifications'),
                Meteor.subscribe('emojis'),
            ];
        },
        data: function () {
            Session.set('currentRoom', this.params._id);
            var returnObj = {
                messages: Messages.find({roomId: this.params._id}, {sort: {timestamp: 1}}),
                currentRooms: Rooms.find({users: Meteor.userId()}),
                availableRooms: Rooms.find()
            };
            return returnObj;
        },
        action: function () {
            console.log("test");
            var room = Rooms.findOne({_id: this.params._id});
            if (!room) {
                Router.go('roomList');
            }
            if (!_.contains(room.users, Meteor.userId())) {
                Meteor.call('joinRoom', room._id, function (err, id) {
                    if (err) {
                        Router.go('roomList');
                    }
                }); //TODO: on error goto fail
            }
            this.render('roomView');
        }

    });
});


Router.onBeforeAction(function (pause) {
    if (!Meteor.userId()) {
        return this.render('login');
    }
    else {
        this.next();
    }
});