const jwt=require('jsonwebtoken');
const shortid=require('shortid');
const secretKey="somescrettextgoeshere";

//function - to generate jwt token
let generateToken=(data, cb)=>{
    try{
        let claims={
            jwtid:shortid.generate(),
            iat:Date.now(),
            exp:new Date("2019-12-31T05:43:00.000Z").getTime()/1000,
            sub:'authToken',
            iss:'munjalproject',
            data:data
        }
        let tokenDetails={
            token:jwt.sign(claims, secretKey),
            tokenSecret:secretKey
        }
        cb(null, tokenDetails);
    } catch(err){
        cb(err, null);
    }
}//end generateToken
//-----------------------------------------------------------------------------------------
//function - to verify claims
let verifyClaims=(token, secretKey, cb)=>{
    jwt.verify(token, secretKey, function(err, decoded){
        if(err){
            console.log(err);
            cb(err, null);
        } else {
            cb(null, decoded);
        }
    })
}
//function - to verify claims without secret
let verifyClaimWithoutSecret=(token, cb)=>{    
    jwt.verify(token, secretKey, function(err, decoded){
        if(err){
            console.log(err);
            console.log("auth token is not matching");
            cb(err, null);
        } else{
            cb(null, decoded);
        }
    })
}
//--------------------------------------------------------------------------------
module.exports={
    generateToken:generateToken,
    verifyToken:verifyClaims,
    verifyClaimWithoutSecret:verifyClaimWithoutSecret
}

