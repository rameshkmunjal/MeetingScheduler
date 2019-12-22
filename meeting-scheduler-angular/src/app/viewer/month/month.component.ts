//import angular packages
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
///import customised services
import {AppService} from './../../app.service';
import {MeetingService} from './../../meeting.service';
import {LibraryService} from './../../library.service';
import {CalendarService} from './../../calendar.service';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.css']
})
export class MonthComponent implements OnInit, OnDestroy {
  @Input() userID:string;
  public authToken:String; //to send with api call
  
  public monthIndex:number=new Date().getMonth(); 
  public currentMonth:string;//current month
  public month:string; //month name    
  public currentDate:Number=new Date().getDate();//current date 
  public year:String='2019'; //constant value
  public selectedDate:number=1;

  public meetingArray:any=[]; //holding all meetings 
  public monthlyCalendar:any=[];//calendar of a month
  public mtgData:any=[];//mtg data to display
  public monthArray:any=[];//will hold array of month names
  public hours:any=[];//will hold array of 24b hours
  
  constructor( 
    private _route:ActivatedRoute,   
    private router:Router,
    private meetingService:MeetingService,
    private appService:AppService,
    private library:LibraryService,
    private calendar:CalendarService 
  ) {}

  ngOnInit() {    
    this.authToken=(this.appService.getUserInfoFromLocalstorage()).authToken;
    this.monthArray=this.library.getMonths();
    this.hours=this.library.getHours();
    this.month=this.library.getMonthName(this.monthIndex);
    this.currentMonth=this.library.getMonthName(this.monthIndex);
    //api call to get monthly calendar
    this.getSingleViewerMeetings(this.authToken, this.userID);
  }

  ngOnDestroy() {
    console.log("month component destroyed");
  }

  public getSingleViewerMeetings(authToken, userId):any{
    this.meetingService.getSingleViewerMeetings(authToken, userId).subscribe(
      apiResponse=>{        
        this.meetingArray=apiResponse.data;
        this.monthlyCalendar=this.calendar.getMonthlyCalendar(); ///to get date wise calendar of year       
        let temp=this.calendar.getSelectedMonthCalendar(this.monthlyCalendar,  this.monthIndex);//to get particular date calendar
        this.monthIndex=temp.index;
        let monthArr=temp.monthArr;        
        this.mtgData=this.calendar.feedMeetingData(this.meetingArray, monthArr);
        this.mtgData=this.calendar.make35Boxes(this.mtgData);
        this.mtgData=this.calendar.make5Weeks(this.mtgData); 
      }, (error)=>{
        console.log(error);
      }
    )
  }  
//------------------------------------------------------------------------------------------------------------
  //When left arrow is clicked
  public getPreviousMonth(){    
    this.monthIndex--;//decrease index value
    if(this.monthIndex < 0){
      this.monthIndex=0;//no further decrease - first value is o
    }
    this.monthlyCalendar=this.calendar.getMonthlyCalendar();     
    let temp=this.calendar.getSelectedMonthCalendar(this.monthlyCalendar,  this.monthIndex);//to get particular date calendar
    this.monthIndex=temp.index;
    let monthArr=temp.monthArr; 
    this.month=this.monthArray[this.monthIndex];       
    this.mtgData=this.calendar.feedMeetingData(this.meetingArray, monthArr);
    this.mtgData=this.calendar.make35Boxes(this.mtgData);
    this.mtgData=this.calendar.make5Weeks(this.mtgData); 
 }

//When right arrow is clicked
  public getNextMonth(){    
    this.monthIndex++;//increate index value of month
    if(this.monthIndex > 11){
      this.monthIndex=11; //no increase allowed - last value is 11
    }
    this.monthlyCalendar=this.calendar.getMonthlyCalendar();
    let temp=this.calendar.getSelectedMonthCalendar(this.monthlyCalendar,  this.monthIndex);    
    this.monthIndex=temp.index;
    let monthArr=temp.monthArr; 
    this.month=this.monthArray[this.monthIndex];       
    this.mtgData=this.calendar.feedMeetingData(this.meetingArray, monthArr);    
    this.mtgData=this.calendar.make35Boxes(this.mtgData);    
    this.mtgData=this.calendar.make5Weeks(this.mtgData);            
  }

//----------------------------------------------------------------------------
//display meeting of selected date - when a date cell of calendar is clicked 
public  displayMeetingsOfSelectedDate(dt){
  console.log(dt);
  this.selectedDate=dt;
  console.log(this.selectedDate,  this.month, this.year, this.userID);
  this.router.navigate(['/single-day', this.selectedDate,  this.month, this.year, this.userID]);      
}
  //---------------------------------------------------------------------------------  
  //class definition ended 
}

