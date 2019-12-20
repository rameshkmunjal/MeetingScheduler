///import angular npm packages
import { Component} from '@angular/core';


@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.css']
})

export class MeetingListComponent{
  //by default page is upcoming - hence value assigned
  public loadedFeature='upcoming';
  //titles used in data-binding
  public pagePreviousTitle:string="Previous Meetings";
  public pageUpcomingTitle:string="Upcoming Meetings";

  //feature selected - got through output from child component
  onNavigate(feature:string){
    this.loadedFeature=feature;       
  }
  //---------------------------------------------------------------------------
  //class definition ended
}
