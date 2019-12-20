//importing system modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
//importing user defined modules
import { ViewerDashboardComponent } from './viewer-dashboard/viewer-dashboard.component';
import { WeekComponent } from './week/week.component';
import { MonthComponent } from './month/month.component';
import { DayComponent } from './day/day.component';
import { ViewerHeaderComponent } from './viewer-header/viewer-header.component';
import { ClickToChangeDirective } from './click-to-change.directive';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot([      
      {path:'viewer-dashboard/:userId', component:ViewerDashboardComponent}    
    ])
  ],
  declarations: [
    ViewerDashboardComponent, 
    WeekComponent, 
    MonthComponent, 
    DayComponent, 
    ViewerHeaderComponent
  ]
})
export class ViewerModule { }
