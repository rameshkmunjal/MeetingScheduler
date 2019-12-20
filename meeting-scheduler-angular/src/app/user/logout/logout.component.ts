//import angular packages
import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
//import user defined services
import {AppService} from './../../app.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit, OnDestroy {
  //to hold and show message - logout
  public message:string;
  public errorMessage:string;
  public errorCode:string;

  constructor(
    private appService:AppService, 
    private toastr:ToastrService,    
    private _route:ActivatedRoute,
    private router:Router
    ) { }

  ngOnInit() {//when page is loaded
    let userId=this._route.snapshot.paramMap.get('userId');//url param
    let authToken=this.appService.getUserInfoFromLocalstorage().authToken;
    //api call is made to logout
    this.appService.logoutFunction(userId, authToken).subscribe(
      (apiResponse)=>{
      console.log(apiResponse);
      if(apiResponse.status==200){//when response is success and status 200
        console.log(apiResponse);
        localStorage.removeItem('userDetails');//remove from local storage
        this.message=apiResponse.message; 
        this.toastr.success(this.message);       
      } else { //when response is success but  status not 200
        console.log(apiResponse.message);
        this.errorCode=apiResponse.status;
        this.errorMessage=apiResponse.message;
        this.router.navigate(['/error', this.errorCode, this.errorMessage]);
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
    })  //subscribe method ended
  }
  ngOnDestroy(){//when page is exited
    console.log("logout page is destroyed")
  }
  //----------------------------------------------------------------------------------------------------------

}//class definition ended

