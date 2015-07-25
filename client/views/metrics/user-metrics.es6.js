Template.userMetrics.onCreated(function() {
    const self = this;
    Deps.autorun(() => {
        const userId = self.data.userId === "current" ? Meteor.userId() : self.data.userId;
        Meteor.call('punchcard', userId, (err, results) => {
            if (err) { throw new Meteor.Error(err); }

            let chartData = [];
            for (let i = 0; i < 288; i++) {
                chartData[i] = 0;
            }
            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                chartData[result._id] = result.count;
            }

            const user = Meteor.users.findOne({_id: userId}, {fields: {"username": 1, "profile.color": 1}});
            $("#userMetricsChart").highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'spline'
                },
                title: {
                    text: user.username + " Message Time"
                },
                series: [{name: 'Messages', data: chartData}]
            });
        });
    });
});