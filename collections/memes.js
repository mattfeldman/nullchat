Memes = new Meteor.Collection("memes"); // jshint ignore:line

// Populate memes
if (Meteor.isServer) {
    var response = Meteor.http.get("https://api.imgflip.com/get_memes");
    if(response && response.statusCode === 200)
    {
        var data = JSON.parse(response.content);
        _(data.data.memes).each(function(meme){
            meme.searchName = meme.name.split(' ').join('');
            // Note: id here is the foreign meme id, not _id the document id
            Memes.upsert({id:meme.id},meme);
        });
    }
}
Meteor.methods({
    'createMeme':function(memeStub){
        var response = Meteor.http.post("https://api.imgflip.com/caption_image", {
            params: {
                template_id:memeStub.id,
                username: "decaprime",
                password: "9pSajDXjYTLh",
                text0: memeStub.topLine,
                text1: memeStub.bottomLine
            }
        });

        if (!response || response.statusCode !== 200) {
            throw new Meteor.Error("Error creating meme.");
        }
        var responseContent = JSON.parse(response.content);
        if (!responseContent.success) {
            throw new Meteor.Error("Error creating meme.");
        }
        return responseContent.data.url;

    }
})