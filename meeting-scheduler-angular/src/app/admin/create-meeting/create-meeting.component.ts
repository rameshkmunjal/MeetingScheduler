//import angular packages
import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
//import user defined services
import {AppService} from './../../app.service';
import {SocketService} from './../../socket.service';
import {LibraryService} from './../../library.service';



@Component({
  selector: 'app-create-meeting',
  templateUrl: './create-meeting.component.html',
  styleUrls: ['./create-meeting.component.css']
})

export class CreateMeetingComponent implements OnInit, OnDestroy {
  public authToken:String;//to send in api call  
  public adminName:string;
  public adminMobile:string;
  public errorMessage:String;  //to hold and show error message

  //variables to hold form input  - as per order in form
  public meetingName:String;  
  public meetingTime:String;
  public day:string=JSON.stringify(new Date().getDate());
  public month:string;
  public year:string;
  public starthour:String="Hours";
  public startminutes:String="Minutes";
  public endhour:String="Hours";
  public endminutes:String="Minutes";  
  public meetingVenue:String;

  //array variables to hold options
  public monthsArray:any=[];//values Jan-Dec
  public days:any=[];//values Sun-Sat
  public hours:any=[];//values from 0 to 23
  public minutesArr:any=[];//values from 0-59
  
  public totalDays:number;//number of days - as per month
  public monthIndex:Number;//index position   
  
  public allUsers:any=[];//to hold users - used as invitees
  public today=new Date();//today's date    
  
  constructor(   
    private appService:AppService,
    private library:LibraryService,
    private SocketService:SocketService, 
    private router:Router
  ) { }

  ngOnInit() {
    //to obtain from user details saved in localstorage
    this.authToken=this.appService.getUserInfoFromLocalstorage().authToken;
    this.adminName=this.appService.getUserInfoFromLocalstorage().fullName;
    this.adminMobile=this.appService.getUserInfoFromLocalstorage().mobileNumber;   
    //all months and hours - housed in array vars
    this.monthsArray=this.library.getMonths();    
    this.hours=this.library.getHours(); 
    let i=new Date().getMonth(); 
    this.month=this.monthsArray[i];  
    this.year=this.library.getCurrentYear();         
  } 

  ngOnDestroy() {///destroy page - when exited
    console.log("create-meeting component destroyed ");
  } 

//function - to prepare object 
public getMtgObject=()=>{
  let d={
    name:this.meetingName,
    year:this.year,
    month:this.month,
    day:this.day,
    starthour:this.starthour,
    startminutes:this.startminutes,
    endhour:this.endhour,
    endminutes:this.endminutes,
    convenor:this.adminName,
    convenorMobile:this.adminMobile,    
    venue:this.meetingVenue    
  } 
  return d;
}//end of function

//function - to create meeting
  public createMeeting=():void=>{            
      this.monthIndex=this.library.getMonthIndex(this.month);
      let mtgStartDate=this.library.prepareDate(this.year, this.monthIndex, this.day, this.starthour, this.startminutes);
      let mtgEndDate=this.library.prepareDate(this.year, this.monthIndex, this.day, this.endhour, this.endminutes);
      let currentDate=new Date();
      let obj=this.getMtgObject(); 
      //validate all inputs
      this.errorMessage=this.library.validateInputs(obj);
      //to test - meeting date/time should not be prior to current time
      if(!this.errorMessage){
        this.errorMessage=this.library.validateDateInput(mtgStartDate, currentDate);
      } 
      //to test - end date/time should not be prior to meeting start time
      if(!this.errorMessage){
        this.errorMessage=this.library.validateDateInput(mtgEndDate, mtgStartDate);
      }   
    
      if(!this.errorMessage){      
        let startTime=this.library.prepareMeetingTime(mtgStartDate);
        let endTime= this.library.prepareMeetingTime(mtgEndDate); 
        
        //make an object - to validate all inputs in one go
        let data={
          meetingName:this.meetingName,
          mtgStartDate:mtgStartDate,
          startTime: startTime, 
          mtgEndDate:mtgEndDate,      
          endTime:endTime,
          convenor:this.adminName,
          convenorMobile:this.adminMobile,
          meetingVenue:this.meetingVenue        
        }
        //make socket call
        this.SocketService.createMeeting(data);      
        this.router.navigate(['/admin-dashboard/home']);
      }      
    }//end of function

  //---------------------------Some utility functions----------------------------------------------
  public getMinutes=()=>{ //get minutes array    
    this.minutesArr=this.library.getMinutes();    
  }

  public getDaysInAMonth=()=>{//get days array
    this.days=this.library.getDaysInAMonth(this.month);
  }  
  //-----------------------------------------------------------------------------------------------------------

}

  
  