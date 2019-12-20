//----------------------------import system modules-----------------------
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
//----------------------------import user defined modules------------------
import {UserModule} from './user/user.module';
import {AdminModule} from './admin/admin.module';
import {ViewerModule} from './viewer/viewer.module';
//------------------------importing components----------------------------
import { AppComponent } from './app.component';
import {LoginComponent} from './user/login/login.component';
import { ErrorPageComponent } from './error-page/error-page.component';

//------------------------------------------------------------------------
@NgModule({  
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorPageComponent       
  ],
  imports: [
    //system modules
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot({      
    }),
    RouterModule.forRoot([
      {path:'login', component:LoginComponent},//default page
      {path:'error/:code/:message', component:ErrorPageComponent},//when error happens
      {path:'', redirectTo:'login', pathMatch:'full'}, //default route
      {path:'**', component:LoginComponent} //in case route given not found - wild route
    ]),
    //user defined modules
    UserModule,    
    AdminModule, 
    ViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
