function roomLinks(message){
    if(!message) return;
    var loc = message.indexOf("#");
    var rooms = Rooms.find({}).fetch();
    for(var i =0; i < rooms.length; i++){
        var roomName = rooms[i].name;
        if(message.indexOf(rooms[i].name,loc) > 0){
            var leftHalf = message.substring(0,loc);
            var middle = '<a href="#" class="roomLink" data-roomId="'+rooms[i]._id+'">#'+roomName+'</a>';
            var rightHalf = message.substring(loc+roomName.length+1,message.length+middle.length);
            message = leftHalf + middle + rightHalf;
            console.log(message);
        }
    }
    return message;
}
Template.message.created = function () {

};
Template.message.helpers({
    myMessage: function () {
        return this.authorId === Meteor.userId() ? "my-message" : ""; // TODO: Be better
    },
    user: function () {
        return Meteor.users.findOne({_id: this.authorId});
    },
    color: function () {
        var user = Meteor.users.findOne({_id: this.authorId});
        if (user && user.profile && user.profile.color) {
            return "border-left: 3px solid" + user.profile.color;
        }
        else {
            return "border-left: 3px solid transparent";
        }
    },
    showTimestamp: function () {
        var d = new Date(this.timestamp);
        return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    },
    isPlain: function () {
        return this.type === "plain";
    },
    isImage: function () {
        return this.type === "rich" && this.layout === "image";
    },
    isFeedback: function () {
        return this.type === "feedback";
    },
    finalMessageBody: function(){
        return emojify.replace(roomLinks(this.message));
    },
    emojifiedMessage: function(){
    }
});
Template.message.events({
    "click .likeMessageLink":function(event,template){
        console.log(template);
        Meteor.call('likeMessage',template.data._id);
    },
    "click .roomLink":function(event,template){
        var roomId = $(event.target).data("roomid");
        setCurrentRoom(roomId);
    }
});
