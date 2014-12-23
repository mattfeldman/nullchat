Memes = new Meteor.Collection("memes"); // jshint ignore:line

// Populate memes
if (Meteor.isServer) {
    var response = Meteor.http.get("https://api.imgflip.com/get_memes");
    if(response && response.statusCode === 200)
    {
        var data = JSON.parse(response.content);
        _(data.data.memes).each(function(meme){
            // Note: id here is the foreign meme id, not _id the document id
            Memes.upsert({id:meme.id},meme);
        });
    }
}