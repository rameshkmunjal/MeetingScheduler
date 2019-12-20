//including angular packages
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
//including user defined services
import {AppService} from './../../../app.service';
import {MeetingService} from './../../../meeting.service';
import {SocketService} from './../../../socket.service';
import {LibraryService} from './../../../library.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-non-invitee-list',
  templateUrl: './non-invitee-list.component.html',
  styleUrls: ['./non-invitee-list.component.css']
})
export class NonInviteeListComponent implements OnInit {
  public meetingId:string;//to get from route
  public authToken:string;//to get from localStorage

  public mtgDate:string;//to hold formatted date
  public currentMeeting:any;//to hold current meeting object info
  public allNonInvitees:any=[];  //all non invitees list

  constructor(
    private _route:ActivatedRoute,
    private router:Router,
    //service instances
    private appService:AppService,
    private meetingService:MeetingService,
    private socketService:SocketService,
    private library:LibraryService,
    private toastr:ToastrService
  ) { }

  ngOnInit() {
    this.meetingId=this._route.snapshot.paramMap.get('meetingId');
    this.authToken=(this.appService.getUserInfoFromLocalstorage()).authToken;
    //function calls
    this.getSingleMeetingDetails(this.meetingId, this.authToken); 
    this.getAllNonInviteesList(this.meetingId, this.authToken); 
  }

  //---------------------------------function definitons -----------------------------------------------  
//get single meeting details - when meetingId is param
public getSingleMeetingDetails=(meetingId,authToken)=>{
  this.meetingService.getSingleMeetingDetails(meetingId, authToken).subscribe(
    apiResponse=>{
      if(apiResponse.status===200){        
        this.currentMeeting=apiResponse.data;
        this.mtgDate=this.library.formatDate(this.currentMeeting.mtgStartDate);
      } else {
        let errorCode=apiResponse.status;
        let errorMessage=apiResponse.message;
        this.router.navigate(['/error', errorCode, errorMessage])
      }      
    }, error=>{   //showing error message          
      if(error.error.message){            
        let errorMessage=error.error.message;
        let errorCode=error.status;
        this.router.navigate(['/error', errorCode, errorMessage]);
       } else {            
        this.toastr.error(error.message);
       }      
    }) //subscribe method ended
}

//to get list of all invitees
public getAllNonInviteesList(mtgId, authToken):any{
  this.meetingService.getAllNonInvitees(mtgId, authToken).subscribe(
    apiResponse=>{
      if(apiResponse.status===200){
      console.log(apiResponse);
      this.allNonInvitees=apiResponse.data;        
      console.log(this.allNonInvitees);
    }else {
      let errorCode=apiResponse.status;
      let errorMessage=apiResponse.message;
      this.router.navigate(['/error', errorCode, errorMessage])
    }      
  }, error=>{   //showing error message          
    if(error.error.message){            
      let errorMessage=error.error.message;
      let errorCode=error.status;
      this.router.navigate(['/error', errorCode, errorMessage]);
     } else {            
      this.toastr.error(error.message);
     }      
  }) //subscribe method ended
}
//--------------------function to send invitation - when invite btn clicked-----------------
public sendInvitation(mtgId, userId){    
  let data={
    mtgId:mtgId,
    userId:userId
  }
  this.socketService.sendInvitation(data);
  this.getAllNonInviteesList(this.meetingId, this.authToken);
}
//-------------------------class definition ended-------------------------------------------
}
