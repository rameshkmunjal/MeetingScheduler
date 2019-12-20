const bcrypt=require('bcrypt');
const saltRounds=10;

let hashpassword=(myPlainTextPassword)=>{
    let salt=bcrypt.genSaltSync(saltRounds);
    let hash=bcrypt.hashSync(myPlainTextPassword, salt);
    return hash;
}

let comparePassword=(oldPassword, hashpassword, cb)=>{
  bcrypt.compare(oldPassword, hashpassword, (err, res)=>{
    if(err){	  
      console.log(err);
      cb(err, null);
    } else {
      cb(null, res);
    }
  })
}

module.exports={
    hashpassword:hashpassword,
    comparePassword:comparePassword
}





