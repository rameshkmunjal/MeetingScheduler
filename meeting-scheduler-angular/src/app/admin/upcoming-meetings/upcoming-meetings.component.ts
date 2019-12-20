//importing angular packages
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
//import user defined services
import {MeetingService} from './../../meeting.service';
import {AppService} from './../../app.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-upcoming-meetings',
  templateUrl: './upcoming-meetings.component.html',
  styleUrls: ['./upcoming-meetings.component.css']
})
export class UpcomingMeetingsComponent implements OnInit, OnDestroy {
  @Input() title:string;
  public authToken:String;//used in api calls
  
  public meetingList:any=[];//aray to stroe all meetings 
  public config:any; //object used in pagination

  constructor(
    private router:Router,
    private meetingService:MeetingService,
    private toastr:ToastrService,
    private appService:AppService
  ) { 
    this.config={
      itemsPerPage:5,
      currentPage:1,
      totalMtgs:this.meetingList.length
    }
  }

  ngOnInit() {
    this.authToken=(this.appService.getUserInfoFromLocalstorage()).authToken;    
    
    //getting all meetings - when page is loaded
    this.meetingService.getAllMeetings(this.authToken).subscribe(
      apiResponse=>{
        if(apiResponse.status===200){
          console.log(apiResponse);
          this.meetingList=apiResponse.data;
          console.log(this.meetingList);  
          //limiting data only to upcoming meetings
          this.meetingList=this.findForthcomingMeetings(this.meetingList);      
          //sorting meetings - in descending order - to last on top
          this.meetingList= this.sortMeetingDate(this.meetingList);        
          console.log(this.meetingList); 
        } else {
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
//destroy the page when left
  ngOnDestroy() {
    console.log("meeting-list component destroyed");
  }
//-----------------------------function defintions-----------------------------------------
//function - sorting meetings in descending order
  public sortMeetingDate(list){
    list.sort(function(a, b):any{          
      if(new Date(a.mtgStartDate) > new Date(b.mtgStartDate)){
        return 1;
      } else if(new Date(a.mtgStartDate)  < new Date(b.mtgStartDate)){
        return -1;
      } else {
        return 0;
      }      
    });
    return list;
  }
//function - only meeting after today should be shown
  public findForthcomingMeetings(list):any{    
   console.log(list);
      let currentDate=new Date();
      let mtgArr=list.filter(function(some){
          return  new Date(some.mtgStartDate) > currentDate;
      })
      return mtgArr;
  }

//when a meeting record is clicked - single meeting page should open
  public getSingleMeeting(meetingId){
    this.router.navigate(['admin-dashboard/single-meeting', meetingId]);
  }
//function to change page in pagination
  public pageChange(event){
    this.config.currentPage=event;
  }
  //--------------------------------------------------------------------------------  

}
