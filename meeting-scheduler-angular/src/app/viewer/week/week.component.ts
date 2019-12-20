//import angular packages
import { Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
//import customised services
import {AppService} from './../../app.service';
import {MeetingService} from './../../meeting.service';
import {LibraryService} from './../../library.service';
import {CalendarService} from './../../calendar.service';

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.css']
})
export class WeekComponent implements OnInit, OnDestroy {
  @Input() userID:string;
  public authToken:String; //to send with api call 

  public monthArray:any=[];//will hold array of month names
  public hours:any=[];//will hold array of 24b hours
  public days=[];//will hold array of week days
 
  public date:number=new Date().getDate(); 
  public currentWeek:any=[];
  public monthIndex:number=new Date().getMonth(); 
  public months=this.library.getMonths();
  public month:string;  
  public weekIndex:any;

  public startDate:number;
  public startDateMonth:string;
  public endDate:number;
  public endDateMonth:string;

  public meetingArray:any=[];
  public dailyCalendar:any=[];
  public weeklyCalendar:any=[];
  public weeklyArr:any=[]
  public mtgData:any=[];

  public selectedDate:number=1;  
  public currentDate:Number=new Date().getDate();

  public year:String='2019';  
  public mtgsOfSelectedDate:any=[];
  public datesArray:any=[];

  constructor(
    private _route:ActivatedRoute,
    private router:Router,
    private meetingService:MeetingService,
    private appService:AppService,
    private library:LibraryService,
    private calendar:CalendarService 
  ) { 
    
  }

  ngOnInit() {
    this.authToken=(this.appService.getUserInfoFromLocalstorage()).authToken;
    this.monthArray=this.library.getMonths();
    this.hours=this.library.getHours();
    this.days=this.library.getWeekDays();
    this.month=this.months[this.monthIndex];
    
    //api call to get monthly calendar
    this.getSingleViewerMeetings(this.authToken, this.userID);
  }

  ngOnDestroy() {
    console.log("month component destroyed");
  }

  public getSingleViewerMeetings(authToken, userId):any{
    console.log(userId);
    this.meetingService.getSingleViewerMeetings(authToken, userId).subscribe(
      apiResponse=>{        
        this.meetingArray=apiResponse.data;
        this.dailyCalendar=this.calendar.getDailyCalendar(); //to get date wise calendar of year         
        this.dailyCalendar=this.calendar.create371Objects(this.dailyCalendar);
        this.weeklyCalendar=this.calendar.make53Weeks(this.dailyCalendar); 
        this.currentWeek=this.calendar.findCurrentWeek(this.date, this.month, this.weeklyCalendar);  
        this.weekIndex=this.currentWeek.weekIndex;
        this.startDate=this.currentWeek.weekArr[0].date ;
        this.startDateMonth=this.currentWeek.weekArr[0].month ;
        this.endDate= this.currentWeek.weekArr[6].date    ;
        this.endDateMonth=this.currentWeek.weekArr[6].month    ;
        this.weeklyArr=this.calendar.make24Objects(this.currentWeek);
        this.currentWeek=this.calendar.fillMeetingData(this.meetingArray, this.weeklyArr);
        this.datesArray=this.currentWeek[0].weekObj;
      }, (err)=>{
        console.log(err);
      }
    )
  }

  
//--------------------These two functions will work with side arrow keys of page-----------------------------
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
    this.endDateMonth=this.currentWeek.weekArr[6].month    ;
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

}