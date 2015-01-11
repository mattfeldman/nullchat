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
        data: function () {
            if (this.ready()) {
                return Meteor.user().profile;
            }
        }
    });

    this.route('messageContext', {
        name: 'messageContext',
        path: 'message/:messageId',
        subscriptions: function () {
            return [
                Meteor.subscribe('availableRooms'),
                Meteor.subscribe('currentRooms'),
                Meteor.subscribe('notifications'),
                Meteor.subscribe('emojis'),
                Meteor.subscribe('memes')
            ];
        },
        data: function () {
            return {messageId: this.params.messageId};
        }
    });

    this.route('messageSms', {
        name: 'messageSms',
        where: "server",
        path: 'messageSms',
        action: function () {
            console.log(this.request.headers['x-twilio-signature']);
            if (this.request.body) {
                var fromNumber = this.request.body.From;
                if (fromNumber) {
                    var user = Meteor.users.findOne({"profile.number": fromNumber});
                    if (user) {
                        var message = this.request.body.Body;
                        var roomMatch = /#([\w]+)/.exec(message);
                        if(roomMatch && roomMatch[1]) {
                            var roomName = roomMatch[1];
                            var room = Rooms.findOne({name: roomName});
                            if (room) {
                                console.log("From " + fromNumber + " : " + message + " for " + room.name);
                                insertMessage(user,room,{message:message,roomId:room._id},{fromMobile:true});
                            }
                            else {
                                console.log("From " + fromNumber + " : " + message + " can't find room: "+ roomName);
                            }
                        }
                        else {
                            console.log("From " + fromNumber + " : " + message + " no room listed.");
                        }
                    }
                    else {
                        console.log("No user registered with " + fromNumber);
                    }
                }
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
}, {except: ['messageSms']});