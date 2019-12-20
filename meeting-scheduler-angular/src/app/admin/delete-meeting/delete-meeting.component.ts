//----------import angular packages------------
import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
//-----------import user defined services---------
import {AppService} from './../../app.service';
import {MeetingService} from './../../meeting.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-delete-meeting',
  templateUrl: './delete-meeting.component.html',
  styleUrls: ['./delete-meeting.component.css']
})
export class DeleteMeetingComponent implements OnInit, OnDestroy {
  private authToken:String;//to send with api call
  public mtgId:String;//to get and hold route param

  constructor(
    private _route:ActivatedRoute,
    private router:Router,
    private appService:AppService,
    private meetingService:MeetingService,
    private toastr:ToastrService    
  ) { }

  ngOnInit() {//when page is loaded
    this.authToken=this.appService.getUserInfoFromLocalstorage().authToken;
    this.mtgId=this._route.snapshot.paramMap.get('mtgId');    
  }

  ngOnDestroy() {//destroy page - when exited
    console.log(" edit-meeting component destroyed ");
  }

//function to delete meeting - using meeting id
  public cancelMeeting(mtgId):any{    
    this.meetingService.deleteMeeting(mtgId, this.authToken).subscribe(
      apiResponse=>{
        console.log(apiResponse); 
        if(apiResponse.status===200){
          //-----go to home page
          this.router.navigate(['/admin-dashboard/home']);
        } else{
          let errorCode;
          let errorMessage="";
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
//when cancel button is clicked - in delete dialog box
  public cancelDeleteAction():any{
    this.router.navigate(['/admin-dashboard/home']);
  }
//---------------ending class definition--------------------
}
