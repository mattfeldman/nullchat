Template.pasteImageModal.events({
    'click .anti-modal-button-cancel, click .anti-modal-closer': function(e, t) {
        AntiModals.dismissOverlay(e.target, null, null);
    },
    'click .anti-modal-button-action': function(e, t) {
        var dataURI = this.pasteImageUrl;
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        var blob = new Blob([ab], {type: mimeString});

        var file = new FS.File(blob);
        file.name("test.png");

        Images.insert(file, function(err, fileObj) {
            // Super ugly hack. This callback files when the image has been inserted.
            // However, it appears the image is not always available quite yet on AWS.
            // This causes the error image to be shown, and the only way to get the full image is to refresh the page
            // Pause a couple seconds to allow AWS to make the image link available.
            // Not sure what the correct solution is here. The code is already in the only callback we have available.
            setTimeout(function() {
                var fileKey = "https://s3-us-west-2.amazonaws.com/nullchat/" + fileObj.collectionName + '/' + fileObj._id + '-' + fileObj.name();
                var messageStub = {
                    message: fileKey,
                    roomId: Session.get('currentRoom')
                };

                Meteor.call('message', messageStub);
                scrollChatToBottom(); //TODO: This looks like an ugly hack
            }, 2000);
        });
        AntiModals.dismissOverlay(e.target, null, null);
    },
});