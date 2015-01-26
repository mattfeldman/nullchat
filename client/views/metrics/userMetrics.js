Template.userMetrics.created = function () {
    Meteor.call('punchcard', function (err, results) {
        if (err) { throw new Meteor.Error(err);}

        var chartData = [];
        for (var i = 0; i < 96; i++) {
            chartData[i] = 0;
        }
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            chartData[result._id] = result.count;
        }
        $("#userMetricsChart").highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'spline'
            },
            title: {
                text: "Message Time"
            },
            series: [{name: 'Messages', data: chartData}]
        });
    });
};