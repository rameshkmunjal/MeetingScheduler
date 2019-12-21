import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private url="http://localhost:3000/api/v1/project";

  constructor(private http:HttpClient) { }

//---------------------------user related api calls and getter-setter functions----------------
  //api call - to sign up
  public signupFunction(data):Observable<any>{
    let params=new HttpParams()
      .set("firstName", data.firstName)
      .set("lastName", data.lastName)
      .set("userName", data.userName)      
      .set("email", data.email)
      .set("password", data.password)
      .set("role", data.role)
      .set("country", data.country)
      .set("countryCode", data.countryCode)
      .set("mobileNumber", data.mobileNumber)      
      .set("rights", data.rights);
      console.log(params);
    return this.http.post(`${this.url}/signup`, params);
  }

//api call - to log in
  public loginFunction(data):Observable<any>{
  //  console.log(data);
    console.log("Login Function called");
    let params=new HttpParams()
    .set("userName", data.userName)   
    .set("password", data.password);
    return this.http.post(`${this.url}/login`, params);
  }

  //function - to set user details in local storage
  public setUserInfoInLocalstorage(userDetails){
    console.log("authToken set in localStorage");
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
  }
  //function - to get user dettails from local storage
  public getUserInfoFromLocalstorage(){
    return JSON.parse(localStorage.getItem('userDetails'));
  }
  //api call- to get all viewers info
  public getViewerList(authToken):Observable<any>{    
    console.log("getUserList called");
    return this.http.get(`${this.url}/${authToken}/allViewers/viewer`);
  }

 //api call - log out user
  public logoutFunction(userId, authToken):Observable<any>{
    console.log("logged out : "+ authToken);
    let params=new HttpParams()
      .set('authToken', authToken);
    return this.http.post(`${this.url}/${userId}/logout`, params);
  }
//-------------------------------------Password related api calls----------------------------------
//api call - to get otp
  public getOTP(data):Observable<any>{
    let params= new HttpParams()
      .set('userName', data.userName)
      .set('email', data.email);      

      return this.http.post(`${this.url}/getOTP`, params);
  }
  //api call to compare otp input with otp record
  public testOTP(data):Observable<any>{
    console.log(data);
    let params=new HttpParams()
      .set('otpId', data.otpId)
      .set('otp', data.otp);
    return this.http.post(`${this.url}/testOTP`, params);

  }
//api call - api call to update password
  public updatePassword(username, data){ 
    console.log(data);    
    let params = new HttpParams()    
    .set("password", data);
    return this.http.post(`${this.url}/updatepassword/${username}`, params);
  }
//------------------------------class definition ended------------------------------
}
