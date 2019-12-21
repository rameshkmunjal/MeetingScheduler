//defining routes relating meetings by their controller functions
const express=require('express');
const meetingController=require('./../controllers/meetingController');
const appConfig=require('./../config/appConfig');
const auth=require('./../middleware/auth');

let setRouter=(app)=>{
    let baseUrl=appConfig.apiVersion+"/project";
    app.get(baseUrl+'/:authToken/allMeetings', auth.isAuthorised, meetingController.getAllMeetings);     
    app.get(baseUrl+'/:authToken/singleViewerMeetings/:userId',auth.isAuthorised, meetingController.getSingleViewerMeetings);                        
    app.get(baseUrl+'/:authToken/singleMeeting/:meetingId', auth.isAuthorised, meetingController.getSingleMeetingDetails);    
    app.get(baseUrl+'/:authToken/allInvitees/:mtgId', auth.isAuthorised, meetingController.getAllInvitees);
    app.get(baseUrl+'/:authToken/allNonInvitees/:mtgId', auth.isAuthorised, meetingController.getAllNonInvitees);       
    app.post(baseUrl+'/:authToken/delete', auth.isAuthorised, meetingController.deleteMeeting);    
}

module.exports={
    setRouter:setRouter
}