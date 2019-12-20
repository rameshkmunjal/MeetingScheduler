import { Component, OnInit , Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-viewer-header',
  templateUrl: './viewer-header.component.html',
  styleUrls: ['./viewer-header.component.css']
})
export class ViewerHeaderComponent implements OnInit {
  @Output() calendarSelected=new EventEmitter<string>();
  
  public isDayBtnActive:boolean;
  public isWeekBtnActive:boolean;
  public isMonthBtnActive:boolean;
  
  constructor() { }

  ngOnInit() {
    this.isDayBtnActive=false;
    this.isWeekBtnActive=false;
    this.isMonthBtnActive=true;
  }

  showCalendar(inputTime:string){
    if(inputTime==='day'){
      this.isDayBtnActive=true;
      this.isWeekBtnActive=false;
      this.isMonthBtnActive=false; 
         
    } else if(inputTime==='week'){
      this.isDayBtnActive=false;
      this.isWeekBtnActive=true;
      this.isMonthBtnActive=false;
           
    } else if(inputTime==='month'){
      this.isDayBtnActive=false;
      this.isWeekBtnActive=false;
      this.isMonthBtnActive=true; 
          
    }

    this.calendarSelected.emit(inputTime);
  }

}
