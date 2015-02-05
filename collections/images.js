var imageStore;
if(Meteor.isServer) {
    imageStore = new FS.Store.S3("nullchat", {
        accessKeyId: Meteor.settings.accessKeyId,
        secretAccessKey: Meteor.settings.secretAccessKey,
        bucket: "nullchat",
        ACL: 'public-read'
    });
} else {
    imageStore = new FS.Store.S3("nullchat");
}

Images = new FS.Collection("images", {
    stores: [imageStore],
});

Images.allow({
    insert: function(userId, doc) {
        return userId;
    },
    update: function(userId, doc, fields, modifier) {
        return userId;
    },
    remove: function(userId, doc) {
        return userId;
    },
    download: function(userId, doc) {
        return userId;
    }
});