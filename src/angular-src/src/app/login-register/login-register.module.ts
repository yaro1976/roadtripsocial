import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlashMessagesModule} from 'angular2-flash-messages';

import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';

import {RegistrationFormComponent} from './registration-form/registration-form.component';
import {CivilityFormComponent} from './civility-form/civility-form.component';
import {ExtraDetailsFormComponent} from './extra-details-form/extra-details-form.component';

import {ShowImagesModule} from '../show-images/show-images.module';
import {AuthService} from '../services/auth/auth.service';
import {ChatboxModule} from '../chatbox/chatbox.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlashMessagesModule,
    ShowImagesModule,
    ChatboxModule
  ],
  declarations: [
    RegisterComponent,
    RegistrationFormComponent,
    CivilityFormComponent,
    ExtraDetailsFormComponent,
    LoginComponent
  ],
  providers: [
    AuthService
  ]
})
export class LoginRegisterModule { }
