Memes = new Meteor.Collection("memes"); // jshint ignore:line

// Populate memes
if (Meteor.isServer) {
    const response = Meteor.http.get("https://api.imgflip.com/get_memes");
    if (response && response.statusCode === 200) {
        const data = JSON.parse(response.content);
        _(data.data.memes).each((meme) => {
            meme.searchName = meme.name.split(' ').join('');
            // Note: id here is the foreign meme id, not _id the document id
            Memes.upsert({id: meme.id}, meme);
        });
    }
}
Meteor.methods({
    createMeme(memeStub) {
        if (!Meteor.settings.imgFlip) {
            throw new Meteor.Error("ImgFlip credentials not set to create meme.");
        }

        const response = Meteor.http.post("https://api.imgflip.com/caption_image", {
            params: {
                template_id: memeStub.id,
                username: Meteor.settings.imgFlip.username,
                password: Meteor.settings.imgFlip.password,
                text0: memeStub.topLine,
                text1: memeStub.bottomLine
            }
        });

        if (!response || response.statusCode !== 200) {
            throw new Meteor.Error("Error creating meme.");
        }
        const responseContent = JSON.parse(response.content);
        if (!responseContent.success) {
            throw new Meteor.Error("Error creating meme.");
        }
        return responseContent.data.url;
    }
});
