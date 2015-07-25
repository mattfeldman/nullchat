Template.roomMetrics.created = function () {
    var self = this;
    Deps.autorun(function () {
        var currentRoomUser = Meteor.users.findOne({_id: Meteor.userId()}, {"status.currentRoom": 1});
        Session.set('currentRoom', currentRoomUser.status.currentRoom);
    });
    Deps.autorun(function () {
        var roomId = self.data.roomId === "current" ? Session.get('currentRoom') : self.data.roomId;
        var room = Rooms.findOne({_id: roomId});
        var chartData = [];
        if (!room) {throw new Meteor.Error("Need room");}
        _(room.users).each(function (userId) {
            var user = Meteor.users.findOne({_id: userId}, {fields: {"username": 1, "profile.color": 1}});
            Meteor.call('roomPunchcard', {userId: userId, roomId: roomId}, function (err, data) {
                if (err) {throw err;}

                var seriesData = [];
                for (var i = 0; i < 96; i++) {
                    seriesData[i] = 0;
                }
                for (var i = 0; i < data.length; i++) {
                    var result = data[i];
                    seriesData[result._id] = result.count;
                }

                var series = {name: user.username, data: seriesData};
                if (user.profile && user.profile.color) {
                    series.color = user.profile.color;
                }
                chartData.push(series);
            });
        });
        var chartInterval = Meteor.setInterval(
            function () {
                if (chartData.length < room.users.length) {
                    return;
                }

                $("#roomMetricsChart").highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'spline'
                    },
                    title: {
                        text: "Message Time for #" + room.name
                    },
                    series: chartData
                });
                clearInterval(chartInterval);
            }, 100);
    });
}