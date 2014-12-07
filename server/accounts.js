var identicon = Meteor.npmRequire('identicon');

Accounts.onCreateUser(function(options, user){
    var identiconUrl =process.env.PWD+user.username+'.png';
    // Asynchronous API (base_string, size, callback)
    identicon.generate(user.username, 150,  Meteor.bindEnvironment(function(err, buffer) {
        if (err) throw err;
        var newFile = new FS.File();
        newFile.attachData(buffer,{type:'image/png'},function(error){
            if(error) throw error;
            newFile.name(user.username+'.png');
            Images.insert(newFile,function(err,fileObj){
                Meteor.setTimeout(function(){
                    //console.log('URL:'+Images.findOne({_id:fileObj._id}).url());
                    Meteor.users.update({username:user.username},{$set:{'profile.avatar':'/cfs/files/images/'+fileObj._id+'/'+user.username+'.png'}});
                },1000); //TODO: properly do this
            });
        });
    }));

    // We still want the default hook's 'profile' behavior.
    if (options.profile)
        user.profile = options.profile;
    if(!user.profile) user.profile = {};
    user.profile.avatar = identiconUrl;
    return user;
});