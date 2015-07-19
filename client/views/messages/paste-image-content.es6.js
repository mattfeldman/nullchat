Template.pasteImageContent.events({
    'click .upload': _.once((e, t) => {
        const dataURI = this.pasteImageUrl;
        // Below taken from http://stackoverflow.com/questions/6850276/how-to-convert-dataurl-to-file-object-in-javascript

        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        const byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to an ArrayBuffer
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        const blob = new Blob([ab], {type: mimeString});

        const file = new FS.File(blob);
        file.name("nullchat.png");

        Images.insert(file, function(err, fileObj) {
            const fileKey = `https://s3-us-west-2.amazonaws.com/nullchat/${fileObj.collectionName}/${fileObj._id}-${fileObj.name()}`;
            const messageStub = {
                message: fileKey,
                roomId: Session.get('currentRoom')
            };

            Meteor.call('message', messageStub);
            Client.scrollChatToBottom();
        });
    }),
});
