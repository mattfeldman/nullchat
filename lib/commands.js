processCommand =function(messageStub){
    check(messageStub,{message:String,roomId:String});

    if(messageStub.message[0]='/') { messageStub.message = messageStub.message.substring(1);}

    args = messageStub.message.split((' '));

    switch(args[0]){
        case "create":
            // args[1] room name
            break;
        case "invite":
            //args[1] username
            break;
        case "lock":
            // args[1]? roomname
            break;
        case "unlock":
            // args[1]? roomname
            break;
    }
}
