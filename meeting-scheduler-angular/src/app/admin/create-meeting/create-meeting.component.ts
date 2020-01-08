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
  public adminName:string;//to hold name of admin
  public adminMobile:string;//to hold mobile number of admin
  public errorMessage:String;  //to hold and show error message
  public adminId:string;

  //variables to hold form input  - as per order in form
  public meetingName:String; //subject 
  public meetingTime:String; //time
  public day:string=JSON.stringify(new Date().getDate());//by default - current date i.e. today
  public month:string;//to hold month
  public year:string;//to hold year
  public starthour:String="Hrs";//to hold start hour of meeting time
  public startminutes:String="Min";//to hold start minutes of meeting time
  public endhour:String="Hrs"; //to hold end hour of meeting time
  public endminutes:String="Min";  //to hold end minutes of meeting time
  public meetingVenue:String; //to hold venue of meeting time

  //array variables to hold options
  public monthsArray:any=[];//values Jan-Dec
  public days:any=[];//values Sun-Sat
  public hours:any=[];//values from 0 to 23
  public minutesArr:any=[];//values from 0-59

  public totalDays:number;//number of days - as per month
  public monthIndex:Number;//index position 
  //public today=new Date();//today's date 

  public adminDetails:any;
  public viewerList:any=[];//to hold all viewers details objec
  public user:string;//to hold single user object value
  public inviteeFlag:string="all"; //flag used to switch between two options - all or select  
  public allSelected=true; //if true - all button active - false -not active
  public someSelected=false;//f true - some button active - false - not active

  constructor( //service instances  
    private appService:AppService,
    private library:LibraryService,
    private SocketService:SocketService,
    //router instance 
    private router:Router
  ) { }

  ngOnInit() {
    //to obtain from user details saved in localstorage
    this.authToken=this.appService.getUserInfoFromLocalstorage().authToken;
    this.adminName=this.appService.getUserInfoFromLocalstorage().fullName;
    this.adminMobile=this.appService.getUserInfoFromLocalstorage().mobileNumber; 
    this.adminId= this.appService.getUserInfoFromLocalstorage().userId; 
    //all months and hours - housed in array vars
    this.monthsArray=this.library.getMonths();    
    this.hours=this.library.getHours(); 
    let i=new Date().getMonth(); 
    this.month=this.monthsArray[i];  
    this.year=this.library.getCurrentYear(); 
    
    this.getDaysInAMonth();
    this.getMinutes();
    this.getAdminDetailsById(this.authToken, this.adminId);
    this.createAllViewersList(this.authToken);
  } 

  ngOnDestroy() {///destroy page - when exited
    console.log("create-meeting component destroyed ");
  } 
//-----------------------------------functions to create meeting ------------------------------------------
//-------------------data validation and api call to create meeting ---------------------------------------
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
  //console.log(d); 
  return d;
}//end of function

//function - to create meeting
  public createMeeting=():void=>{                
      this.monthIndex=this.library.getMonthIndex(this.month);
      let mtgStartDate=this.library.prepareDate(this.year, this.monthIndex, this.day, this.starthour, this.startminutes);
      let mtgEndDate=this.library.prepareDate(this.year, this.monthIndex, this.day, this.endhour, this.endminutes);
      let currentDate=new Date();
      let obj=this.getMtgObject(); 
      //validate all form inputs
      this.errorMessage=this.library.validateInputs(obj);
      //to test - meeting date/time should not be prior to current time
      if(!this.errorMessage){
        this.errorMessage=this.library.validateDateInput(mtgStartDate, currentDate);
      } 
      //to test - end date/time should not be prior to meeting start time
      if(!this.errorMessage){
        this.errorMessage=this.library.validateDateInput(mtgEndDate, mtgStartDate);
      }   
    //create start and end time of meeting and then call socket service function to create meeting
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
          meetingVenue:this.meetingVenue,
          viewerList:this.getInvitees(this.viewerList)       
        }
        //console.log(data);
        //make socket call
        this.SocketService.createMeeting(data);      
        this.router.navigate(['/admin-dashboard/home']);
      }      
    }//end of function
  //-------------------------api call ----All viewers --------------------------------------------
  public getAdminDetailsById(authToken, adminId):any{
    this.appService.getAdminDetailsById(authToken, adminId).subscribe(
      apiResponse=>{
        this.adminDetails=apiResponse.data;
        this.adminDetails.invited=true;
        console.log(this.adminDetails);
      }, error=>{  // showing error message
          let errorMessage=error.error.message;
          let errorCode=error.status;
          this.router.navigate(['/error', errorCode, errorMessage]);
      }
    )
  }
  //get list of all viewers  
  public createAllViewersList(authToken):any{     
    this.appService.getViewerList(authToken).subscribe(
      apiResponse=>{        
        this.viewerList=apiResponse.data;         
        this.viewerList=this.addInvitedBoolean(this.viewerList); 
        //console.log(this.viewerList);      
      }, error=>{   // showing error message          
        if(error.error.message){            
          let errorMessage=error.error.message;
          let errorCode=error.status;
          this.router.navigate(['/error', errorCode, errorMessage]);
         } else {            
          //this.toastr.error(error.message);
         }        
      }) //subscribe method ended 
  }  
  //----------------------- functions for invitations - all or select-------------------------
  //We get all users list via api call - this function adds invited property and sets it false
  public addInvitedBoolean=(list)=>{
    for(let item=0; item<list.length; item++){
       list[item].invited=false;
    }
    return list
  }
  //when invite-all is clicked - this function called
  public getListOfAllUsers=()=>{    
    this.allSelected=true;
    this.someSelected=false;  
    this.inviteeFlag="all"; 
    console.log(this.inviteeFlag);   
  }
  //when Select Invitees Modal save button is clicked - this function called
  public setFlagSelect=()=>{    
    this.inviteeFlag="select";
    console.log(this.inviteeFlag);
  }
  //when Select Invitees is clicked - this function  sets initial value of all check boxes false
  public deselectCheckBoxes=()=>{
    this.allSelected=false;
    this.someSelected=true;
    for(let j=0; j< this.viewerList.length; j++){
      this.viewerList[j].invited=false;
    }   
 }  

//This function will --------
//1.  if flag "select" -prune the viewerList and keep users who have invited property set as true
// 2. if flag "all" -will set  invited property set as true of all users
 public getInvitees=(list)=>{
  //let newArr=[];
  //console.log(list);
  if(this.inviteeFlag === "select"){
    for(let i=0; i<list.length; i++){
      if(list[i].invited===false){
        list.splice(i, 1);
        i--;
      }//if ended
    }//for loop ended
  } //if ended
  else { //in any other case - all users invitee
    for(let j=0; j<list.length; j++){
      list[j].invited=true;
   }//for loop ended
  } //else ended 
  
  list.push(this.adminDetails);
 console.log(list);
 return list
}
//---------------------------Some utility functions----------------------------------------------
  public getMinutes=()=>{ //get minutes array    
    this.minutesArr=this.library.getMinutes();    
  }

  public getDaysInAMonth=()=>{//get days array
    this.days=this.library.getDaysInAMonth(this.month);
  }  
  //-----------------------------------------------------------------------------------------------------------

}

  
  