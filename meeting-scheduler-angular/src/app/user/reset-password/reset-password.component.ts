//import angular packages
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
//import user defined services
import { LibraryService} from './../../library.service';
import { AppService} from './../../app.service';
import { ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  //form inputs
  public username:string;
  public newPassword:string;
  public confirmPassword:string;
  //to hold and show error message
  public errorMessage:string;
  public errorCode:string; 
  
  constructor(//creating instances
    private library:LibraryService,
    private appService:AppService,
    private toastr:ToastrService,
    private router:Router
  ) { }

  ngOnInit() {  }//when page is loaded

  ngOnDestroy() {//when page is exited
    console.log("reset-password component destroyed");
  }

  //-------------------------function definitions-----------------------------------------
//validating user details and api call to update password
  public createNewPassword(){
    console.log(this.username);
    if(this.library.checkIfEmpty(this.username)){
      this.errorMessage="Please input  username";
    }else if(this.library.checkIfEmpty(this.newPassword)){
      this.errorMessage="Please input new password";
    } else if(this.library.checkIfEmpty(this.confirmPassword)){
      this.errorMessage="Please input confirm password";
    } else if( this.newPassword !== this.confirmPassword){
      this.errorMessage="New Password and confirm password do not match";
    } else {      
        this.appService.updatePassword(this.username, this.newPassword).subscribe(
          apiResponse=>{
            console.log(apiResponse);
            /*
            if(apiResponse.status===200){
              console.log(apiResponse.data);
              this.errorMessage="Password changed successfully. Login with new password.";
              this.toastr.success("Password changed successfully"); 
              */           
              this.router.navigate(['/login']); 
              /*
            } else{
              this.errorMessage=apiResponse.message;
              this.errorCode=apiResponse.status;
              this.router.navigate(['/error', this.errorCode, this.errorMessage]);
            }
            */           
          }, (err)=>{
            console.log(err.error.message);
          }
        )      
    }    
  }
}//end of function
//-----------------------------------------------------------------------------------------