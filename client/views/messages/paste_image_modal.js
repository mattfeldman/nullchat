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

        Images.insert(blob, function(err, fileObj) {
            var messageStub = {
                message: "upload://" + fileObj._id,
                roomId: Session.get('currentRoom')
            };
            console.log(fileObj);
            Meteor.call('message', messageStub);
            scrollChatToBottom(); //TODO: This looks like an ugly hack
        });
        AntiModals.dismissOverlay(e.target, null, null);
    },
});