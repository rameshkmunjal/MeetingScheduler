const mongoose=require('mongoose'); //to use instance - to interact with DB
const socketio=require('socket.io');//to user instance - to emit and handle events

const events = require('events');//to use events object - to do mongo operations
const eventEmitter= new events.EventEmitter();

const shortId=require('shortid');//to generate random id
//including library files 
const tokenLib=require('./tokenLib');
const check=require('./checkLib');
const emailLib=require('./emailLib');

const redisLib=require('./redisLib');

//include model files
require('./../models/meeting');
const MeetingModel=mongoose.model('meeting');
require('./../models/user');
const UserModel=mongoose.model('User');
require('./../models/invitation');
const InvitationModel=mongoose.model('Invitation');



let setServer=(server)=>{    
    let io= socketio.listen(server);
    let myIo=io.of('/');

    myIo.on('connection', (socket)=>{        
        socket.emit('verify-user', "ram-ram");
        console.log("*******socket at  server side set up*********");        

        socket.on('set-user', (authToken)=>{
            console.log("set-user event is being handled");            
            
            tokenLib.verifyClaimWithoutSecret(authToken, (err, user)=>{
                if(err){
                    console.log(err);
                    console.log("Please provide correct authToken");
                } else {  
                    console.log("user is verified..setting details");
                    let currentUser = user.data;                            
                    socket.userId = currentUser.userId
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`
                    
                    let key = currentUser.userId;
                    let value = fullName;

                   redisLib.setANewOnlineUserInHash("onlineUsers", key, value, (err, result) => {
                        if (err) {
                            console.log(`some error occurred`)
                        } else {
                            console.log(result);
                            // getting online users list.
                            redisLib.getAllUsersInAHash('onlineUsers', (err, result) => {
                                console.log(`--- inside getAllUsersInAHas function ---`)
                                if (err) {
                                    console.log(err)
                                } else {
                                        // setting room name
                                        socket.room = 'meeting'
                                        // joining meeting info room.
                                        socket.join(socket.room)
                                        socket.to(socket.room).broadcast.emit('online-user-list', result);
                                    }
                                }) //redisLib function ended                               
                            }//else ended
            })//setUserOnline callback ended            
        }//else ended
    })//tokenLib callback ended
})//'set-user' event callback ended
    
        
        //event handler - when even create-meeting is emitted
        socket.on('create-meeting', (data)=>{
            console.log("data to create new meeting received " + data);
            data.eventType="new";
            data.meetingId=shortId.generate();
            data.result="";
            let mtgData=createMeeting(data, function(msgData){
                console.log("Inside create meeting cb :: data result is: " + msgData);
                data.notice="New Meeting";
                myIo.emit('get-new-meeting-message', msgData);
                eventEmitter.emit('send-email', data);
                eventEmitter.emit('add-invitees', data);
            });
            
            console.log("data result is :" + mtgData);          
             
        })

        socket.on('edit-meeting', (data)=>{
            // console.log("data to edit a  meeting received " + data);
            data.notice="Change In Meeting Details";
            data.eventType="edit";
            eventEmitter.emit('edit-a-meeting', data);           
            //to send data - by emitting event - send-email
            eventEmitter.emit('send-email', data);
            //To send message 
            myIo.emit('get-new-meeting-message', data);                       
        }) 
 
//-----------------------------------------------------------------------------------------------
        socket.on('send-invitation', (data)=>{
            let msg=sendInvitation(data, function(inviteDataCB){                
                console.log(inviteDataCB);
                console.log(msg);
            })
        })
        socket.on('cancel-invitation', (data)=>{             
            let msg=cancelInvitation(data, function(delData){
                console.log("Inside delete cb :: data result is: " + delData);
                console.log(msg);
                
            });
       })
        
        socket.on('get-meeting-alerts', (mtg)=>{               
            myIo.emit('show-alert-b4-one-minute', mtg);                                      
        })
        
        //when disconnect happens
        socket.on('disconnect', ()=>{
            console.log("socket connection disconnected");
            
            if (socket.userId) {
                redisLib.deleteUserFromHash('onlineUsers', socket.userId)
                redisLib.getAllUsersInAHash('onlineUsers', (err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.leave(socket.room)
                        socket.to(socket.room).broadcast.emit('online-user-list', result);
                    }
                })
            }
        })
        
    });
}
//------------------------------------------mongoose section ----------------------------------------------
//event handler - create meeting
let createMeeting=(data, meetingCompleteCB) =>{    
    //creating meeting object - using meetingModel
    let newMeeting= new MeetingModel({
        meetingId : data.meetingId,
        meetingName : data.meetingName,
        mtgStartDate : data.mtgStartDate,
        startTime : data.startTime, 
        mtgEndDate:data.mtgEndDate,       
        endTime:data.endTime,
        convenor:data.convenor,
        convenorMobile:data.convenorMobile,
        meetingVenue : data.meetingVenue        
    })
    
    //saving record using mongoose method - save
    newMeeting.save((err, result)=>{
        if(err){
            console.log(err);            
        } else {
            let tempResult=result; 
            data.meetingId = result.meetingId;
            tempResult.invitees=data.viewerList; 
            console.log("tempResult : "+ JSON.stringify(tempResult) + JSON.stringify(data));          
            meetingCompleteCB(tempResult);
            return tempResult;
        }
    })//new meeting saved                    
}

//---------------------------------------Invitation-----------------------------------------------------
let sendInvitation=(data, inviteDataCB)=>{     
        let invitation= new InvitationModel({
            id:shortId.generate(),
            sentOn:Date.now(),
            mtgId:data.mtgId,
            userId:data.userId
        })
    
        invitation.save((err, invite)=>{
            if(err){
                console.log(err);
            } else{
                console.log("Here is new Invite");
                inviteDataCB(invite);
            }
        })    
}//cancel invitation ended
//-------------------------------------------------------------------
//event handler - edit meeting
let cancelInvitation=(data, deleteCompletedCB)=>{    
    InvitationModel.deleteOne({mtgId:data.mtgId, userId:data.userId})
        .exec((err, result)=>{
            if(err){//while query is failed
                console.log(err);                               
            } else if(check.isEmpty(result)){//while query found no data
                console.log("No Data found");                
            } else { //while query is successful 
                console.log("Invitation cancelled successfully");
                deleteCompletedCB(result);
                return result;               
            }
        })
}//cancel invitation ended

//---------------------------------------Edit Meeting -----------------------------------------------------
//event handler - edit meeting
eventEmitter.on('edit-a-meeting', (data)=>{
    //creating meeting object - using meetingModel and mongoose method update
    let options=data;
    MeetingModel.update({meetingId:data.meetingId}, options, {multi:true})
        .exec((err, editData)=>{
            if(err){//while query is failed
                console.log(err);                               
            } else if(check.isEmpty(editData)){//while query found no data
                console.log("No Data found");                
            } else { //while query is successful 
                console.log("Meeting Data edited successfully");               
            }
        })
})//even edit a meeting ended
//---------------------------------------Add Invitees -----------------------------------------------------
//event handler - add invitees
eventEmitter.on('add-invitees', (data)=>{
    //creating MongoDB record - using InvitationModel , UserModel and mongoose
    let mtgId=data.meetingId;
    let allInvitees=data.viewerList;
    
    for(let user of allInvitees){
        console.log("create meeting email sent to "+user.firstName);
        sendInvitationToAllViewers(user.userId);
    }            

    function sendInvitationToAllViewers(userId){
        let invitation= new InvitationModel({
            id:shortId.generate(),
            sentOn:Date.now(),
            mtgId:mtgId,
            userId:userId
        })

        invitation.save((err, invite)=>{
            if(err){
                console.log(err);
            } else{
                console.log("Here is new Invite");
                console.log(invite);
            }
        })
    }
    
})//event add-invitees ended

//--------------------------------sendEmail started------------------------------------------------
eventEmitter.on('send-email', (data)=>{
    console.log("inside send-email line 258");
    console.log(data);
    //get all users email address and send email
    let allInvitees=data.viewerList;
    
    for(let i=0; i < allInvitees.length; i++){
        let user=allInvitees[i];
        emailLib.sendMeetingInfo(data, user ) ;
    }//for loop ended                           
            
})//event send mail ended
//--------------------------------sendEmail ended-------------------------------------------
module.exports={
    setServer:setServer
}

