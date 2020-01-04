import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private url="http://localhost:3000/api/v1/project";
  //"http://18.217.131.254:3000/api/v1/project";
  public mtgData:any=[];
  

  constructor(private http:HttpClient) { } 

//api call - to get all meetings details
public getAllMeetings(authToken):Observable<any>{
  return this.http.get(`${this.url}/${authToken}/allMeetings`);
}   
//api call - to get single meeting details
  public getSingleMeetingDetails(meetingId, authToken):Observable<any>{
    return this.http.get(`${this.url}/${authToken}/singleMeeting/${meetingId}`);
  }
   //api call - to get single viewer meeting details
   public getSingleViewerMeetings(authToken, userId):Observable<any>{
    console.log(authToken);
    return this.http.get(`${this.url}/${authToken}/singleViewerMeetings/${userId}`);
  }
  //---------------------------------------------------------------------
//api call - to get all invitees details
  public getAllInvitees(mtgId, authToken):Observable<any>{
    return this.http.get(`${this.url}/${authToken}/allInvitees/${mtgId}`);
  }
//api call - to get all non-invitees details
  public getAllNonInvitees(mtgId, authToken):Observable<any>{
    return this.http.get(`${this.url}/${authToken}/allNonInvitees/${mtgId}`);
  }  
//---------------------------------------------------------------------------

//api call - to delete meeting
public deleteMeeting(mtgId, authToken):Observable<any>{
  let params=new HttpParams()
    .set("mtgId", mtgId);      
  return this.http.post(`${this.url}/${authToken}/delete`, params);    
} 
//--------------------------------------------------------------------------------------------------------  
}//end of class definition
