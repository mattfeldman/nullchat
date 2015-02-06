Template.imageMessage.events({
    "error .image-message-image": function (event, template) {

        var timesRetried = 0;
        var currentSource = event.currentTarget.src;
        var lastPoundIndex = currentSource.lastIndexOf("#");

        if(lastPoundIndex > 0) {
            var countString = currentSource.substr(lastPoundIndex + 1);
            var count = parseInt(countString);

            if(!isNaN(count)) {
                timesRetried = count;
            }
        }

        if(timesRetried < 20) {
            timesRetried++;
            Meteor.setTimeout(function() {
                // We store the number of retries in the # after the url
                // This tricks the browser into reloading the image, but without changing the image received
                // It also gives us a handy way to track the number of attempts, so we don't retry forever
                event.currentTarget.src = template.data + "#" + timesRetried;
            }, 500);
        }

    }
});