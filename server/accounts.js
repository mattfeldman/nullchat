ServiceConfiguration.configurations.remove({
    service : 'github'
});

// TODO: Flagged for secret in source
ServiceConfiguration.configurations.insert({
    service : 'github',
    clientId: '81a5fecb4a53f7266e46',
    secret  : '37ef5469e216803de55933d389661d2a288708bf'
});

Accounts.onCreateUser(function(options, user) {
    if (options.profile) {
        user.profile = options.profile;
    }

    if(user.services && user.services.github)
    {
        var result = Meteor.http.get('https://api.github.com/user',{
            params : {
                access_token : user.services.github.accessToken
            },
            headers: {"User-Agent": "Meteor/1.0"}
        });

        if(!result.error)
        {
            user.profile.avatar = result.data.avatar_url;
        }
        user.username = user.services.github.username;
    }

    return user;
});