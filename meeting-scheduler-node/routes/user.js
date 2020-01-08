//user related routes and their controller function
const express = require('express');
const userController=require('./../controllers/userController');
const appConfig=require('./../config/appConfig');
const auth=require('./../middleware/auth');

let setRouter=(app)=>{    
    let baseUrl=appConfig.apiVersion+"/project";
    
    app.get(baseUrl+'/:authToken/allViewers/:viewer', auth.isAuthorised, userController.getAllViewers);
    app.get(baseUrl+'/:authToken/adminDetails/:adminId', auth.isAuthorised, userController.getAdminDetailsById);    
    app.post(baseUrl+'/signup', userController.signupFunction);
    app.post(baseUrl+'/login', userController.loginFunction);
    app.post(baseUrl+'/:userId/logout', auth.isAuthorised,  userController.logout);
    app.post(baseUrl+'/getOTP', userController.getOTP);
    app.post(baseUrl+'/updatepassword/:username', userController.updatePassword);
    app.post(baseUrl+'/testOTP', userController.testOTP); 
}

//setRouter carrying all these controller function calls exported 
module.exports={
    setRouter:setRouter
}