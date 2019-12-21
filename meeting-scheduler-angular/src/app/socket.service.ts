import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import * as io from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class SocketService {  
  private url='http://localhost:3000';
  private socket;

  constructor() { 
    this.socket=io(this.url);
  }
//---------------------event listeners------------------------------------------
  public verifyUser():Observable<any>{
    return Observable.create((observer)=>{
      this.socket.on('verify-user', (data)=>{
        observer.next(data);
      })
    })
  }

  public onlineUserList():Observable<any>{
    return Observable.create((observer)=>{
      this.socket.on('online-user-list', (data)=>{
        observer.next(data);
      })
    })
  }

  public getNewMeetingMessage():Observable<any>{
    return Observable.create((observer)=>{
      this.socket.on('get-new-meeting-message', (data)=>{
        observer.next(data);
      })
    })    
  }

  public showAlertsB4OneMinute():Observable<any>{
    return Observable.create((observer)=>{
      this.socket.on('show-alert-b4-one-minute', (data)=>{
        observer.next(data);
      })
    })
  }
  public getAlertsCancelled():Observable<any>{
    return Observable.create((observer)=>{
      this.socket.on('get-alert-cancelled', (data)=>{
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
    this.socket.emit('create-meeting', data);   
  }
  public editMeeting(data){    
    this.socket.emit('edit-meeting', data);   
  }
  public getAlerts(mtg){
    this.socket.emit('get-meeting-alerts', mtg);         
  }
  public sendInvitation(data){
    this.socket.emit('send-invitation', data);
  }
  public cancelInvitation(data){
    this.socket.emit('cancel-invitation', data);
  }  
//---------------------------------------------------------------------------------------------
}
