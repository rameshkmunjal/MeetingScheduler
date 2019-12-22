//import angular packages
import { Component, OnInit, OnDestroy } from '@angular/core';
import{Router} from '@angular/router'; 
//import user defined services
import {AppService} from './../../app.service';
import {ToastrService} from 'ngx-toastr';
import {CountryCodeService} from './../../country-code.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit, OnDestroy {
  //Arrays declared/defined
  public countryCodeList:any=[];//to hold country codes , names etc
  public rolesList:any=[ //roles of user in organisation
    "Branch-Staff", "Branch-Manager", "AGM-Branch", "Region-Staff"
  ];  
  //to hold and show error message
  public errorMessage:string;
  //some variables - to hold form inputs
  public firstName:string;
  public lastName:string;
  public username:any; 
  public email:string;
  public password:string;
  public role:string="Branch-Staff";
  public mobileNumber:number;
  public country:String="India"; 
  public countryCode:string="91"; 

  constructor(
    private appService:AppService,
    private toastr:ToastrService,    
    private CountryCodeService:CountryCodeService,
    private router:Router
  ) { }

  ngOnInit() {//when page is loaded
    this.sendCountryObjects();
  }

  ngOnDestroy() {//when page is exited
    console.log("sign up component destroyed");
  }
  //---------------------------------------------------------------------------------
  //Function - to send user details - validat input and make api call
  public signupFunction(){
    let rights:string;
    if(this.role==='AGM-Controller'){
      rights="admin"
    } else{
      rights="viewer"
    }
    if(!this.firstName){
      this.errorMessage="first name field is empty";
    }else if(!this.lastName){
      this.errorMessage="last name field is empty";
    }else if(!this.username){
      this.errorMessage="user name field is empty";
    } else if(!this.email){
      this.errorMessage="email field is empty";
    } else if(!this.password){
      this.errorMessage="password field is empty";
    } else if(!this.role){
      this.errorMessage="role field is empty";
    } else if(!this.country){
      this.errorMessage="country name field is empty";
    }else if(!this.countryCode){
      this.errorMessage="country code field is empty";
    }else if(!this.mobileNumber){
      this.errorMessage="mobile number field is empty";
    } else {
      let data={ 
        firstName:this.firstName,
        lastName:this.lastName,     
        userName:this.username,
        email:this.email,
        password:this.password,
        role:this.role,
        country:this.country,
        countryCode:this.countryCode,
        mobileNumber:this.mobileNumber,        
        rights:rights
      }
      //validation before sign up api call
     if(this.validateUserName(data.userName, data.rights) ){
      console.log(data);
      this.appService.signupFunction(data).subscribe(
        apiResponse=>{
          if(apiResponse.status==200){
            this.toastr.success(apiResponse.message);
            console.log(apiResponse.data);
            this.router.navigate(['/login']);
          } else {
            console.log(apiResponse);
            this.toastr.error(apiResponse.message);
            let errorCode=apiResponse.status;
            let errorMessage=apiResponse.message;
            this.router.navigate(['/error', errorCode, errorMessage]);
          }          
        },
         error=>{
           if(error.error.message){
            console.log(error.error.message);
            this.toastr.error(error.error.message);
           } else {
            console.log(error.message);
            this.toastr.error(error.message);
           }
          
        })    

     } else{ //show error message - if validation fails
       this.errorMessage="Please check role:"+  
        "1. admin must use -admin in username "+
        "2. normal viewer can not use admin in username"
     }      
    }          
  }

//function to validate - if username having admin - rights should be matching
  public validateUserName=(username, rights)=>{
    //if user name is having admin - rights should be admin also
    if(username.indexOf('-admin') !== -1 && rights==="admin"){      
      return true;
    }//if user name is not having admin - rights should be viewer
     else if (username.indexOf('-admin') == -1 && rights==="viewer"){
      return true;
    } else { //no other case acceptable - to make api call
      return false;
    }
  }

  
  //---------------------------------------------------------------------------------
  //to get list from country code service
  public sendCountryObjects=()=>{
    this.countryCodeList=this.CountryCodeService.sendCountryObjects();
    console.log(this.countryCodeList);
  }
//Only when country name is selected - assign country code
  public getCountryCode=()=>{
    if(this.country){
      for(let obj of this.countryCodeList){
        if(obj.name==this.country){
          this.countryCode=obj.digit;
        }
      }
    } else {
      this.errorMessage="You should select country name first";
    }    
  }
  
  
//----------------------------------------------------------------------------------------
}
