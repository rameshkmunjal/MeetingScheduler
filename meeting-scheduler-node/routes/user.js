//user related routes and their controller function
const express = require('express');
const userController=require('./../controllers/userController');
const appConfig=require('./../config/appConfig');
const auth=require('./../middleware/auth');

let setRouter=(app)=>{    
    let baseUrl=appConfig.apiVersion+"/project";
    console.log("url  :  "+baseUrl+'/updatepassword/:username');
    app.get(baseUrl+'/:authToken/allViewers/:viewer', auth.isAuthorised, userController.getAllViewers);
    app.post(baseUrl+'/signup', userController.signupFunction);
    app.post(baseUrl+'/login', userController.loginFunction);
    app.post(baseUrl+'/:userId/logout', auth.isAuthorised,  userController.logout);
    app.post(baseUrl+'/getbackpassword', userController.getBackPassword);
    app.post(baseUrl+'/updatepassword/:username', userController.updatePassword);
    app.post(baseUrl+'/testOTP', userController.testOTP); 
}

//setRouter carrying all these controller functions exported 
module.exports={
    setRouter:setRouter
}