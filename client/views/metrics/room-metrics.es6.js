Template.roomMetrics.onCreated(function() {
    const self = this;
    Deps.autorun(() => {
        const currentRoomUser = Meteor.users.findOne({_id: Meteor.userId()}, {"status.currentRoom": 1});
        Session.set('currentRoom', currentRoomUser.status.currentRoom);
    });
    Deps.autorun(() => {
        const roomId = self.data.roomId === "current" ? Session.get('currentRoom') : self.data.roomId;
        const room = Rooms.findOne({_id: roomId});
        let chartData = [];
        if (!room) { throw new Meteor.Error("Need room"); }
        _(room.users).each(userId => {
            const user = Meteor.users.findOne({_id: userId}, {fields: {"username": 1, "profile.color": 1}});
            Meteor.call('roomPunchcard', {userId: userId, roomId: roomId}, (err, data) => {
                if (err) {throw err; }

                let seriesData = [];
                for (let i = 0; i < 96; i++) {
                    seriesData[i] = 0;
                }
                for (let i = 0; i < data.length; i++) {
                    const result = data[i];
                    seriesData[result._id] = result.count;
                }

                const series = {name: user.username, data: seriesData};
                if (user.profile && user.profile.color) {
                    series.color = user.profile.color;
                }
                chartData.push(series);
            });
        });
        const chartInterval = Meteor.setInterval(() => {
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
});
