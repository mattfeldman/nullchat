Meteor.startup(function () {
    // Windows Path Voodoo from https://github.com/tomitrescak/meteor-uploads/issues/49
    // const uploadDir = process.env.PWD ? process.env.PWD + '/uploads/' : "..\\..\\..\\..\\..\\uploads\\";
    if (Meteor.settings.upload) {
        UploadServer.init({
            tmpDir: Meteor.settings.upload.directory + 'tmp',
            uploadDir: Meteor.settings.upload.directory,
            checkCreateDirectories: true, // create the directories
            maxFileSize: 250 * 1000 * 1000, // 250mb
            maxPostSize: 250 * 1000 * 1000 // 250mb
        });
    }
});
