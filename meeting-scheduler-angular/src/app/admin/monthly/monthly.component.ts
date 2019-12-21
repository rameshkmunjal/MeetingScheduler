//importing angular packages
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
//importing user defined services
import {AppService} from './../../app.service';
import {MeetingService} from './../../meeting.service';
import {LibraryService} from './../../library.service';
import {CalendarService} from './../../calendar.service';
import {ToastrService} from 'ngx-toastr';
import { createEmptyStateSnapshot } from '@angular/router/src/router_state';

@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.css']
})
export class MonthlyComponent implements OnInit, OnDestroy {
  public authToken:String; //to send with api call
  @Input() userID:String;//to get input from parent component

  public monthArray:any=[];//will hold array of month names
  public hours:any=[];//will hold array of 24b hours
  public weekDaysArray=[];//will hold array of week days
  
  public monthIndex:number=new Date().getMonth(); //current month index
  public currentMonth:string;//current month object
  public month:string;  //to hold month name  
//some array declaration
  public meetingArray:any=[];//to hold all meetings
  public monthlyCalendar:any=[];//to hold monthly calendar - array of date objects
  public mtgData:any=[];//meeting data to display 

  public selectedDate:number=1; //to hold date selected 
  public currentDate:Number=new Date().getDate();//current date to highlight
  public year:String='2019';  //a constant

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
    this.monthArray=this.library.getMonths();//array of months -created
    this.hours=this.library.getHours();//array of hours - created
    this.month=this.library.getMonthName(this.monthIndex);//month name as per index
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
        if(apiResponse.status===200){        
        this.meetingArray=apiResponse.data;
        this.monthlyCalendar=this.calendar.getMonthlyCalendar(); //to get month wise calendar of year
        console.log(this.monthlyCalendar);
        let temp=this.calendar.getSelectedMonthCalendar(this.monthlyCalendar,  this.monthIndex);//to get particular date calendar
        this.monthIndex=temp.index;        
        let monthArr=temp.monthArr;        
        this.mtgData=this.calendar.feedMeetingData(this.meetingArray, monthArr); 
        console.log(this.mtgData);       
        this.mtgData=this.calendar.make35Boxes(this.mtgData);        
        this.mtgData=this.calendar.make5Weeks(this.mtgData);                       
      } else {        
        this.toastr.error(apiResponse.message);
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
    })
  }
  
  //----------------------------------------------------------------------------
//display meeting of selected date - when a date cell of calendar is clicked 
public  displayMeetingsOfSelectedDate(dt){
  console.log(dt);
  this.selectedDate=dt;
  console.log(this.selectedDate,  this.month, this.year, this.userID);
  this.router.navigate(['admin-dashboard/single-date', this.selectedDate,  this.month, this.year, this.userID]);      
}
//------------------------------------------------------------------------------------------------------------
  //When left arrow is clicked
  public getPreviousMonth(){    
    this.monthIndex--;
    if(this.monthIndex < 0){
      this.monthIndex=0;       
    }  
      this.monthlyCalendar=this.calendar.getMonthlyCalendar(); //to get month wise calendar of year
      console.log(this.monthlyCalendar);
      let temp=this.calendar.getSelectedMonthCalendar(this.monthlyCalendar,  this.monthIndex);//to get particular date calendar
      this.monthIndex=temp.index;
      let monthArr=temp.monthArr; 
      this.month=temp.monthArr[10].month;
      console.log(monthArr);       
      this.mtgData=this.calendar.feedMeetingData(this.meetingArray, monthArr);
      this.mtgData=this.calendar.make35Boxes(this.mtgData);
      this.mtgData=this.calendar.make5Weeks(this.mtgData); 
      console.log(this.monthlyCalendar);
  }

//When right arrow is clicked
  public getNextMonth(){    
    this.monthIndex++;    
    if(this.monthIndex > 11){
      this.monthIndex=11;      
    } 
      this.monthlyCalendar=this.calendar.getMonthlyCalendar(); //to get month wise calendar of year
      console.log(this.monthlyCalendar);
      let temp=this.calendar.getSelectedMonthCalendar(this.monthlyCalendar,  this.monthIndex);//to get particular date calendar
      this.monthIndex=temp.index;
      let monthArr=temp.monthArr;
      this.month=temp.monthArr[10].month;
      console.log(this.meetingArray);
      console.log(monthArr);       
      this.mtgData=this.calendar.feedMeetingData(this.meetingArray, monthArr);
      console.log(this.mtgData);
      this.mtgData=this.calendar.make35Boxes(this.mtgData);
      this.mtgData=this.calendar.make5Weeks(this.mtgData); 
  }

//function to single meeting details - when a meeting clicked
  public showMeeting(mtgId){    
    this.router.navigate(['/admin-dashboard/single-meeting', mtgId]);    
  }
//---------------------------------------------------------------------------------  
  //class definition ended 
}
