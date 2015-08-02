var imageStore;
if (Meteor.isServer) {
    var s3Key = Meteor.settings.S3 && Meteor.settings.S3.appId || "appKey";
    var s3Secret = Meteor.settings.S3 && Meteor.settings.S3.appSecret || "appSecret";
    imageStore = new FS.Store.S3("nullchat", {
        accessKeyId: s3Key,
        secretAccessKey: s3Secret,
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
    insert: function (userId, doc) {
        return userId;
    },
    update: function (userId, doc, fields, modifier) {
        return userId;
    },
    remove: function (userId, doc) {
        return userId;
    },
    download: function (userId, doc) {
        return userId;
    }
});