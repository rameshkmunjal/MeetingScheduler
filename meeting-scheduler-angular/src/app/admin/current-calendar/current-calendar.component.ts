//including angular packages
import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
//including user definded services
import {AppService} from './../../app.service';
import {MeetingService} from './../../meeting.service';
import {LibraryService} from './../../library.service';
import {CalendarService} from './../../calendar.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-current-calendar',
  templateUrl: './current-calendar.component.html',
  styleUrls: ['./current-calendar.component.css']
})

export class CurrentCalendarComponent implements OnInit, OnDestroy {
  public authToken:String; //to send with api call
  public userId:String;
  //some variables declared
  public monthIndex:number=new Date().getMonth(); 
  public currentMonth:string;//to hold current month name
  public month:string; //to hold month name 
  public monthNumber:Number;// to hold index value of month
  public year:String='2019'; 
  //public selectedDate:number=1;  
  public currentDate:Number=new Date().getDate();
  //declaring arrays
  public meetingArray:any=[];//to hold all meetings data
  public monthlyCalendar:any=[];//to hold monthly calendar format
  public mtgData:any=[];//to hold meeting data   
  public monthArray:any=[];//will hold array of month names
  public hours:any=[];//will hold array of 24b hours
  

  constructor(
    private _route:ActivatedRoute,
    private router:Router,
    //instances of services
    private meetingService:MeetingService,
    private appService:AppService,
    private library:LibraryService,
    private calendar:CalendarService,
    private toastr:ToastrService
  ) {}

  ngOnInit() {
    //authToken to get from localStorage    
    this.authToken=(this.appService.getUserInfoFromLocalstorage()).authToken;
    this.userId=this._route.snapshot.paramMap.get('viewerId');//obtaining from active route

    this.monthArray=this.library.getMonths();//to house array with month values
    this.hours=this.library.getHours();//to house array with hours 0-23
    this.month=this.library.getMonthName(this.monthIndex);//month name as per index value
    this.currentMonth=this.library.getMonthName(this.monthIndex);
    //api call to get monthly calendar as per normal viewer id
    this.getSingleViewerMeetings(this.authToken, this.userId);
  }

  ngOnDestroy() {
    console.log("month component destroyed");
  }

  public getSingleViewerMeetings(authToken, userId):any{
    //api call
    this.meetingService.getSingleViewerMeetings(authToken, userId).subscribe(
      apiResponse=>{ 
        if(apiResponse.status===200){
          this.meetingArray=apiResponse.data;        
          this.monthlyCalendar=this.calendar.getMonthlyCalendar(); //to get month wise calendar of year 
          let temp=this.calendar.getSelectedMonthCalendar(this.monthlyCalendar,  this.monthIndex);//to get particular date calendar        
          this.monthIndex=temp.index;        
          let monthArr=temp.monthArr;        
          this.mtgData=this.calendar.feedMeetingData(this.meetingArray, monthArr);        
          this.mtgData=this.calendar.make35Boxes(this.mtgData);        
          this.mtgData=this.calendar.make5Weeks(this.mtgData); 
        } else {
          let errorCode = apiResponse.status;
          let errorMessage = apiResponse.message;
          this.router.navigate(['/error', errorCode, errorMessage]);
        }  
      }, (error)=>{
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
  //---------------------------------------------------------------------------
  //display meeting  - when a mtg in cell is clicked - make updation or deletion
  public showMeeting(meetingId){         
      this.router.navigate(['admin-dashboard/single-meeting', meetingId]);
  }
  //display create meeting form - when cell is clicked any where
  public createMeeting(){
      this.router.navigate(['/admin-dashboard/create']);
  }
//---------------------------------------------------------------------------------  
  //class definition ended 
}

