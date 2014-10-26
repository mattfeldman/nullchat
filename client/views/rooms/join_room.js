Template.joinRoom.helpers({
    //TODO: AUtocomplete
    settings:function() {
        return {
            position: "top",
            limit: 5,
            rules: [
                {
                    collection:Rooms,
                    field: "name",
                    template: Template.roomPill
                }
            ],
            rooms:function(){
                return Rooms.find();
            }
        }
    }
});


Template.joinRoom.created = function(){
    console.log(Rooms.find().fetch());
};