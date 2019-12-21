//including npm packages
const express=require('express');
const shortid=require('shortid');
const mongoose=require('mongoose');
//including library files
const response=require('./../libs/responseLib');
const check=require('./../libs/checkLib');
const logger=require('./../libs/loggerLib');

//including model files and using models for db operations
//require('./../models/meeting');
const MeetingModel=mongoose.model('meeting');

//require('./../models/invitation');
const InvitationModel=mongoose.model('Invitation');

//require('./../models/user');
const UserModel=mongoose.model('User');

//------------------------------------GET APIs-----------------------------------------------
//-------------------------------------getAllMeetings-----------------------------------------
//function to get all meetings - from meetings table
let getAllMeetings=(req, res)=>{
    MeetingModel.find()
        .select('-_id-__v')
        .lean()
        .exec((err, result)=>{
            if(err){//when query is failed
                logger.error(err.message, 'Meeting Controller: getAllMeetings', 10);
                let apiResponse=response.generate(true, "Some error occured", 500, null);
                res.send(apiResponse);
            } else if(check.isEmpty(result)){//when query returns no data 
                logger.info('No Meeting Found', 'Meeting Controller: getAllMeetings');               
                let apiResponse=response.generate(true, "No such data found", 404, null);
                res.send(apiResponse); 
            } else{//when query is successful
                let apiResponse=response.generate(false, "Meeting Details created successfully", 200, result);
                res.send(apiResponse);
            }
        })
}//end of function

//--------------------------------------getSingleMeetingDetails-------------------------------------------
let getSingleMeetingDetails=(req, res)=>{
    //Access meetings table and get meetings details with matching id
    MeetingModel.findOne({'meetingId':req.params.meetingId})
            .exec((err, result)=>{
                if(err){
                    logger.error(err.message, 'Meeting Controller: getSingleMeetingDetails', 10);
                    let apiResponse=response.generate(true, "Some error occured", 500, null);
                    res.send(apiResponse); 
                } else if(check.isEmpty(result)){
                    logger.info('No Meeting Found', 'Meeting Controller: getSingleMeetingDetails');
                    let apiResponse=response.generate(true, "No such data found", 404, null);
                    res.send(apiResponse); 
                } else{
                    let apiResponse=response.generate(false, "Meeting Details fetched successfully", 200, result);
                    res.send(apiResponse); 
                }
            })
}
//-------------------------------------getAllInvitees----------------------------------------------------
let getAllInvitees=(req, res)=>{ 
    //Step-1: get all user id - matching a common meeting id (req param)
    let getInviteeIds=()=>{
        return new Promise((resolve, reject)=>{
            InvitationModel.find({'mtgId':req.params.mtgId}, (err, idArray)=>{
                if(err){ //when query is failed
                    logger.error(err.message, 'Meeting Controller: getAllInvitees::getInviteeIds', 10);
                    let apiResponse=response.generate(true, "Some error occured", 500, null);
                    reject(apiResponse); 
                } //when query returns no data
                else if(check.isEmpty(idArray)){
                    logger.info('No Meeting Found', 'Meeting Controller: getAllInvitees::getInviteeIds'); 
                    let apiResponse=response.generate(true, "No Data found", 404, null);
                    reject(apiResponse);   
                }else{//when query is successful                    
                    resolve(idArray)          
                }
            })        
        })
    } 
    //Step-2:We have useIds from invitation table- get all users details
    let getInviteeNames=(idArray)=>{
        return new Promise((resolve, reject)=>{
            UserModel.find()
                .exec((err, users)=>{
                    if(err){
                        logger.error(err.message, 'Meeting Controller: getAllInvitees::getInviteeNames', 10);
                        let apiResponse=response.generate(true, "Some error occured", 500, null);
                        reject(apiResponse); 
                    } else if(check.isEmpty(users)){
                        logger.info('No Meeting Found', 'Meeting Controller: getAllInvitees::getInviteeNames'); 
                        let apiResponse=response.generate(true, "No Data found", 404, null);
                        reject(apiResponse); 
                    } else {                        
                        let inviteeList=[];
                        for(invitee of idArray){
                            for(user of users){
                                if(user.userId===invitee.userId){
                                    let temp={
                                        userId:user.userId,
                                        fullName:user.firstName+" "+user.lastName,
                                        role:user.role,
                                        email:user.email,
                                        mobile:user.mobileNumber
                                    }
                                    inviteeList.push(temp);
                                }//if ended
                            }//user for loop ended
                        }//invitee for loop ended
                        
                        resolve(inviteeList);
                    }
                })
        })
    }
//send data or message - on success or failure
    getInviteeIds(req, res)
        .then(getInviteeNames)
        .then((resolve)=>{            
            let apiResponse=response.generate(false, "Invitees Data accessed successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })    
}
//-------------------------------------getAllNonInvitees----------------------------------------------------
let getAllNonInvitees=(req, res)=>{ 
    //Step-1: get all user id - matching a common meeting id (req param)
    let getInviteeIds=()=>{
        return new Promise((resolve, reject)=>{
            InvitationModel.find({'mtgId':req.params.mtgId}, (err, idArray)=>{
                if(err){ //when query is failed
                    logger.error(err.message, 'Meeting Controller: getAllInvitees::getInviteeIds', 10);
                    let apiResponse=response.generate(true, "Some error occured", 500, null);
                    reject(apiResponse); 
                } //when query returns no data
                else if(check.isEmpty(idArray)){
                    logger.info('No Meeting Found', 'Meeting Controller: getAllInvitees::getInviteeIds'); 
                    let apiResponse=response.generate(true, "No Data found", 404, null);
                    reject(apiResponse);   
                }else{//when query is successful                    
                    resolve(idArray)          
                }
            })        
        })
    } 
    //Step-2:We have useIds from invitation table- get all users details
    let getNonInviteeNames=(idArray)=>{
        return new Promise((resolve, reject)=>{
            UserModel.find()
                .exec((err, users)=>{
                    if(err){
                        logger.error(err.message, 'Meeting Controller: getAllInvitees::getInviteeNames', 10);
                        let apiResponse=response.generate(true, "Some error occured", 500, null);
                        reject(apiResponse); 
                    } else if(check.isEmpty(users)){
                        logger.info('No Meeting Found', 'Meeting Controller: getAllInvitees::getInviteeNames'); 
                        let apiResponse=response.generate(true, "No Data found", 404, null);
                        reject(apiResponse); 
                    } else {                        
                        //let nonInviteeList=[];
                        let a=idArray;
                        let b=users;

                        for (var i = 0, len = a.length; i < len; i++) { 
                            for (var j = 0, len2 = b.length; j < len2; j++) { 
                                if (a[i].userId === b[j].userId) {
                                    b.splice(j, 1);
                                    len2=b.length;
                                }
                            }
                        }
                    
                                                //console.log(nonInviteeList);
                        resolve(b);
                    }
                })
        })
    }
//send data or message - on success or failure
    getInviteeIds(req, res)
        .then(getNonInviteeNames)
        .then((resolve)=>{            
            let apiResponse=response.generate(false, "Invitees Data accessed successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })    
}
//----------------------------------------SingleViewerMeetings------------------------------------------
let getSingleViewerMeetings=(req, res)=>{    
    //step-1:get all invitation records matching userId sent in api request
    let getMeetingIDs=()=>{
        return new Promise((resolve, reject)=>{
            InvitationModel.find({'userId':req.params.userId})
            .exec((err, idArray)=>{
            if(err){
                logger.error(err.message, 'Meeting Controller: getSingleUserMeetings::getMeetingIDs', 10);
                let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                reject(apiResponse);
            } else if(check.isEmpty(idArray)){
                logger.info('No Meeting Found', 'Meeting Controller: getSingleUserMeetings::getMeetingIDs');
                let apiResponse=response.generate(true, "No Data Found", 404, null);
                reject(apiResponse);
            } else {                
                resolve(idArray);
            }
        })

        })
    }//function ended

    //step-2 : With help of meetingIds obtained in step-1 - get all meetings
    let getUserMeetings=(idArray)=>{
        //console.log(idArray);
        return new Promise((resolve, reject)=>{
            MeetingModel.find()
                .exec((err, meetingArray)=>{
                    if(err){
                        logger.error(err.message, 'Meeting Controller: getSingleUserMeetings::getUserMeetings', 10);
                        let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                        reject(apiResponse);
                    } else if(check.isEmpty(meetingArray)){
                        logger.info('No Meeting Found', 'Meeting Controller: getSingleUserMeetings::getUserMeetings');
                        let apiResponse=response.generate(true, "No Data Found", 404, null);
                        reject(apiResponse);
                    } else {                        
                        let mtgArr=[];                        
                        for(let id of idArray){
                            for(let item of meetingArray){
                                
                                if(id.mtgId===item.meetingId ){
                                    let temp={
                                        id:item.meetingId,
                                        subject:item.meetingName,
                                        startDate:item.mtgStartDate,
                                        startTime:item.startTime,
                                        endDate:item.mtgEndDate,
                                        endTime:item.endTime,
                                        venue:item.meetingVenue,
                                        convenor:item.convenor,
                                        mobile:item.convenorMobile                                        
                                    }
                                    mtgArr.push(temp);
                                }
                            }                            
                        }                        
                        resolve(mtgArr);
                    }
                })
        })
    }//function ended

    getMeetingIDs(req, res)
        .then(getUserMeetings)        
        .then((resolve)=>{
            let apiResponse=response.generate(false, "Daily Meetings data accessed successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{
            console.log(err);
            let apiResponse=response.generate(true, "Some error occurred", 500, null);
            res.send(apiResponse);
        })
}


//-------------------------------------------Post APIs--------------------------------------------------

//-----------------------------------------------deleteMeeting---------------------------------------------
let deleteMeeting=(req, res)=>{       
    //query to delete from meeting table
    MeetingModel.findOneAndRemove({meetingId:req.body.mtgId}, (err, result)=>{
        if(err){//when query failed
            logger.error(err.message, 'Meeting Controller: deleteMeeting', 10);
            let apiResponse=response.generate(true, "Some error occurred", 500, null)
            res.send(apiResponse);       
        }
        else if(check.isEmpty(result)){//when query found no data
            logger.info('No Meeting Found', 'Meeting Controller: deleteMeeting'); 
            let apiResponse=response.generate(true, "No Data found", 404, null)
            res.send(apiResponse);
        } else {//when query is successful                    
            let apiResponse=response.generate(false, "Meeting Data deleted successfully", 200, result)
            res.send(apiResponse);        
        }
    })//query ended    
}//delete mtg ended

//---------------------------------------------------------------------------------------------------------------
//exporting all meeting functions
module.exports={    
    getSingleViewerMeetings:getSingleViewerMeetings,
    getSingleMeetingDetails:getSingleMeetingDetails,
    getAllMeetings:getAllMeetings,   
    getAllInvitees:getAllInvitees,
    getAllNonInvitees:getAllNonInvitees,
    deleteMeeting:deleteMeeting 
}

 