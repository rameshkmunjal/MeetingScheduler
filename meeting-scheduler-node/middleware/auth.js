const mongoose=require('mongoose');
require('./../models/auth');
const Auth=mongoose.model('Auth');

const logger=require('./../libs/loggerLib');
const token=require('./../libs/tokenLib');
const response=require('./../libs/responseLib');
const check=require('./../libs/checkLib');

let isAuthrised=(req, res, next)=>{
    //console.log(req.params.authToken);
    if(req.params.authToken || req.body.authToken || req.query.authToken || req.header('authToken')){
        Auth.findOne({authToken : req.params.authToken || req.body.authToken || 
            req.query.authToken || req.header('authToken')}, (err, authDetails)=>{
                if(err){
                    console.log(err);
                    logger.error(err.message, "AuthorisationMiddleware", 10);
                    let apiResponse=response.generate(true, "Failed in Authorization", 500, null);
                    res.send(apiResponse);
                } else if(check.isEmpty(authDetails)){
                    //logger.error("No Authorization Key found", "isAuthorised function", 10);
                    console.log("check auth key");
                    let apiResponse=response.generate(true, "No Authorization key is found", 404, null);
                    res.send(apiResponse);
                } else {
                    token.verifyToken(authDetails.authToken, authDetails.tokenSecret, (err, decoded)=>{
                        if(err){
                            console.log(err);
                        } else{
                            req.user = {userId : decoded.data.userId}
                            next();
                        }
                    })
                }

            })
    }//if block ended
    else{
        logger.error('Authorisation key is missing', "isAuthorised function ", 10);
        let apiResponse=response.generate(true, "Authorisation key is missing", 500, null);
        res.send(apiResponse);
    }
}

module.exports={
    isAuthorised:isAuthrised
}