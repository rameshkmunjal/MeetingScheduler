//creating  OTPSchema model as per schema and exporting it
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const OTPSchema=new Schema({
    otpId:{type:String, unique:true},
    userId:{type:String, default:''},
    createdOn:{type:Date, default:Date.now},    
    otp:{type:Number, default:''},
    email:{type:String, default:''}
})

mongoose.model('otp', OTPSchema);