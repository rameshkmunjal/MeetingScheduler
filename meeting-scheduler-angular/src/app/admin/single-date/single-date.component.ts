//import npm packages
import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common';
//import user defined services
import {MeetingService} from './../../meeting.service';
import {AppService} from './../../app.service';
import {LibraryService} from './../../library.service';
import {CalendarService} from './../../calendar.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-single-date',
  templateUrl: './single-date.component.html',
  styleUrls: ['./single-date.component.css']
})

export class SingleDateComponent implements OnInit, OnDestroy {
  public userId:string;  //to get from route
  public authToken:string;//to get from  localStorage
  public months:any=[];//to hold months of year
  public year:string;//to hold year
  public monthNumber:any;//to hold month index
  public month:string;//to hold month
  public day:string;//to hold day
  public date:number;//to hold date
  public dayNumber:any;//to hold day index 
  //arrays declared
  public mtgData:any=[];//mtg data to display
  public meetingArray:any=[];//to hold all meetings

  public dailyCalendar:any;//day object of meetings 24-hours format
  

  constructor(
    private location:Location,
    private _route:ActivatedRoute,
    private router:Router,  
    //service instances  
    private appService:AppService,
    private meetingService:MeetingService,
    private library:LibraryService,
    private calendar:CalendarService,
    private toastr:ToastrService
  ){}

  ngOnInit(){    
    this.userId=this._route.snapshot.paramMap.get('userId'); 
    this.authToken=(this.appService.getUserInfoFromLocalstorage()).authToken;    
    this.day=this._route.snapshot.paramMap.get('day');
    this.month=this._route.snapshot.paramMap.get('month');
    this.year=this._route.snapshot.paramMap.get('year');
    this.monthNumber=new Date().getMonth();
    this.months=this.library.getMonths();    
    this.date=Number(this.day);
    
    this.getSingleViewerMeetings(this.authToken, this.userId);
    
  }

  ngOnDestroy(){
    console.log("weekly component destroyed");
  }
//---
  public getSingleViewerMeetings(authToken, userId):any{
    this.meetingService.getSingleViewerMeetings(authToken, userId).subscribe(
      apiResponse=>{
        console.log(apiResponse); 
        if(apiResponse.status===200){
          this.meetingArray=apiResponse.data;
          this.dailyCalendar=this.calendar.getDailyCalendar(); //to  get date wise calendar of year           
          let temp=this.calendar.getSelectedDayCalendar(this.dailyCalendar, this.date, this.month);//to get particular date calendar
          this.dayNumber=temp.dayIndex; 
          let tempCal=this.calendar.add24Objects(temp);
          this.mtgData=this.calendar.appendMeetingData(this.meetingArray, tempCal);
        } else {
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
  
  //----function to go to previous page--------------------
  public goBack(){
    this.location.back();
  }

//-----------------------------------------------------------------------------------------------------------
  
}
