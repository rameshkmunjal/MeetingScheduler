//----------------------------import system modules-----------------------
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
//------------------------importing components----------------------------
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LogoutComponent } from './logout/logout.component';
import { OtpComponent } from './otp/otp.component';
import { ForgotPasswordFormComponent } from './forgot-password-form/forgot-password-form.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
//------------------------------------------------------------------------
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forRoot([
      {path:'signup', component:SignupComponent},      
      {path:'logout/:userId', component:LogoutComponent},
      {path:'forgotpassword', component:ForgotPasswordComponent, children:[
        //child routes of forgot password page
        {path:'otp', component:OtpComponent},
        {path:'reset-password', component:ResetPasswordComponent},
        {path:'forgot-password-form', component:ForgotPasswordFormComponent},
        {path:'', redirectTo:'forgot-password-form', pathMatch:'full'}
      ]}
    ])
  ],
  declarations: [
    SignupComponent, 
    ForgotPasswordComponent,    
    OtpComponent, 
    ForgotPasswordFormComponent, 
    ResetPasswordComponent,
    LogoutComponent
  ]
})

export class UserModule { }
