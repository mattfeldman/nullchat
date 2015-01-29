imageStore = new FS.Store.S3("nullchat");

Images = new FS.Collection("images", {
    stores: [imageStore],
});

Images.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    },
    download: function() {
        return true;
    }
});