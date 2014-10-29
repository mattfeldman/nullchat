Template.userElement.helpers({
    statusColor: function(){
        var status = this.status;
        if(!status){
            return "black";
        }
        else if(status.idle){ // ordering is important as online can be true at the same time
            return "orange";
        }
        else if(status.online){
            return "green";
        }
        else{
            return "red";
        }

    }
});