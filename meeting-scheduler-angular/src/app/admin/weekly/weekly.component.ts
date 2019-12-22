//import angular packages
import { Component,Input, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
//import user defined services
import {AppService} from './../../app.service';
import {MeetingService} from './../../meeting.service';
import {LibraryService} from './../../library.service';
import {CalendarService}from './../../calendar.service';
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-weekly',
  templateUrl: './weekly.component.html',
  styleUrls: ['./weekly.component.css']
})
export class WeeklyComponent implements OnInit, OnDestroy {
  @Input() userID:string;//to get from parent component
  public authToken:String; //to send with api call  

  public date:number=new Date().getDate(); //current date  
  public monthIndex:number=new Date().getMonth(); //index position of current month  
  public month:string;//month name  
  public weekIndex:any;//index position of week in calendar
   
  public currentDate:Number=new Date().getDate();//current date
  public currentMonth:string;
  public selectedDate:Number=1;
  public year:String='2019'; //constant value
//to hold dates/months  of week
  public startDate:number;//start date of week
  public startDateMonth:string;//month of start date
  public endDate:number;//end date of week
  public endDateMonth:string;//month of end date
//some array declarations
  public meetingArray:any=[];//array of all meetings
  public dailyCalendar:any=[];//daily calendar
  public weeklyCalendar:any=[];//weekly calendar
  public weeklyArr:any=[];
  public mtgData:any=[];//array to hold meeting info to display
  public mtgsOfSelectedDate:any=[];
  public months:any=[];//array to hold month name
  public datesArray:any=[];//array to hold day and dates
  public currentWeek:any=[];//array to hold current/selected week info
  
  public hours:any=[];//will hold array of 24b hours
  public days=[];//will hold array of week days 

  constructor(    
    private router:Router,
    //service instances
    private meetingService:MeetingService,
    private appService:AppService,
    private library:LibraryService,
    private calendar:CalendarService,
    private toastr:ToastrService 
  ) {}

  ngOnInit() {
    this.authToken=(this.appService.getUserInfoFromLocalstorage()).authToken;
    
    this.months=this.library.getMonths();   //populating with month names 
    this.hours=this.library.getHours(); //populating with hours 0-23
    this.days=this.library.getWeekDays(); //population with week days
    this.month=this.months[this.monthIndex]; //month name on given index position
    let tempIndex=new Date().getMonth();
    this.currentMonth=this.months[tempIndex];
    console.log(this.currentDate+" : "+this.currentMonth);
    
    //api call to get monthly calendar
    this.getSingleViewerMeetings(this.authToken, this.userID);
  }

  ngOnDestroy() {
    console.log("month component destroyed");
  }

  public getSingleViewerMeetings(authToken, userId):any{    
    this.meetingService.getSingleViewerMeetings(authToken, userId).subscribe(
      apiResponse=>{
        if(apiResponse.status===200){        
        this.meetingArray=apiResponse.data;        
        this.dailyCalendar=this.calendar.getDailyCalendar(); //to get date wise calendar of year       
        this.dailyCalendar=this.calendar.create371Objects(this.dailyCalendar);
        this.weeklyCalendar=this.calendar.make53Weeks(this.dailyCalendar); 
        this.currentWeek=this.calendar.findCurrentWeek(this.date, this.month, this.weeklyCalendar);  
        this.weekIndex=this.currentWeek.weekIndex;
        this.weeklyArr=this.calendar.make24Objects(this.currentWeek);
        this.currentWeek=this.calendar.fillMeetingData(this.meetingArray, this.weeklyArr);
        console.log(this.currentWeek);
        this.startDate=this.currentWeek[0].weekObj[0].date ;
        this.startDateMonth=this.currentWeek[0].weekObj[0].month ;
        this.endDate= this.currentWeek[0].weekObj[6].date   ;
        this.endDateMonth=this.currentWeek[0].weekObj[6].month;
        this.datesArray=this.currentWeek[0].weekObj;
      }else {
        let errorCode = apiResponse.status;
        let errorMessage = apiResponse.message;
        this.router.navigate(['/error', errorCode, errorMessage]);
      }               
    }, (error)=>{
      console.log(error);
      if(error.error.message){            
        let errorMessage=error.error.message;
        let errorCode=error.status;
        this.router.navigate(['/error', errorCode, errorMessage]);
       } else {            
        this.toastr.error(error.message);
       }
    }
  ) 
  }

  public showMeeting(mtgId){    
    this.router.navigate(['/admin-dashboard/single-meeting', mtgId]);
  } 
//---------------------These two functions will work with side arrow keys of page-----------------------------
public getPreviousWeek():any{
  this.weekIndex--;
  if(this.weekIndex <= 0){
    this.weekIndex=0;
    this.currentWeek=this.weeklyCalendar[this.weekIndex];  
    this.weekIndex=this.currentWeek.weekIndex;
    this.startDate=1 ;
    this.startDateMonth=this.currentWeek.weekArr[0].month ;
    this.endDate= this.currentWeek.weekArr[6].date    ;
    this.endDateMonth=this.currentWeek.weekArr[6].month    ;
  } else {
    this.currentWeek=this.weeklyCalendar[this.weekIndex];  
    this.weekIndex=this.currentWeek.weekIndex;
    this.startDate=this.currentWeek.weekArr[0].date ;
    this.startDateMonth=this.currentWeek.weekArr[0].month ;
    this.endDate= this.currentWeek.weekArr[6].date    ;
    this.endDateMonth=this.currentWeek.weekArr[6].month ;
  }
  
  this.weeklyArr=this.calendar.make24Objects(this.currentWeek);
  this.currentWeek=this.calendar.fillMeetingData(this.meetingArray, this.weeklyArr);
  this.datesArray=this.currentWeek[0].weekObj;  
}

public getNextWeek():any{
  this.weekIndex++;
  if(this.weekIndex >= 52){
    this.weekIndex=52;
    this.currentWeek=this.weeklyCalendar[this.weekIndex];  
    this.weekIndex=this.currentWeek.weekIndex;
    this.startDate=this.currentWeek.weekArr[0].date ;
    this.startDateMonth=this.currentWeek.weekArr[0].month ;
    this.endDate=31  ;
    this.endDateMonth=this.startDateMonth   ;
  } else {
    this.currentWeek=this.weeklyCalendar[this.weekIndex];  
    this.weekIndex=this.currentWeek.weekIndex;
    this.startDate=this.currentWeek.weekArr[0].date ;
    this.startDateMonth=this.currentWeek.weekArr[0].month ;
    this.endDate= this.currentWeek.weekArr[6].date    ;
    this.endDateMonth=this.currentWeek.weekArr[6].month    ;
  }
  
  this.weeklyArr=this.calendar.make24Objects(this.currentWeek);
  this.currentWeek=this.calendar.fillMeetingData(this.meetingArray, this.weeklyArr);
  this.datesArray=this.currentWeek[0].weekObj;  
}
//-------------------------------------------------------------------------
//----------------------------------------------------------------------------
//display meeting of selected date - when a date cell of calendar is clicked 
public  displayMeetingsOfSelectedDate(dt){
  console.log(dt);
  this.selectedDate=dt;
  console.log(this.selectedDate,  this.month, this.year, this.userID);
  this.router.navigate(['admin-dashboard/single-date', this.selectedDate,  this.month, this.year, this.userID]);      
}
//------------------------------------------------------------------------------------------------------------

}