Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function() { return Meteor.subscribe('messages'); }
});
Router.map(function() { this.route('roomView', {path: '/'});
});
Router.onBeforeAction('loading');