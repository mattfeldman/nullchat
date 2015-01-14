Template.uploadMessage.helpers({
    'uploadedImage': function() {
        var image = Images.findOne(this.toString());
        console.log(image);
        return image;
    }
})