//including npm packages
const express=require('express');
const app=express();
const shortid=require('shortid');
const mongoose=require('mongoose');

//including library files
const validateInput=require('./../libs/validationLib');
const response=require('./../libs/responseLib');
const check=require('./../libs/checkLib');
const passwordLib=require('./../libs/generatePasswordLib');
const emailLib=require('./../libs/emailLib');
const logger=require('./../libs/loggerLib');
const token=require('./../libs/tokenLib');

//creating mongoose models there of
const UserModel = mongoose.model('User');
const OTPModel=mongoose.model('otp');
const AuthModel=mongoose.model('Auth');

//------------------------------------Function Definitions----------------------------------------
//getAllViewers - users who have viewer rights
let getAllViewers=(req, res)=>{
    //res.send("getAllUsers function accessed");
    UserModel.find({'rights':req.params.viewer})
        .select('-_id-__v')
        .lean()
        .exec((err, result)=>{
            if(err){
                logger.error(err.message, 'User Controller: getAllViewers', 10);                
                let apiResponse=response.generate(true, "Some Error Occured", 500, err)                       
                res.send(apiResponse);
            } else if(check.isEmpty(result)){
                logger.info('No User Found', 'User Controller: getAllViewers');                
                let apiResponse=response.generate(true, "No Data found", 404, result)                       
                res.send(apiResponse);
            } else{
                //delete properties - we dont want to send client side
                for(let x of result){
                    delete x.__v;
                    delete x._id;
                    delete x.password;
                }
                
                let apiResponse=response.generate(false, "Viewer Data fetched successfully", 200, result)                       
                res.send(apiResponse);                
            }
        })
}
//---------------------------------------signupFunction----------------------------------------------------
//signup Function defined
let signupFunction=(req, res)=>{
    //step-1 : validate user input 
    let  validateUserInput=()=>{
        return new Promise((resolve, reject)=>{
            //if email input is given
            if(req.body.email){
               if(!validateInput.Email(req.body.email)) {//if email is not as per format
                    let apiResponse=response.generate(true, "email  address is not as per format", 500, null);
                    reject(apiResponse);
                } else if(check.isEmpty(req.body.password)){  //if password field is empty                   
                    let apiResponse=response.generate(true, 'password field is empty', 404,null);
                    reject(apiResponse);
                }else{  //take request to next step                                     
                    resolve(req);
                }
            }  
            else{  //if email is not input              
                let apiResponse=response.generate(false, "email not input by user", 500 , null);
                reject(apiResponse);
            }
       })//promise ended
    } //validateInput function ended     
   
    //Step-2 : if step-1 is OK - check user does not pre-exist and create new user
    let createUser=()=>{
        return new Promise((resolve, reject)=>{
            UserModel.findOne({userName:req.body.userName})
                .exec((err, result)=>{
                    if(err){
                        logger.error(err.message, 'User Controller: createUser', 10);                        
                        let apiResponse=response.generate(true, "Some Error Occured", 500, err)                       
                        reject(apiResponse);
                    }
                    else if(check.isEmpty(result)){ //if no such user found -create new one                       
                        let newUser = new  UserModel({
                            userId:shortid.generate(),
                            firstName:req.body.firstName,
                            lastName:req.body.lastName,    
                            userName:req.body.userName,
                            email:req.body.email,
                            password:passwordLib.hashpassword(req.body.password),
                            role:req.body.role,
                            country:req.body.country,
                            countryCode:req.body.countryCode,
                            mobileNumber:req.body.mobileNumber,                            
                            rights:req.body.rights
                        })    
    
                        newUser.save((err, newUser)=>{
                            if(err){
                                logger.error(err.message, 'User Controller: createUser->newUser', 10);                                
                                let apiResponse=response.generate(true, "Some Error Occured", 500, err);                       
                                reject(apiResponse);
                            } else{
                                let newUserObj=newUser.toObject();
                                resolve(newUserObj);
                            }
                        })                         
                    } else {    //if user already exists in database                    
                        let apiResponse=response.generate(true, "user with this userName already exists", 400, null);
                        reject(apiResponse);
                    }//else ended
        });//exec method ended 
    });//promise ended
    }//createUser ended

    validateUserInput(req, res)
        .then(createUser)        
        .then((resolve)=>{
            delete resolve.password;
            delete resolve._id;
            delete resolve.__v;
            let apiResponse=response.generate(false, "user created successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{            
            res.send(err);
        })        
}//signup function ended
//------------------------------------------------------------------------------------------------------------
//login function - step-1 : make search for username - if found - handover user details to step-2
let loginFunction=(req, res)=>{     
    let findUser=()=>{        
        return new Promise((resolve, reject)=>{
            UserModel.findOne({'userName':req.body.userName}, (err, userDetails)=>{                
                    if(err){
                        logger.error(err.message, 'User Controller: loginFunction', 10); 
                        let apiResponse=response.generate(true, "User Details could not be fetched", 500, null);
                        reject(apiResponse);
                    }
                    else if(check.isEmpty(userDetails)){
                        logger.info('No User Found', 'User Controller:getSingleUserDetails');                        
                        let apiResponse=response.generate(true, "No user details found", 404, null);
                        reject(apiResponse);
                    } else{                        
                        resolve(userDetails);                    
                    }
                })          
        })//end of Promise
    }//end of findUser
//step-2 - validate password - if matched - send pruned use details(delete password etc)
    let validatePassword=(retrievedUserDetails)=>{        
        return new Promise((resolve, reject)=>{
            passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch)=>{
                if(err){
                    logger.error(err.message, 'User Controller: validatePassword', 10);
                    let apiResponse=response.generate(true, "Some error occurred", 500, null);
                    reject(apiResponse);
                } else if(isMatch){
                    //when password is matched - delete undesirable items from result
                    //and pass clean object to next step
                    let retrievedUserDetailsObj=retrievedUserDetails;
                    delete retrievedUserDetails.password;
                    delete retrievedUserDetails._id;
                    delete retrievedUserDetails.__v;
                    delete retrievedUserDetails.createdOn;
                    delete retrievedUserDetails.modifiedOn;                    
                    resolve(retrievedUserDetailsObj);
                } else{//when password does not match 
                    logger.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)                   
                    let apiResponse=response.generate(true, "Password does not match", 500, null);
                    reject(apiResponse);
                }

            })
        })
    }
//step-3 : authToken - for multipupose use - will be generated using JWT
    let generateToken=(userDetails)=>{        
        return new Promise((resolve, reject)=>{
            token.generateToken(userDetails, (err, tokenDetails)=>{
                if(err){                    
                    let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                    reject(apiResponse);
                } else{
                    tokenDetails.userId=userDetails.userId;
                    tokenDetails.userDetails=userDetails;                              
                    resolve(tokenDetails);
                }
            })
        })
    }
//step-4 : authToken will be saved
    let saveToken=(tokenDetails)=>{        
        return new Promise((resolve, reject)=>{
            AuthModel.findOne({'userId':tokenDetails.userId})
                .exec((err, retrievedTokenDetails)=>{
                    if(err){                        
                        let apiResponse=response.generate(true, "Some Error Occurred", 500, null);
                        reject(apiResponse);
                    } else if(check.isEmpty(retrievedTokenDetails)){
                        //when auth token does not exist -create new one
                        let newAuthToken=new AuthModel({
                            userId:tokenDetails.userId,
                            authToken:tokenDetails.token,
                            tokenSecret:tokenDetails.tokenSecret,
                            tokenGenerationTime:Date.now()
                        })

                        newAuthToken.save((err, newTokenDetails)=>{
                            if(err){                                
                                let apiResponse=response.generate(true, "Failed to generate token", 500, null);
                                reject(apiResponse);
                            } else{
                                    let responseBody={
                                        authToken : newTokenDetails.authToken,
                                        userId:tokenDetails.userDetails.userId,
                                        rights : tokenDetails.userDetails.rights,
                                        firstName:tokenDetails.userDetails.firstName,
                                        lastName:tokenDetails.userDetails.lastName,
                                        mobileNumber:tokenDetails.userDetails.mobileNumber
                                    }                                
                                    resolve(responseBody);
                                }
                         })
                    }else{//when auth token exists - overwrite it over fetched details from authModel
                        retrievedTokenDetails.authToken=tokenDetails.token;
                        retrievedTokenDetails.tokenSecret=tokenDetails.tokenSecret;
                        retrievedTokenDetails.tokenGenerationTime=Date.now();
                        retrievedTokenDetails.save((err, newTokenDetails)=>{
                            if(err){                                
                                let apiResponse=response.generate(true, "Failed to save token", 500, null);
                                reject(apiResponse);
                            }else{
                                let responseBody={
                                    authToken:newTokenDetails.authToken,
                                    userId:tokenDetails.userDetails.userId,
                                    rights : tokenDetails.userDetails.rights,
                                    firstName:tokenDetails.userDetails.firstName,
                                    lastName:tokenDetails.userDetails.lastName,
                                    mobileNumber:tokenDetails.userDetails.mobileNumber
                                }                                
                                resolve(responseBody);
                            }
                        })

                    }
                })
        })

    }
//send success message to client side
    findUser(req, res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "User logged in successfully", 200, resolve);
            res.status(200);
            res.send(apiResponse);
        }) //else error message to client side
        .catch((err)=>{            
            res.status(err.status);
            res.send(err);
        })    
}
//----------------------------------------------getOTPFunction--------------------------------
//This function will create OTP, save it in DB, send a msg to client and otp  by email
let getOTP=(req, res)=>{    
    //to create OTP
   let createOTP=()=>{
       return new Promise((resolve, reject)=>{
        UserModel.findOne({'userName':req.body.userName, 'email':req.body.email}, (err, userDetails)=>{                
            if(err){
                    logger.error(err.message, 'User Controller: getOTP', 10);                    
                    let apiResponse=response.generate(true, "User Details could not be fetched", 500, null);
                    reject(apiResponse);
                }
                else if(check.isEmpty(userDetails)){
                    let apiResponse=response.generate(true, "No user details found", 404, null);
                    reject(apiResponse);
                } 
                else{   //user  details matched - hence a 4-digit otp created
                    let newOTP=new OTPModel({
                        otpId:shortid.generate(),
                        userId:userDetails.userId,
                        createdOn:Date.now(),
                        otp:Math.floor(Math.random()*8000)+1000,//a random four digit number
                        email:userDetails.email
                    })
                    //otp saved
                    newOTP.save((err, result)=>{
                        if(err){  //if error - while saving                          
                            let apiResponse=response.generate(true, "Some Error occured", 500, null);
                            res.send(apiResponse);
                        } else{  //saved                                                     
                            resolve(result);
                        }
                    })
                }
            })

       })
   } 
//To send OTP by email
   let sendOTPbyEmail=(otpDetails)=>{       
       return new Promise((resolve, reject)=>{
           if(otpDetails===null){
               let apiResponse=response.generate(true, 'Some Error occurred', 500, null);
               reject(apiResponse);
           } else{
               //send otp by email code here 
               let otp = otpDetails.otp;
               let emailAddress=req.body.email;
               emailLib.sendOTP(otp, emailAddress);
               resolve(otpDetails.otpId);
           }
       })
   }
   //send message to client - success or failure
createOTP(req, res)
   .then(sendOTPbyEmail)
   .then((resolve)=>{//if success - send response to client side
       let apiResponse=response.generate(false, "OTP sent by Email  to the user", 200, resolve);
       res.send(apiResponse);
   })
   .catch((err)=>{//if error found - send to client side
       res.send(err);
   })     
}

//-----------------------------------------------------------------------------------------
//Function to match - OTP send from client with otp table
let testOTP=(req, res)=>{
    //Step-1:Match OTP with help of otpId     
    let validateOTP=()=>{
        return new Promise((resolve, reject)=>{
            OTPModel.findOne({'otp': req.body.otp})
            .exec((err, otpDetails)=>{            
            if(err){               
                let apiResponse=response.generate(true, "Some error occurred", 500, null);
                reject(apiResponse);
            } else if(check.isEmpty(otpDetails)){
                
                let apiResponse=response.generate(true, "No Data found", 404, null);
                reject(apiResponse);
            } else{                
                resolve(otpDetails);
            }
        })//exec method ended

        })//Promise definition ended
    }//function validateOTP ended
//step-2: use userId from otp details obtained and get user details from user table 
    let getUserDetails=(otpObj)=>{        
        let userId=otpObj.userId;
        
        return new Promise((resolve, reject)=>{
        UserModel.findOne({'userId':userId})
            .exec((err, userDetails)=>{
            if(err){
                
                let apiResponse=response.generate(true, "Some error occurred", 500, null);
                reject(apiResponse);
            } else if(check.isEmpty(userDetails)){                
                let apiResponse=response.generate(true, "No Data found", 404, null);
                reject(apiResponse);
            } else{
                resolve(userDetails);
            }
        })//exec method ended

        })//Promise definition ended
    }//function validateOTP ended

//send success or failure message to client
    validateOTP(req, res)
        .then(getUserDetails)
        .then((resolve)=>{
            let apiResponse=response.generate(false, "User Details accessed successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err)=>{
            res.send(err);
        })
    
}
//--------------------------------------update password function -----------------------------------------
//function to get password from client and update password in user table
let updatePassword=(req, res)=>{     
    UserModel.findOne({'userName':req.params.username})
        .exec((err, userDetails)=>{
            if(err){
                logger.error(err.message, 'User Controller: getBackPassword', 10);
                
                let apiResponse=response.generate(true, "User Details could not be fetched", 500, null);
                res.send(apiResponse);
            } else if(check.isEmpty(userDetails)){
               // logger.info('No User Found', 'User Controller:getSingleUserDetails');
                let apiResponse=response.generate(true, "No Data found", 404, null);
                res.send(apiResponse);
                
            } else{
                //convert password encrypted
                userDetails.password=passwordLib.hashpassword(req.body.password);                            
                userDetails.save((err, user)=>{
                    if(err){
                        logger.error(err.message, 'User Controller: updatePassword', 10);                
                        
                        let apiResponse=response.generate(true, "password updation failure", 500, err)                       
                        res.send(apiResponse);

                    }else{                         
                        let apiResponse=response.generate(false, "password updated successfully", 200, user)                       
                        res.send(apiResponse);
                    }
                })                
            }
        })
}

//---------------------------------------------------------------------------------------------------------
//function - to handle logout request - send by client
let logout=(req, res)=>{    
    AuthModel.findOneAndRemove({'userId':req.params.userId})
        .exec((err, result)=>{
            if(err){ 
                
                let apiResponse=response.generate(true, "Some error occurred", 500, null);
                res.send(apiResponse);
            }
            else if(check.isEmpty(result)){
                let apiResponse=response.generate(true, "No Matching Data Found", 404, null);
                res.send(apiResponse);
            } else{
                let apiResponse=response.generate(false, "User Logged out successfully ", 200, null);
                res.send(apiResponse);
            }
        })
   // res.send(req.body.userId);
}
//------------------------------------------------------------------------------------------------------------
//userController functions exported
module.exports={
    getAllViewers:getAllViewers,    
    signupFunction:signupFunction,
    loginFunction:loginFunction,
    logout:logout,
    getOTP:getOTP,
    testOTP:testOTP,
    updatePassword:updatePassword    
}
//---------------------------------------------------------------------------------------------------------