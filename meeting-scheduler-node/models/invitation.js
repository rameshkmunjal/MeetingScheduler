// creating InvitationSchema model as per schema and exporting it
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const InvitationSchema=new Schema({
    id:{type:String, unique:true},
    sentOn:{type:Date, default:Date.now},
    mtgId:{type:String, default:""},
    userId:{type:String, default:""}
})

mongoose.model('Invitation', InvitationSchema);