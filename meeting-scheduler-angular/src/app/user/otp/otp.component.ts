//import angular packages
import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';

import {ToastrService} from 'ngx-toastr';
//import user defined services
import {AppService} from './../../app.service';
import {LibraryService} from './../../library.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})

export class OtpComponent implements OnInit, OnDestroy {
  public otpId:string; //to send along testOTP function - retained at localStorage
  public otp:string; //to send along testOTP function
  public errorMessage:string;//to hold error messages  

  constructor(
    private router:Router,
    //instances of services
    private toastr:ToastrService,
    private appService:AppService,
    private library:LibraryService
  ) { }

  ngOnInit() { //when page is loaded
    this.otpId=localStorage.getItem('otpId');  //get otp id from local storage
  }

  ngOnDestroy() {//when page is exited
    console.log("otp component destroyed");
  }
//if otp is input - call testOTP function
  public sendOTP(){
    if(this.library.checkIfEmpty(this.otp)){
      this.errorMessage="Please enter OTP";
    } else {
      this.testOTP(this.otpId, this.otp);
    }
  }
//send OTP to test it by api call
  public testOTP(otpId, otp){
    let data={
      otpId:otpId,
      otp:otp
    }
    console.log(data);
    this.appService.testOTP(data).subscribe(
      apiResponse=>{
        if(apiResponse.status===200){ //when api call is successful with response status 200
          console.log(apiResponse);
          localStorage.removeItem('otpId');  //remove it      
          this.router.navigate(['/forgotpassword/reset-password']); //move to reset screen
        } else {//when response status is not 200          
          console.log(apiResponse); 
          let errorCode = apiResponse.status;
          let errorMessage = apiResponse.message;
          this.router.navigate(['/error', errorCode, errorMessage]);         
        }        
      }, (error)=>{//when response status code is not received
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
    })        
}
//-----------------------------------------------------------------------------------------------  

}
