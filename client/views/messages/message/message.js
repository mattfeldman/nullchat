Template.message.helpers({
    'messageTemplate': function () {
        if (this.type === "plain") {
            return "plainMessage";
        }
        else if (this.type === "feedback") {
            return "feedbackMessage";
        }
        else if (this.type === "rich") {
            return "richMessage";
        }
    }
});

Template.message.onRendered(function() {
    var img = this.find("a.avatar img");
    $(img).on("load", function(){
        freezeGif(img);
    });
});