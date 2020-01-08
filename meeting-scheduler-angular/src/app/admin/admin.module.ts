//----------------------------import system modules-----------------------
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';
import { OrderByPipe } from './order-by.pipe';
//------------------------importing components----------------------------
//user defined  - some meeting components
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component'; //holding all views
import { HomeComponent } from './home/home.component'; //default page - showing all viewers
import { MeetingListComponent } from './meeting-list/meeting-list.component';//all meetings
import { CreateMeetingComponent } from './create-meeting/create-meeting.component';
import { SingleDateComponent } from './single-date/single-date.component';//when date clicked
import { EditMeetingComponent } from './edit-meeting/edit-meeting.component';
import { DeleteMeetingComponent } from './delete-meeting/delete-meeting.component';

import { MeetingHeaderComponent } from './meeting-header/meeting-header.component';
import { PreviousMeetingsComponent } from './previous-meetings/previous-meetings.component';
import { UpcomingMeetingsComponent } from './upcoming-meetings/upcoming-meetings.component';
import { SingleMeetingComponent } from './single-meeting/single-meeting.component';

//user defined - calendar view - monthly - weekly - daily 
import {SingleViewerComponent} from './single-viewer/single-viewer.component'; 
import { SingleViewerHeaderComponent } from './single-viewer/single-viewer-header/single-viewer-header.component';
import { MonthlyComponent } from './monthly/monthly.component';
import {WeeklyComponent} from './weekly/weekly.component';
import { DailyComponent } from './daily/daily.component';
import { CurrentCalendarComponent } from './current-calendar/current-calendar.component';
//user defined - invitee related components
import { InviteePageComponent } from './invitee-page/invitee-page.component';
import { InviteeHeaderComponent } from './invitee-page/invitee-header/invitee-header.component';
import { InviteeListComponent } from './invitee-page/invitee-list/invitee-list.component';
import { NonInviteeListComponent } from './invitee-page/non-invitee-list/non-invitee-list.component';
//------------------------------------------------------------------------
//
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,  
    RouterModule.forRoot([  
      //all routes representing user defined compoenents  are children of admin-dashboard 
      //- hence shown inside it    
      {path:'admin-dashboard', component:AdminDashboardComponent, children: [                 
            {path:'home', component:HomeComponent},
            {path:'allMeetings', component:MeetingListComponent},            
            {path:'create', component:CreateMeetingComponent},
            {path:'edit/:mtgId', component:EditMeetingComponent},
            {path:'delete/:mtgId', component:DeleteMeetingComponent},
            {path:'current-calendar/:viewerId', component:CurrentCalendarComponent},
            {path:'single-viewer/:viewerId',  component:SingleViewerComponent},            
            {path:'single-meeting/:meetingId', component:SingleMeetingComponent},
            {path:'single-date/:day/:month/:year/:userId', component:SingleDateComponent},
            {path:'invitee-page/:meetingId', component:InviteePageComponent},
            {path:'', redirectTo:'home', pathMatch:'full'} ,//when no path given
            {path:'**', component:HomeComponent}//when something else path given - wild route
        ]
      }
    ])
  ],
  declarations: [
    //general components
    AdminDashboardComponent,//holds all views
    HomeComponent, //default view - list of viewers
    CreateMeetingComponent,    
    EditMeetingComponent, 
    DeleteMeetingComponent, 
    SingleMeetingComponent,   
    //meeting list related
    MeetingListComponent,
    MeetingHeaderComponent,
    PreviousMeetingsComponent,
    UpcomingMeetingsComponent,     
    SingleDateComponent,
    //calendar view of a single viewer
    SingleViewerComponent,
    SingleViewerHeaderComponent,
    MonthlyComponent,
    WeeklyComponent,
    DailyComponent,    
    CurrentCalendarComponent,
    //invitees related
    InviteePageComponent,
    InviteeHeaderComponent,
    InviteeListComponent,
    NonInviteeListComponent,
    OrderByPipe
  ]
})

export class AdminModule { }

