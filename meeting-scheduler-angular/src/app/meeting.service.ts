import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private url="http://localhost:3000/api/v1/project";
  public mtgData:any=[];
  

  constructor(
    private http:HttpClient
  ) { }  
  

 
//api call - to edit meeting
  public editMeeting(mtgId, data, authToken):Observable<any>{
    console.log(mtgId);
    console.log(data);
    let mtgData=new HttpParams()
      .set("meetingId", data.meetingId)
      .set("meetingName", data.meetingName)
      .set("meetingDate", data.meetingDate)
      .set("meetingTime", data.meetingTime)
      .set("convenor", data.convenor)
      .set("convenorMobile", data.convenorMobile)
      .set("meetingVenue", data.meetingVenue);
    return this.http.put(`${this.url}/${authToken}/editMeeting/${mtgId}`, mtgData);
  }
//api call - to delete meeting
  public deleteMeeting(mtgId, authToken):Observable<any>{
    let params=new HttpParams()
      .set("mtgId", mtgId);      
    return this.http.post(`${this.url}/${authToken}/delete`, params);    
  }  

  public getSingleMeetingDetails(meetingId, authToken):Observable<any>{
    return this.http.get(`${this.url}/${authToken}/singleMeeting/${meetingId}`);
  }

  public getAllInvitees(mtgId, authToken):Observable<any>{
    return this.http.get(`${this.url}/${authToken}/allInvitees/${mtgId}`);
  }

  public getAllNonInvitees(mtgId, authToken):Observable<any>{
    return this.http.get(`${this.url}/${authToken}/allNonInvitees/${mtgId}`);
  }

  public cancelInvitation(authToken, mtgId, data):Observable<any>{
    let mtgData=new HttpParams()      
      .set("invitees", data.invitees);     

    return this.http.put(`${this.url}/${authToken}/cancelInvitation/${mtgId}`, mtgData);
  }

  public getAllMeetings(authToken):Observable<any>{
    return this.http.get(`${this.url}/${authToken}/allMeetings`);
  }

  ///api call to get meetings of asingle user
  public getSingleUserMeetings(userId, month, year, authToken):Observable<any>{
    return this.http.get(`${this.url}/${authToken}/singleUserMeetings/${userId}/${month}/${year}`);
  }
  
  public getSingleViewerMeetings(authToken, userId):Observable<any>{
    console.log(authToken);
    return this.http.get(`${this.url}/${authToken}/singleViewerMeetings/${userId}`);
  }

  public getWeeklyCalendarOfMeetings(userId, month, year, authToken):Observable<any>{
    return this.http.get(`${this.url}/${authToken}/weeklyCalendar/${userId}/${month}/${year}`);
  }
  public getWeekByIndex(authToken, weekNumber):Observable<any>{
    return this.http.get(`${this.url}/${authToken}/week/${weekNumber}`);
  }

  public getWeekNumber(authToken, currentDate, month, year):Observable<any>{
    return this.http.get(`${this.url}/${authToken}/getWeekNumber/${currentDate}/${month}/${year}`);
  }

  public getDayIndex(authToken, userId, date, month, year):Observable<any>{
    return this.http.get(`${this.url}/${authToken}/getDayIndex/${userId}/${date}/${month}/${year}`);
  }

  public getDayByIndex(authToken, userId, dayNumber):Observable<any>{
    return this.http.get(`${this.url}/${authToken}/day/${userId}/${dayNumber}`);
  }
  
  public getMeetingsByUserId(authToken, userId):Observable<any>{
    return this.http.get(`${this.url}/${authToken}/meetingsByUserId/${userId}`);
  }
  

//-----------------------------------------------------------------------------------------------------
// Two functions - getter setter - of monthly meeting data
  public setMonthlyMeetingData(datesArray){
    this.mtgData=datesArray;
  }

  public getMonthlyMeetingData(){
    console.log(this.mtgData);
    return this.mtgData;
  }
//--------------------------------------------------------------------------------------------------------  
}//end of class definition
