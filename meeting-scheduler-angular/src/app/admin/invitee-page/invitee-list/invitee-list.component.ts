import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from './../../../app.service';
import {MeetingService} from './../../../meeting.service';
import {SocketService} from './../../../socket.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-invitee-list',
  templateUrl: './invitee-list.component.html',
  styleUrls: ['./invitee-list.component.css']
})
export class InviteeListComponent implements OnInit {
  public meetingId:string;//to get from route
  public authToken:string;//to get from localStorage

  public mtgDate:string;//to hold formatted date
  public currentMeeting:any;//object  to hold current meeting data
  public allInvitees:any=[]; //to hold all invitees data 

  constructor(
    private _route:ActivatedRoute,
    private router:Router,
    //service instances
    private appService:AppService,
    private meetingService:MeetingService,
    private socketService:SocketService,
    private toastr:ToastrService
  ) { }

  ngOnInit() {
    this.meetingId=this._route.snapshot.paramMap.get('meetingId');    
    this.authToken=(this.appService.getUserInfoFromLocalstorage()).authToken; 
    this.getAllInviteesList(this.meetingId, this.authToken); 
  }
  //---------------------------------function definitons -----------------------------------------------

  //to get list of all invitees
  public getAllInviteesList(mtgId, authToken):any{
    this.meetingService.getAllInvitees(mtgId, authToken).subscribe(
      apiResponse=>{
        if(apiResponse.status===200){
          this.allInvitees=apiResponse.data;
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
//if you want to exclude a viewer from meeting
  public cancelInvitation(mtgId, userId){    
    let data={
      mtgId:mtgId,
      userId:userId
    }
    this.socketService.cancelInvitation(data);
    //to update instantly
    this.getAllInviteesList(this.meetingId, this.authToken);
  }

}
