//import angular packages
import { Component, OnInit, OnDestroy } from '@angular/core';
import{Router} from '@angular/router';
//import user defined services
import {AppService} from './../../app.service';
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

})
export class LoginComponent implements OnInit, OnDestroy { 
  //variables to hold form inputs 
  public username:String;
  public password:String;
  //to hold and show error messages
  public errorMessage:String=""; //to hold error msg string
  
  constructor(
    private appService:AppService,    
    private toastr:ToastrService,
    private router:Router,
    ) {
      console.log("Login function initialised");
    }

  ngOnInit() { 
    console.log("Login Component ::: ngOnInit")
  }//when page is loaded

  ngOnDestroy() {//when page is exited
    console.log("login component destroyed");
  }
  //--------------------------------function definitions------------------------------------------------
//login function - send user details in api call and navigate to home page
  public loginFunction(){
    console.log("Login Component ::: Login Function")
    if(!this.username){
      this.errorMessage="user name field is empty";
    } else if(!this.password){
      this.errorMessage="password field is empty";
    } else {
      let data={
        userName:this.username,
        password:this.password
      }
      this.appService.loginFunction(data).subscribe(
        apiResponse=>{
          console.log(apiResponse.data); 
          if(apiResponse.status===200){ //when response is success and  status  200
            //check user rights - navigate accordingly
              if(apiResponse.data.rights==="admin"){
                this.toastr.success(apiResponse.message);                       
                this.router.navigate(['/admin-dashboard']);
              } else if(apiResponse.data.rights==="viewer"){
                this.toastr.success(apiResponse.message);            
                let userId=apiResponse.data.userId;
                this.router.navigate(['/viewer-dashboard', userId]);
              }else{
                console.log("Login Component ::: Else part");
              }

            //storing user details in local storage           
            let userDetails={
              userId: apiResponse.data.userId,
              fullName:apiResponse.data.firstName+" "+apiResponse.data.lastName,
              mobileNumber:apiResponse.data.mobileNumber,
              authToken:apiResponse.data.authToken
            } 
            console.log("Setting user info in local storage");
            console.log(userDetails);          
            this.appService.setUserInfoInLocalstorage(userDetails);
          }  else { //when response is success but  status not 200              
              console.log(apiResponse);
              this.toastr.error(apiResponse.message);
              let errorCode = apiResponse.status;
              let errorMessage = apiResponse.message;
              this.router.navigate(['/error', errorCode, errorMessage]);
          }          
        },
        error=>{   //showing error message
          
          if(error.error.message){            
            let errorMessage=error.error.message;
            let errorCode=error.status;
            this.router.navigate(['/error', errorCode, errorMessage]);
           } else {            
            this.toastr.error(error.message);
           }
          //emptying variables
          this.username="";
          this.password="";
        }) //subscribe method ended        
    }//else block ended
}//login function ended
//----------------------------------------------------------------------------------------------------------
}//end of class definition
