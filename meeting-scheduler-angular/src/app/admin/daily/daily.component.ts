//import angular packages
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
//import user defined services
import {LibraryService} from './../../library.service';
import {MeetingService} from './../../meeting.service';
import {AppService} from './../../app.service';
import {CalendarService} from './../../calendar.service';
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.css']
})

export class DailyComponent implements OnInit, OnDestroy {
  @Input() userID:string;
  public authToken:string;
  //var to hold calendar values
  public year:number=2019;
  public monthNumber:any;
  public month:string;
  public months:any=[];
  public date:number;
  public dayNumber:any;
  //meeting var
  public mtgData:any=[];//holding meeting data to display
  public meetingArray:any=[];//holding all meetings data
  //to hold daily calendar format
  public dailyCalendar:any;
  

  constructor(    
    private router:Router,
    //creating service instances   
    private appService:AppService,
    private meetingService:MeetingService,
    private library:LibraryService,
    private calendar:CalendarService,
    private toastr:ToastrService
  ){}

  ngOnInit(){    
    this.authToken=(this.appService.getUserInfoFromLocalstorage()).authToken;    
    this.date=new Date().getDate(); //current date
    this.monthNumber=new Date().getMonth();//current month index value
    this.months=this.library.getMonths();//array of month names
    this.month=this.months[this.monthNumber];//name of current month
    //getting meetings relating selected user
    this.getSingleViewerMeetings(this.authToken, this.userID);    
  }

  ngOnDestroy(){
    console.log("daily component destroyed");
  }

  public getSingleViewerMeetings(authToken, userId):any{
    this.meetingService.getSingleViewerMeetings(authToken, userId).subscribe(
      apiResponse=>{
        if(apiResponse.status===200){
          this.meetingArray=apiResponse.data;
          this.dailyCalendar=this.calendar.getDailyCalendar(); //to get date wise calendar of year
          let temp=this.calendar.getSelectedDayCalendar(this.dailyCalendar, this.date, this.month);//to get particular date calendar        
          this.dayNumber=temp.dayIndex; 
          let tempCal=this.calendar.add24Objects(temp);        
          this.mtgData=this.calendar.appendMeetingData(this.meetingArray, tempCal);
        }  else {
          console.log(apiResponse);
          this.toastr.error(apiResponse.message);
          let errorCode = apiResponse.status;
          let errorMessage = apiResponse.message;
          this.router.navigate(['/error', errorCode, errorMessage]);
        }                 
      }, (error)=>{
          console.log(error); 
          if(error.error.message){
            console.log(error);
            let errorMessage=error.error.message;
            let errorCode=error.status;
            this.router.navigate(['/error', errorCode, errorMessage]);
           } else {
            console.log(error.message);
            this.toastr.error(error.message);
           }
      }
    )
  }
  
  public showMeeting(mtgId){
    console.log("you want to show mtg with ID :"+mtgId);
    this.router.navigate(['/admin-dashboard/single-meeting', mtgId]);
  }
  //--------------------------------------------------------------------------
  public getPreviousDay():any{
    this.dayNumber--;
    console.log(this.dayNumber);
    if(this.dayNumber <= 0){
      this.dayNumber=0;
    }
    let temp=this.calendar.getDayObj(this.dayNumber);
    console.log(temp);
    this.date=temp.date;
    this.month=temp.month;
    let tempCal=this.calendar.add24Objects(temp);
    console.log(tempCal);
    this.mtgData=this.calendar.appendMeetingData(this.meetingArray, tempCal);
    console.log(this.mtgData);
    
  }
  public getNextDay():any{
    this.dayNumber++;
    console.log(this.dayNumber);
    this.date++;
    if(this.dayNumber >= 364){
      this.dayNumber=364;
    }
    let temp=this.calendar.getDayObj(this.dayNumber);
    console.log(temp);
    this.date=temp.date;
    this.month=temp.month;
    let tempCal=this.calendar.add24Objects(temp);
    console.log(tempCal);
    this.mtgData=this.calendar.appendMeetingData(this.meetingArray, tempCal);
    console.log(this.mtgData);
  }

//-----------------------------------------------------------------------------------------------------------
}
