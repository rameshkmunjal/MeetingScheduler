//import angular packages
import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common';
//import user defined services
import {MeetingService} from './../../meeting.service';
import {AppService} from './../../app.service';
import {LibraryService} from './../../library.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-single-meeting',
  templateUrl: './single-meeting.component.html',
  styleUrls: ['./single-meeting.component.css']
})

export class SingleMeetingComponent implements OnInit, OnDestroy {
  public authToken:String;//to send in api call
  
  public fullName:string;//to hold full name of admin
  public meetingId:String;//to get from route
  public mtgDate:String;//to hold formatted date
  //arrays declaration  
  public currentMeeting:any={};//object to hold current meeting object
 
  constructor(    
    private _route:ActivatedRoute,
    private router:Router,
    private location:Location,
    //service instances
    private appService : AppService,
    private meetingService:MeetingService,    
    private library:LibraryService,
    private toastr:ToastrService
  ) { }

  ngOnInit() {
      this.meetingId=this._route.snapshot.paramMap.get('meetingId');
      this.authToken=(this.appService.getUserInfoFromLocalstorage()).authToken;      
      this.fullName=(this.appService.getUserInfoFromLocalstorage()).fullName;
      
      this.getSingleMeetingDetails(this.meetingId, this.authToken);      
 }

  ngOnDestroy() {
    console.log("single-meeting component destroyed");
  }
//---------------------------------function definitons- -----------------------------------------------  
//get single meeting details - when meetingId is param
  public getSingleMeetingDetails=(meetingId,authToken)=>{
    this.meetingService.getSingleMeetingDetails(meetingId, authToken).subscribe(
      apiResponse=>{ 
        if(apiResponse.status===200){       
        this.currentMeeting=apiResponse.data;
        this.mtgDate=this.library.formatDate(this.currentMeeting.mtgStartDate);
      }else {        
        this.toastr.error(apiResponse.message);
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
      })
  }
//----------------------------------------------------------------------------------------
public seeInvitees(mtgId){  
  this.router.navigate(['/admin-dashboard/invitee-page', mtgId]);
}
//-----------------------function to go to previous page-----------------------------------
public goBack(){
  this.location.back();
}
//-----------------------------------------------------------------------------------------
//end of class definition
}
