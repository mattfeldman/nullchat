Router.configure({
    layoutTemplate: 'layout',
    //loadingTemplate: 'loading',
    waitOn: function () {
        return [Meteor.subscribe('users')];
    }
});
Router.map(function () {
    this.route('roomView', {
        name: 'roomView',
        path: '/room/:_id',
        subscriptions: function () {
            Session.set('messageLimit', 10);
            return [
                Meteor.subscribe('availableRooms'),
                Meteor.subscribe('currentRooms'),
                Meteor.subscribe('notifications'),
                Meteor.subscribe('emojis'),
            ];
        },
        action: function () {
            Session.set('currentRoom', this.params._id);
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
            this.go('chat');
        }
    });

    this.route('chat', {
        path: '/',
        subscriptions: function () {
            Session.set('messageLimit', 10);
            return [
                Meteor.subscribe('availableRooms'),
                Meteor.subscribe('currentRooms'),
                Meteor.subscribe('notifications'),
                Meteor.subscribe('emojis'),
                Meteor.subscribe('memes')
            ];
        },
        action: function () {
            var currentRoom = Meteor.user().status.currentRoom;
            if (!currentRoom) {
                currentRoom = Rooms.findOne({name: "welcome"})._id;
                Meteor.call('joinRoom', currentRoom);
            }
            Session.set('currentRoom', currentRoom);
            this.render('roomView');
        }
    });

    this.route('user', {
        path: 'user',
        data:function(){
            if(this.ready())
            {
                return Meteor.user().profile;
            }
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