import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import * as io from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class SocketService {  
  private url='http://localhost:3000';
  private socket;

  constructor(
    private http:HttpClient
  ) { 
    this.socket=io(this.url);
  }

  public verifyUser():Observable<any>{
    console.log("verify user function");
    return Observable.create((observer)=>{
      this.socket.on('verify-user', (data)=>{
        observer.next(data);
      })
    })
  }

  public onlineUserList():Observable<any>{
    return Observable.create((observer)=>{
      this.socket.on('online-user-list', (data)=>{
        console.log(data);
        observer.next(data);
      })
    })
  }

   
/*
  public getAllInvitees():Observable<any>{
    return Observable.create((observer)=>{
      this.socket.on('get-all-invitees', (data)=>{
        console.log(data);
        observer.next(data);
      })
    })
  }
*/
  public getNewMeetingMessage():Observable<any>{
    return Observable.create((observer)=>{
      this.socket.on('get-new-meeting-message', (data)=>{
        console.log(data);
        observer.next(data);
      })
    })    
  }

  public showAlertsB4OneMinute():Observable<any>{
    return Observable.create((observer)=>{
      this.socket.on('show-alert-b4-one-minute', (data)=>{
        console.log(data);
        observer.next(data);
      })
    })
  }
  public getAlertsCancelled():Observable<any>{
    return Observable.create((observer)=>{
      this.socket.on('get-alert-cancelled', (data)=>{
        console.log(data);
        observer.next(data);
      })
    })
  }

  //---------------------------Events to be emitted---------------------------------------
  //event emitted - to create meeting data
  public setUser(authToken){
    this.socket.emit('set-user', authToken);
  }
  public createMeeting(data){   
    console.log(data); 
    this.socket.emit('create-meeting', data);   
  }
  public editMeeting(data){    
    this.socket.emit('edit-meeting', data);   
  }
  public getAlerts(mtg){
    console.log(mtg);    
    this.socket.emit('get-meeting-alerts', mtg);         
  }
  public sendInvitation(data){
    console.log(data);
    this.socket.emit('send-invitation', data);
  }
  public cancelInvitation(data){
    console.log(data);
    this.socket.emit('cancel-invitation', data);
  }
  public getAllInvitees(mtgId){
    console.log("mtgId : "+mtgId);
    this.socket.emit('get-all-invitees', mtgId);
  }
//---------------------------------------------------------------------------------------------
}
