//importing angular packages
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-single-viewer-header',
  templateUrl: './single-viewer-header.component.html',
  styleUrls: ['./single-viewer-header.component.css']
})
export class SingleViewerHeaderComponent {
  @Output() calendarSelected = new EventEmitter<string>();
  //boolean vars to decide which page to be shown
  public isDaily:boolean=false;
  public isWeekly:boolean=false; 
  public isMonthly:boolean=true;
   
//function to decide feature to decide show calendar 
  public showCalendar(period:string){ 
    if(period=='daily'){
      this.isDaily=true;
      this.isWeekly=false;
      this.isMonthly=false;
    } else if(period=='weekly'){
      this.isDaily=false;
      this.isWeekly=true;
      this.isMonthly=false;
    } else if(period=='monthly'){
      this.isDaily=false;
      this.isWeekly=false;
      this.isMonthly=true;
    }
    this.calendarSelected.emit(period);
  }
//--------------------------------end of class definition-------------------------------
}
