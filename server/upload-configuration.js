Meteor.startup(function () {
    // Windows Path Voodoo from https://github.com/tomitrescak/meteor-uploads/issues/49
    var uploadDir = process.env.PWD ? process.env.PWD + '/uploads/' : "..\\..\\..\\..\\..\\uploads\\";
    UploadServer.init({
        tmpDir: uploadDir + 'tmp',
        uploadDir: uploadDir,
        checkCreateDirectories: true, //create the directories for you,
        maxFileSize: 250 * 1000 * 1000, // 250mb
        maxPostSize: 250 * 1000 * 1000, // 250mb
    });
});