Template.userMetrics.created = function () {
    var self = this;
    Deps.autorun(function(){
        var userId = self.data.userId === "current" ? Meteor.userId() : self.data.userId;
        Meteor.call('punchcard', userId, function (err, results) {
            if (err) { throw new Meteor.Error(err);}

            var chartData = [];
            for (var i = 0; i < 288; i++) {
                chartData[i] = 0;
            }
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                chartData[result._id] = result.count;
            }

            var user = Meteor.users.findOne({_id: userId}, {fields: {"username": 1, "profile.color": 1}});
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
};