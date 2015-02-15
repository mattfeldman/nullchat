Template.pasteImage.events({
    'click .upload': function(e, t) {
        if(this.alreadyUploaded) {return;}
        this.alreadyUploaded = true;
        var dataURI = this.pasteImageUrl;
        // Below taken from http://stackoverflow.com/questions/6850276/how-to-convert-dataurl-to-file-object-in-javascript

        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        var blob = new Blob([ab], {type: mimeString});

        var file = new FS.File(blob);
        file.name("nullchat.png");

        Images.insert(file, function(err, fileObj) {
            var fileKey = "https://s3-us-west-2.amazonaws.com/nullchat/" + fileObj.collectionName + '/' + fileObj._id + '-' + fileObj.name();
            var messageStub = {
                message: fileKey,
                roomId: Session.get('currentRoom')
            };

            Meteor.call('message', messageStub);
            scrollChatToBottom(); //TODO: This looks like an ugly hack
        });
    },
});