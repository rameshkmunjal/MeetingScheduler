//import angular packages
import { Component, Input,  OnInit, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
//import user defined services
import {LibraryService} from './../../library.service';
import {MeetingService} from './../../meeting.service';
import {AppService} from './../../app.service';
import {CalendarService} from './../../calendar.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit, OnDestroy {
  @Input() userID:string;//to get from parent component - data-binding
  public authToken:string;//to use in api call 

  public year:number=2019;//constant value
  public monthNumber:any;//month index position
  public month:string;//month name  
  public date:number;//date of the day
  public dayNumber:any;//day index position

  public months:any=[];//array of month names
  public mtgData:any=[];//mtg info array
  public meetingArray:any=[];//all meetings data

  public dailyCalendar:any;//calendar object
  

  constructor(
    private router:Router,
    //service instances
    private appService:AppService,    
    private meetingService:MeetingService,
    private library:LibraryService,
    private calendar:CalendarService,
    private toastr:ToastrService
  ){}

  ngOnInit(){    
    this.authToken=(this.appService.getUserInfoFromLocalstorage()).authToken;    
    this.date=new Date().getDate();//current date
    this.monthNumber=new Date().getMonth();//current month index position
    this.months=this.library.getMonths();//months array
    this.month=this.months[this.monthNumber];//month name obtained
    
    this.getSingleViewerMeetings(this.authToken, this.userID);//api call    
  }

  ngOnDestroy(){
    console.log("weekly component destroyed");
  }
//function - to get meetings of a single user - using his user id
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
  
  //--------------------------------------------------------------------------
  public getPreviousDay():any{
    this.dayNumber--;    //day number - index position 
    if(this.dayNumber <= 0){
      this.dayNumber=0;
    }
    let temp=this.calendar.getDayObj(this.dayNumber);    
    this.date=temp.date;
    this.month=temp.month;
    let tempCal=this.calendar.add24Objects(temp);    
    this.mtgData=this.calendar.appendMeetingData(this.meetingArray, tempCal);       
  }

  public getNextDay():any{
    this.dayNumber++;    
    this.date++;
    if(this.dayNumber >= 364){
      this.dayNumber=364;
    }
    let temp=this.calendar.getDayObj(this.dayNumber);    
    this.date=temp.date;
    this.month=temp.month;
    let tempCal=this.calendar.add24Objects(temp);    
    this.mtgData=this.calendar.appendMeetingData(this.meetingArray, tempCal);    
  }

//-----------------------------------------------------------------------------------------------------------
}

