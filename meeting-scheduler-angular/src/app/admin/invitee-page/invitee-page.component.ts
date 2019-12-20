import { Component} from '@angular/core';

@Component({
  selector: 'app-invitee-page',
  templateUrl: './invitee-page.component.html',
  styleUrls: ['./invitee-page.component.css']
})
export class InviteePageComponent {
  public selectedType:string='invitees';

  public onNavigate(type){
    this.selectedType=type;
  }
 
}
