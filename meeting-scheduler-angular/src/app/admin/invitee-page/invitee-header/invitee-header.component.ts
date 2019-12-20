//---------including angular packages--------------
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
//----------------including user defined services-------------
import {AppService} from './../../../app.service';
import {MeetingService} from './../../../meeting.service';
import {LibraryService} from './../../../library.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-invitee-header',
  templateUrl: './invitee-header.component.html',
  styleUrls: ['./invitee-header.component.css']
})
export class InviteeHeaderComponent implements OnInit {
  public meetingId:string;
  public authToken:string;
  public currentMeeting:any;
  public mtgDate:string;

  @Output() typeSelected = new EventEmitter<string>();
  isInvitee:boolean=true;
  isNonInvitee:boolean=false; 

  
  ngOnInit(){
    this.meetingId=this._route.snapshot.paramMap.get('meetingId');    
    this.authToken=(this.appService.getUserInfoFromLocalstorage()).authToken;    
    this.getSingleMeetingDetails(this.meetingId, this.authToken); 
  }
  constructor(
    private _route:ActivatedRoute,
    private router:Router,
    //creating service instances
    private meetingService:MeetingService,    
    private library:LibraryService,
    private appService:AppService,
    private toastr:ToastrService
  ){}

//function to change navigation button colors and lists 
  showList(feature:string){ 
    if(feature=='invitees'){
      this.isInvitee=true;
      this.isNonInvitee=false;
    } else if(feature=='non-invitees'){
      this.isInvitee=false;
      this.isNonInvitee=true;
    }
    this.typeSelected.emit(feature);
  }

//-get single meeting details - when meetingId is param
public getSingleMeetingDetails=(meetingId,authToken)=>{
  this.meetingService.getSingleMeetingDetails(meetingId, authToken).subscribe(
    apiResponse=>{
      if(apiResponse.status===200){
        console.log(apiResponse);
        this.currentMeeting=apiResponse.data;
        this.mtgDate=this.library.formatDate(this.currentMeeting.mtgStartDate);
      } else {
        this.toastr.error(apiResponse.message);
        let errorCode = apiResponse.status;
        let errorMessage = apiResponse.message;
        this.router.navigate(['/error', errorCode, errorMessage]);
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
//---------------class defintion ended-----------------------------

}
