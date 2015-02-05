var imageStore;
if(Meteor.isServer) {
    imageStore = new FS.Store.S3("nullchat", {
        accessKeyId: Meteor.settings.S3accessKeyId,
        secretAccessKey: Meteor.settings.S3secretAccessKey,
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