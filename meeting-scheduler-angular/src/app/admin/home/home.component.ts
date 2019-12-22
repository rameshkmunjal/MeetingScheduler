//import angular packages
import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
//import user defined services
import {AppService} from './../../app.service';
import {SocketService} from './../../socket.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  public authToken:String; //to send in api call  

  public viewerList:any=[]; //list of all viewers
  
  public mtg:any=[];
  public mtgDate:String;//to hold mtg date when formatted
  public meetingList:any=[];//array of all meetings  

  public config:any;

  //public list:any=[];    

  constructor(
    private router:Router,
    private toastr:ToastrService,
    private appService:AppService,        
    private socketService:SocketService    
  ) { 
    this.config={      
      itemsPerPage:4,
      currentPage:1,
      totalUsers:this.viewerList.length
    }
  }

  ngOnInit() {
    this.authToken=(this.appService.getUserInfoFromLocalstorage()).authToken;
    //socket calls       
    this.checkStatus();    
    this.verifyUserConfirmation();
    this.getOnlineUserList();    
    //some api calls           
    this.createAllViewersList(this.authToken);        
  }
//destroy page when left
  ngOnDestroy() {
    console.log("home component destroyed");
  }
//----------------------------------function defintions-----------------------------------------
//get list of all viewers  
  public createAllViewersList(authToken):any{     
    this.appService.getViewerList(authToken).subscribe(
      apiResponse=>{        
        this.viewerList=apiResponse.data;        
      }, error=>{   // showing error message          
        if(error.error.message){            
          let errorMessage=error.error.message;
          let errorCode=error.status;
          this.router.navigate(['/error', errorCode, errorMessage]);
         } else {            
          this.toastr.error(error.message);
         }        
      }) //subscribe method ended 
  }

//navigate to single viewer meeting page - when a date cell is clicked
  public getViewerMeetingList(viewerId){    
    this.router.navigate(['admin-dashboard/current-calendar', viewerId]);
  }

//---------------------------------Socket Related Functions------------------------------------------
  //if authToken is not given - navigate to login page - to prevent unauthorised login 
  public checkStatus():any{
    if(this.authToken===undefined || this.authToken===null || this.authToken===''){
      this.router.navigate(['/login']);
      return false;
    } else {
      return true;
    }
  }
  
  public verifyUserConfirmation():any{
    this.socketService.verifyUser()
        .subscribe(
          (data)=>{
            console.log(data);
            this.socketService.setUser(this.authToken);
          }, (err)=>{
            console.log(err);
          }
        )
  }
  //get list of online users
  public getOnlineUserList=():any=>{
    this.socketService.onlineUserList().subscribe(
      (data)=>{
        console.log(data);
      }
    )
  }
//-------------------------------------Pagination function------------------------------------------------
public pageChanged(event){
  this.config.currentPage=event;
}
//-------------------------------------------------------------------------------------
}//class definition ended
