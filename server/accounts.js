if(Meteor.settings.githubLogin) {
    ServiceConfiguration.configurations.remove({
        service : 'github'
    });
    ServiceConfiguration.configurations.insert({
        service: 'github',
        clientId: Meteor.settings.githubLogin.clientId,
        secret: Meteor.settings.githubLogin.secret
    });
}

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