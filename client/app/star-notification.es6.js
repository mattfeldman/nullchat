Meteor.startup(function(){
    const permission = notify.permissionLevel();
    if (permission === notify.PERMISSION_DEFAULT) {
        notify.requestPermission();
    }
    notify.config({pageVisibility: false, autoClose: 5000});

    Deps.autorun(function() {
        let userId = Meteor.userId();
        if(!userId){ return; }
        Messages.find({authorId: userId}).observe({
            changed(newDoc, oldDoc) {
                if (newDoc.likedBy.length - oldDoc.likedBy.length === 1) {
                    const likedBy = _.difference(newDoc.likedBy, oldDoc.likedBy)[0];
                    if (likedBy === userId) {
                        return;
                    }
                    if (notify && permission === notify.PERMISSION_GRANTED) {
                        const user = Meteor.users.findOne({_id: likedBy}, {fields: {"profile.avatar": 1, "username": 1}});

                        if (!user) {
                            return;
                        }
                        const avatar = user.profile && user.profile.avatar || '/images/logo64.png';
                        const title = user.username + " gave you a star.";
                        const body = `For "${newDoc.message}"`;
                        notify.createNotification(title, {body: body, icon: avatar, tag: newDoc._id});
                    }
                }
            }
        });
    });
});
