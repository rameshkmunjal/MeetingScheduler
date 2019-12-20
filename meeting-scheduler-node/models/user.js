//creating UserSchema model as per schema and exporting it
const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const UserSchema=new Schema({
    userId:{type:String, unique:true},
    firstName:{type:String, default:''},
    lastName:{type:String, default:''},    
    userName:{type:String, default:''},
    email:{type:String, default:''},
    password:{type:String, default:''},
    role:{type:String, default:''},
    country:{type:String, default:''},
    countryCode:{type:String, default:''},
    mobileNumber:{type:Number, default:''},    
    rights:{type:String, default:''}
});

mongoose.model('User', UserSchema);



