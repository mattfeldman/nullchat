Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn() {
        return [Meteor.subscribe('users'), Meteor.subscribe('myPreferences')];
    }
});
Router.map(function () {
    this.route('/room/:_id', {
        subscriptions() {
            return [Meteor.subscribe('availableRooms'), Meteor.subscribe('currentRooms')];
        },
        onBeforeAction() {
            const room = Rooms.findOne({_id: this.params._id});
            if (!room) {
                Router.go('roomList');
            }
            Meteor.call('setCurrentRoom', this.params._id);
            this.next();
        },
        action() {
            Router.go('chat');
        }
    });
    this.route('userMetrics', {
        path: '/user/:userId/metrics',
        data() {
            return {userId: this.params.userId};
        },
        action() {
            this.render('userMetrics');
        }
    });
    this.route('roomMetrics', {
        path: '/room/:roomId/metrics',
        subscriptions() {
            return [Meteor.subscribe('availableRooms'), Meteor.subscribe('currentRooms')];
        },
        data() {
            return {roomId: this.params.roomId};
        },
        action() {
            this.render('roomMetrics');
        }
    });
    this.route('chat', {
        path: '/',
        subscriptions() {
            return [
                Meteor.subscribe('availableRooms'),
                Meteor.subscribe('currentRooms'),
                Meteor.subscribe('emojis'),
                Meteor.subscribe('memes')
            ];
        },
        action() {
            let currentRoom = Meteor.user().status.currentRoom;
            if (!currentRoom) {
                currentRoom = Rooms.findOne({name: "welcome"})._id;
                Meteor.call('joinRoom', currentRoom);
            }
            Session.set('currentRoom', currentRoom);
            this.render('roomView');
        }
    });
    this.route('messageSms', {
        name: 'messageSms',
        where: "server",
        path: 'messageSms',
        action() {
            const token = Meteor.settings.twilio.appSecret;
            const header = this.request.headers['x-twilio-signature'];
            const url = Meteor.absoluteUrl("messageSms", {secure: true});
            const params = this.request.body;
            const twilio = Meteor.npmRequire('twilio');
            if (this.request.body && twilio.validateRequest(token, header, url, params)) {
                const fromNumber = this.request.body.From;
                if (fromNumber) {
                    const user = Meteor.users.findOne({"profile.number": fromNumber});
                    if (user) {
                        const message = this.request.body.Body;
                        const roomMatch = /#([\w]+)/.exec(message);
                        if (roomMatch && roomMatch[1]) {
                            const roomName = roomMatch[1];
                            const room = Rooms.findOne({name: roomName});
                            if (room) {
                                console.log("From " + fromNumber + " : " + message + " for " + room.name);
                                insertMessage(user, room, {message: message, roomId: room._id}, {fromMobile: true});
                            }
                            else {
                                console.log("From " + fromNumber + " : " + message + " can't find room: " + roomName);
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

Router.plugin('ensureSignedIn', {except: ['messageSms']});
