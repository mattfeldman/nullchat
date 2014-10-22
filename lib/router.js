Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function () {
        return [Meteor.subscribe('messages'),Meteor.subscribe('users')];
    }
});
Router.map(function () {
    this.route('roomList', {
        path: '/',
        waitOn: function(){
            return Meteor.subscribe('availableRooms');
        },
        data: function () {
            return Rooms.find()
        }
    });
    this.route('roomView', {
        path: '/room/:_id',
        waitOn: function(){
            return Meteor.subscribe('availableRooms');
        },
        data: function () {
            Session.set('currentRoom',this.params._id);
            return {messages: Messages.find({roomId: this.params._id})};
        }
    });
});
Router.onBeforeAction('loading');