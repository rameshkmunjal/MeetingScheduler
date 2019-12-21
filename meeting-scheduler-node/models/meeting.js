//creating  MeetingSchema model as per schema and exporting it
const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const MeetingSchema= new Schema({
    meetingId:{type:String, unique:true},
    meetingName:{type:String, default:""},
    mtgStartDate:{type:Date, default:""}, 
    startTime:{type:String, default:""},
    mtgEndDate:{type:Date, default:""}, 
    endTime:{type:String, default:""},  
    convenor:{type:String, default:""},
    convenorMobile:{type:Number, default:0},
    meetingVenue:{type:String, default:""},    
    createdOn:{type:Date, default:Date.now},
    lastModified:{type:Date, default:Date.now}    
})

mongoose.model('meeting', MeetingSchema);

