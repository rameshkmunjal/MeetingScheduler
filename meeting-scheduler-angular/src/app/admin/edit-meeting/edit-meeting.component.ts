//import npm packages
import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
//import user defined services
import {SocketService} from './../../socket.service';
import {MeetingService} from './../../meeting.service';
import {LibraryService} from './../../library.service';
import {AppService} from './../../app.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-edit-meeting',
  templateUrl: './edit-meeting.component.html',
  styleUrls: ['./edit-meeting.component.css']
})

export class EditMeetingComponent implements OnInit, OnDestroy {
  private authToken:String;//to send with api call
  public meetingId:String;//route param of this page
  public adminId:string;

  public starthour:string="Hour";
  public startminutes:string="Minutes";
  public endhour:string="Hour";
  public endminutes:string="Minutes";
  public startTime:string;
  public endTime:string;
///some array variables to get mtg values
  public monthsArray:any=[];
  public days:any=[];
  public hours:any=[];
  public minutesArr:any=[];
  public allInvitees:any=[];
//index position of month array
  public monthIndex:number; 
//current meeting data
  public currentMeeting:any;   
//variables - meeting data  
  public year:string;
  public month:string;
  
  public day:string;
  public hour:string;  
  public minutes:string;
//will hold error messages   
  public errorMessage:String=""; 

  constructor(
    private meetingService:MeetingService,
    private socketService:SocketService,
    private appService:AppService,
    private library:LibraryService,
    private toastr:ToastrService,
    private _route:ActivatedRoute,
    private router:Router 

  ) { }

  ngOnInit() {
    //getting auth token
    this.authToken=this.appService.getUserInfoFromLocalstorage().authToken;
    this.adminId=this.appService.getUserInfoFromLocalstorage().userId;
    //getting route param
    this.meetingId=this._route.snapshot.paramMap.get('mtgId');
    //getting array values
    this.monthsArray=this.library.getMonths();
    this.hours=this.library.getHours(); 
    this.year=this.library.getCurrentYear();
    this.monthIndex=new Date().getMonth();
    this.month=this.monthsArray[this.monthIndex];
    this.getDaysInAMonth();
    //function call - getting current meeting data 
    this.getAllInviteesList(this.meetingId, this.authToken);  
    this.getCurrentMeeting(this.meetingId);
  }

  ngOnDestroy() {//destroy page - when exited
    console.log(" edit-meeting component destroyed ");
  }
//function - getting current meeting data
  public  getCurrentMeeting(meetingId){    
    this.meetingService.getSingleMeetingDetails(meetingId, this.authToken).subscribe(
      apiResponse=>{        
        this.currentMeeting=apiResponse.data;
        
        let i=new Date(this.currentMeeting.mtgStartDate).getMonth();
        this.month=this.monthsArray[i];
        this.day=JSON.stringify(new Date(this.currentMeeting.mtgStartDate).getDate());
        this.starthour=JSON.stringify(new Date(this.currentMeeting.mtgStartDate).getHours());
        this.startminutes=JSON.stringify(new Date(this.currentMeeting.mtgStartDate).getMinutes());
        this.endhour=JSON.stringify(new Date(this.currentMeeting.mtgEndDate).getHours());        
        this.endminutes=JSON.stringify(new Date(this.currentMeeting.mtgEndDate).getMinutes());
        
      }, error=>{   //showing error message         
        if(error.error.message){          
          let errorMessage=error.error.message;
          let errorCode=error.status;
          this.router.navigate(['/error', errorCode, errorMessage]);
         } else {          
          this.toastr.error(error.message);
         }        
      }) //subscribe method ended 
  }   
//----------meeting data--------------------
  
public getMtgObject=()=>{
  //creating an object for validation in one go
  let d={
    name:this.currentMeeting.meetingName,
    year:this.year,
    month:this.month,
    day:this.day,
    starthour:this.starthour,
    startminutes:this.startminutes,
    endhour:this.endhour,
    endminutes:this.endminutes,
    convenor:this.currentMeeting.convenor,
    convenorMobile:this.currentMeeting.convenorMobile,
    venue:this.currentMeeting.meetingVenue
  } 
  console.log(d); 
  return d;
}

//function to edit an existing meeting of the user 
  public editMeeting(){ 
    let obj=this.getMtgObject();
      let mon = this.month; 
      this.monthIndex=this.monthsArray.indexOf(mon); 
      let mtgStartDate=this.library.prepareDate(obj.year, this.monthIndex, obj.day, obj.starthour, obj.startminutes);      
      let mtgEndDate=this.library.prepareDate(obj.year, this.monthIndex, obj.day, obj.endhour, obj.endminutes);      
      let currentDate=new Date();
       //object of all input values for validation
    //validate inputs 
      this.errorMessage=this.library.validateInputs(obj);
       
      if(!this.errorMessage){
        if(new Date(currentDate) > new Date(mtgStartDate)){
          this.errorMessage="Mtg start date/time can not be earlier than current date/time";
        }
        if(new Date(mtgStartDate) > new Date(mtgEndDate)){
          this.errorMessage="Mtg end date/time can not be earlier than start date/time";
        }
      }       
      
    //only when there is no error - after validation
    if(!this.errorMessage){           
      let mtgStartTime=this.library.prepareMeetingTime(mtgStartDate);
      let mtgEndTime=this.library.prepareMeetingTime(mtgEndDate);
      console.log(mtgStartTime);
      console.log(mtgEndTime);
      let data={
        meetingId:this.currentMeeting.meetingId,
        meetingName:this.currentMeeting.meetingName,
        mtgStartDate:mtgStartDate,        
        startTime:mtgStartTime,
        mtgEndDate:mtgEndDate,
        endTime:mtgEndTime, 
        convenor:this.currentMeeting.convenor,
        convenorMobile:this.currentMeeting.convenorMobile,       
        meetingVenue:this.currentMeeting.meetingVenue,
        viewerList:this.allInvitees
      }
    console.log(data);  
    this.socketService.editMeeting(data);
    this.router.navigate(['/admin-dashboard/home']);
  }  
}
//---------------------------Get Invitees Details--------------------------------------
//to get list of all invitees
public getAllInviteesList(mtgId, authToken):any{
  this.meetingService.getAllInvitees(mtgId, authToken).subscribe(
    apiResponse=>{
      if(apiResponse.status===200){
        this.allInvitees=apiResponse.data;
        this.allInvitees=this.meetingService.removeAdminName(this.allInvitees, this.adminId);
      } else {
        this.toastr.error(apiResponse.message);
        let errorCode = apiResponse.status;
        let errorMessage = apiResponse.message;
        this.router.navigate(['/error', errorCode, errorMessage]);
      } 
    }, error=>{   //showing error message
        
      if(error.error.message){            
        let errorMessage=error.error.message;
        let errorCode=error.status;
        this.router.navigate(['/error', errorCode, errorMessage]);
       } else {            
        this.toastr.error(error.message);
       }        
    }) //subscribe method ended
}

//--------------------some utility functions------------------------------
  public getDaysInAMonth(){//getting number of day in a month
    this.days=this.library.getDaysInAMonth(this.month);
  }
  public getMinutes(){//getting minute values in an array 0-59    
    this.minutes="00";
    this.minutesArr=this.library.getMinutes();  
  }
  
//-------------------------------------------------------------------------
//ending class definiton
}
