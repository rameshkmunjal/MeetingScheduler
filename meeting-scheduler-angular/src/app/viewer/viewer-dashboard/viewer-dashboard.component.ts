import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetingService} from './../../meeting.service';
import {SocketService} from './../../socket.service';
import {LibraryService} from './../../library.service';
//import user defined services
import {AppService} from './../../app.service';

//import jquery
import * as $ from 'jquery';

@Component({
  selector: 'app-viewer-dashboard',
  templateUrl: './viewer-dashboard.component.html',
  styleUrls: ['./viewer-dashboard.component.css']
})

export class ViewerDashboardComponent implements OnInit, OnDestroy {
  public periodSelected:string='month';

  public authToken:string;
  public userId:string;

  public fullName:string; 

  public mtgData:any=[];//array of meetings
  public mtg:any=[];
  public mtgDate:String;//to hold mtg date when formatted
  public meetingList:any=[];//array of all meetings
  public todayMeetings:any=[];//array of today meetings

  public errorMessage:String;//error message to show 

  public year:number;//remains unchanged
  public monthName:string;//name of month
  public monthNumber:number;//index position of month  
  public day:number; 

  

  constructor(
    private appService:AppService, 
    private _route:ActivatedRoute,
    private router:Router,
    private meetingService:MeetingService,
    private socketService:SocketService,
    private library:LibraryService
    ){ }

  ngOnInit(){
      this.authToken=this.appService.getUserInfoFromLocalstorage().authToken;
      this.userId=this._route.snapshot.paramMap.get('userId');          
      this.fullName=this.appService.getUserInfoFromLocalstorage().fullName;

      this.monthNumber=new Date().getMonth();//current month index position
      this.monthName=this.library.getMonthName(this.monthNumber); //get current month name
      this.day=new Date().getDate();//get today date 
      this.year=Number(this.library.getCurrentYear());
      //socket calls       
      this.checkStatus();    
      this.verifyUserConfirmation();
      this.getOnlineUserList(); 
      this.showAlertsB4OneMinute();
      //function calls - meeting related      
      this.getAllMeetings(this.authToken); 
      this.getNewMeetingMessage(this.authToken);
      
  }

  ngOnDestroy(){
    console.log("viewer-dashboard component destroyed");
  }

  onNavigate(period){
    this.periodSelected=period;
  }

  //--------------------------------------------------------------------------------------
  public getAllMeetings=(authToken)=>{
    this.meetingService.getAllMeetings(authToken).subscribe(
      apiResponse=>{
        console.log(apiResponse);
        this.meetingList=apiResponse.data;//list of all meetings
        console.log(this.meetingList); 
        this.todayMeetings=this.getMeetingsOfGivenDate(this.meetingList, this.day, this.monthNumber, this.year);
        console.log(this.todayMeetings);
        if(this.todayMeetings !== undefined){
          for(let i=0 ; i < this.todayMeetings.length; i++){
            let m=this.todayMeetings[i];
            let mtgTimeInSeconds =new Date(m.mtgStartDate).getTime()/1000;                        
            let currentTimeInSeconds= new Date().getTime()/1000;            
            let alertTimeInSeconds=Math.floor((mtgTimeInSeconds-60)-currentTimeInSeconds);
            console.log("alert time in seconds"+alertTimeInSeconds);            
            
            this.getAlerts(m, this.socketService, alertTimeInSeconds);            
          }          
          this.errorMessage="";                      
        } else{
          this.errorMessage="There is no upcoming meeting today";
        }
                   
      }, (err)=>{
        console.log(err);
      }
    ) 
  }
//filter meetings from mtg data - when date. month and year given
  public getMeetingsOfGivenDate(mtgList, day, monthNumber, year):any{       
    console.log(mtgList + " : "+ day+" : "+monthNumber+ " : "+ year);
    
        let mtgArr=mtgList.filter(function(some){
          
          return new Date(some.mtgStartDate).getDate()==day &&
                 new  Date(some.mtgStartDate).getMonth()==monthNumber &&
                 new Date(some.mtgStartDate).getFullYear()==year;
        }); 
        console.log(mtgArr);
        return mtgArr;    
  } 
  
//to navigate to  single viewer meetings - when name on page is clicked
  public getViewerMeetingList(viewerId){ 
      this.router.navigate(['/single-viewer', viewerId]);
  }  

//-------------------------------------------------------------------------------------------------
//---------------------------------Socket Related Functions------------------------------------------
  //if authToken is not given - navigate to login page - to prevent unauthorised login 
  public checkStatus():any{
    if(this.authToken===undefined || this.authToken===null || this.authToken===''){
      this.router.navigate(['/login']);
      return false;
    } else {
      return true;
    }
  }
  
  public verifyUserConfirmation():any{
    this.socketService.verifyUser()
        .subscribe(
          (data)=>{
            console.log(data);
            this.socketService.setUser(this.authToken);
          }, (err)=>{
            console.log(err);
          }
        )
  }
  //get list of online users
  public getOnlineUserList=():any=>{
    this.socketService.onlineUserList().subscribe(
      (data)=>{
        console.log(data);
      }
    )
  }
//when a new meeting is created - listen socket event
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
  console.log("get alerts event to fire after "+ seconds + " seconds");
  if(seconds > 0){
    let pause = seconds * 1000;   
    setTimeout(function(){
      console.log("get alert function fired");
      ss.getAlerts(mtg);
    }, pause);
  }       
}
//show alerts when one minute is remaining to a meeting
public showAlertsB4OneMinute():any{
  console.log("showAlertsB4OneMinute function");
  this.socketService.showAlertsB4OneMinute().subscribe(
    apiResponse=>{
      console.log(apiResponse);
      this.mtg=apiResponse;
      console.log(this.mtg);
      this.mtgDate=this.library.formatDate(this.mtg.mtgStartDate);
      console.log(this.mtgDate);
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
  console.log("snooze alerts called")
  setTimeout(function(){
    console.log("get alert : snooze alerts");
    ss.getAlerts(mtg);
  }, 5000); 
}
//---------------------------------------------------------------------------------------

}//class definition ended
