//import angular packages
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

//import user defined services
import {AppService} from './../../app.service';
import {MeetingService} from './../../meeting.service';
import {SocketService} from './../../socket.service';
import {LibraryService} from './../../library.service';

import {ToastrService} from 'ngx-toastr';

//import jquery - for animation effects
import * as $ from 'jquery';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})

export class AdminDashboardComponent implements OnInit {
  public authToken:String;//to send in api call
  public userId:String;//to send in api call
  public fullName:String;//to show in nav header 
  public errorMessage:String;//error message to show  
  public errorCode:String;
//meeting related arrays
  public mtgData:any=[];//array of meetings
  public mtg:any=[];  
  public meetingList:any=[];//array of all meetings
  public todayMeetings:any=[];//array of today meetings
  public upcomingMeetings:any=[];//array of upcoming meetings
//some other variables  
  public mtgDate:String;//to hold mtg date when formatted
  public year:number=2019;//remains unchanged
  public monthName:string;//name of month
  public monthNumber:number;//index position of month  
  public day:number; 

  constructor(//creating instances
    private router:Router ,
    private appService:AppService,     
    private meetingService:MeetingService,      
    private socketService:SocketService,
    private library:LibraryService ,
    private toastr:ToastrService  
  ) { }

  ngOnInit() {   //when the page is loaded 
      this.authToken=this.appService.getUserInfoFromLocalstorage().authToken;
      this.userId=this.appService.getUserInfoFromLocalstorage().userId;
      this.fullName=this.appService.getUserInfoFromLocalstorage().fullName;
      
      this.monthNumber=new Date().getMonth();//current month index position
      this.monthName=this.library.getMonthName(this.monthNumber); //get current month name
      this.day=new Date().getDate();//get today date 
      //function calls      
      this.getAllMeetings(this.authToken); 
      this.getNewMeetingMessage(this.authToken); 
      this.showAlertsB4OneMinute();  
         
  }

  public getAllMeetings=(authToken)=>{
    this.meetingService.getAllMeetings(authToken).subscribe(
      apiResponse=>{
        
        this.meetingList=apiResponse.data;//list of all meetings         
        this.todayMeetings=this.getMeetingsOfGivenDate(this.meetingList, this.day, this.monthNumber, this.year);
        
        if(this.todayMeetings !== undefined){
          for(let i=0 ; i < this.todayMeetings.length; i++){
            let m=this.todayMeetings[i];
            let mtgTimeInSeconds =new Date(m.mtgStartDate).getTime()/1000;                        
            let currentTimeInSeconds= new Date().getTime()/1000;            
            let alertTimeInSeconds=Math.floor((mtgTimeInSeconds-60)-currentTimeInSeconds);
            this.getAlerts(m, this.socketService, alertTimeInSeconds);            
          }          
          this.errorMessage="";                      
        } else{
          this.errorMessage="There is no upcoming meeting today";
        }
                   
      }, (error)=>{         
          if(error.error.message){            
            this.errorMessage=error.error.message;
            this.errorCode=error.status;
            this.router.navigate(['/error', this.errorCode, this.errorMessage]);
           } else {           
            this.toastr.error(error.message);
           }
      }
    ) 
  }
//filter meetings from mtg data - when date. month and year given
  public getMeetingsOfGivenDate(mtgList, day, monthNumber, year):any{       
    
        let mtgArr=mtgList.filter(function(some){          
          return new Date(some.mtgStartDate).getDate()==day &&
                 new  Date(some.mtgStartDate).getMonth()==monthNumber &&
                 new Date(some.mtgStartDate).getFullYear()==year;
        }); 
        
        return mtgArr;    
  }  

//-------------------------------------------------------------------------------------------------
//when a new meeting is created - handle socket event
public getNewMeetingMessage(authToken):any{
  this.socketService.getNewMeetingMessage().subscribe(
    apiResponse=>{      
      this.mtgData=apiResponse;            
      this.mtgDate=this.library.formatDate(this.mtgData.mtgStartDate);
      $('#msg-box').fadeIn(2000).delay(10000).fadeOut(2000);
      this.getAllMeetings(authToken);
      this.showAlertsB4OneMinute(); 
    }
  );
  
}
//---------------------------------------------------------------------------------------------------------- 

//when one minute remaining to a meeting - get alert
public getAlerts(mtg, ss, seconds):any{   
  if(seconds > 0){
    let pause = seconds * 1000;   
    setTimeout(function(){      
      ss.getAlerts(mtg);
    }, pause);
  }       
}
//show alerts when one minute is remaining to a meeting
public showAlertsB4OneMinute():any{  
  this.socketService.showAlertsB4OneMinute().subscribe(
    apiResponse=>{     
      this.mtg=apiResponse;      
      this.mtgDate=this.library.formatDate(this.mtg.mtgStartDate);      
      $('#alert-box').fadeIn(300); 
    }
  );
}
//when cancel button is clicked on alert on page
public cancelAlerts():any{  
  $("#alert-box").fadeOut(300);
}
//when snooze button is clicked on alert on page
public snoozeAlerts(mtg):any{
  $("#alert-box").fadeOut(300);
  let ss=this.socketService;
  
  setTimeout(function(){    
    ss.getAlerts(mtg);
  }, 5000); 
}
//---------------------------------------------------------------------------------------
}//class definition ended
