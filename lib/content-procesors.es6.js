runContentProcessors = function (messageStub) {
    for (let i = 0; i < contentProcessors.length; i++) {
        const processor = contentProcessors[i];
        const match = processor.regex.exec(messageStub.message);
        if (match) {
            if (!processor.validMatch || processor.validMatch(match)) {
                const returnval = processor.execute(match);
                return returnval;
            }
        }
    }
};
const contentProcessors = [
    {
        name: "Image Processor",
        regex: /https?:\/\/(?:[a-zA-Z0-9\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpg|jpeg|gif|png)/, // From http://stackoverflow.com/questions/169625/regex-to-check-if-valid-url-that-ends-in-jpg-png-or-gif
        execute(regexMatch) {
            console.log(regexMatch);
            return {
                layout: "image",
                data: regexMatch[0]
            };
        },
    },
    {
        name: "YouTube Processor",
        regex: /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/i,
        validMatch(regexMatch) {
            return regexMatch.length >= 2 && regexMatch[1];
        },
        execute(regexMatch) {
            return {
                layout: "youtube",
                data: regexMatch[1]
            };
        }
    },
    {
        name: "Noembed",
        regex: /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
        execute(regexMatch) {
            const response = Meteor.http.get("http://noembed.com/embed", {
                params: {url: regexMatch[0]},
                timeout: 30000
            });
            if (response.statusCode === 200 && !response.data.error) {
                return {
                    layout: "noembed",
                    data: response.data
                };
            }
            else {
                return false;
            }
        }
    }
];
