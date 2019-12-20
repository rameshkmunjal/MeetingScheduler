//import angular packages
import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
//import user defined services
import {AppService} from './../../app.service';
import{LibraryService} from './../../library.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.css']
})

export class ForgotPasswordFormComponent implements OnInit, OnDestroy {
  public username:string;//login details
  public email:String;//login details

  public otpId:String;  //to hold otp id recd inresponse
  
  public errorCode:string;//response status code
  public errorMessage:string;//to hold error messages
  public info:string="an OTP will be sent to your email address";
  

  constructor(
    //instance of services
    private library:LibraryService,
    private appService:AppService,

    private toastr:ToastrService,  //toastr  
    private router:Router//toastr
  ) { }

  ngOnInit() {}

  ngOnDestroy() {
    console.log("forgot-password form component destroyed");
  }

  //This function will take to OTP screen
  public getOTPScreen(){
    if(this.library.checkIfEmpty(this.username)){
      this.errorMessage="Please input username";
    } else if (this.library.checkIfEmpty(this.email)){
      this.errorMessage="Please input email" 
    } else{
      this.errorMessage="";
      
      let data={
        userName:this.username,
        email:this.email        
      }
      this.appService.getBackPasswordFunction(data).subscribe(
        apiResponse=>{
          console.log(apiResponse);
          if(apiResponse.status===200){             
            this.otpId=apiResponse.data;
            this.toastr.success(apiResponse.message);
            localStorage.setItem('otpId', JSON.stringify(this.otpId));
            this.router.navigate(['/forgotpassword/otp']);            
          } else { //when response code is not 200
            this.errorCode=apiResponse.status;
            this.errorMessage=apiResponse.message;
            this.username="";
            this.email="";                       
          }            
        }, (error)=>{  //error - when there is no response code        
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
          
          //emptying variables
          this.username="";
          this.email="";
        }
      )      
    }    
  }

}
