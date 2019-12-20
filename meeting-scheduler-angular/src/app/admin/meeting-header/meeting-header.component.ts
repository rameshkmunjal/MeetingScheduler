import { 
  Component,   
  Output, 
  EventEmitter  
} from '@angular/core';

@Component({
  selector: 'app-meeting-header',
  templateUrl: './meeting-header.component.html',
  styleUrls: ['./meeting-header.component.css']
})
export class MeetingHeaderComponent  {
 //send feature selected to parent component i.e. meeting-list
  @Output() meetingSelected = new EventEmitter<string>();
  isUpcoming:boolean=true;
  isPrevious:boolean=false; 
   
  //function  to get feature from click of button
  showMeetings(feature:string){ 
    if(feature=='previous'){
      this.isPrevious=true;
      this.isUpcoming=false;
    } else if(feature=='upcoming'){
      this.isPrevious=false;
      this.isUpcoming=true;      
    }
    this.meetingSelected.emit(feature);
  }


}
