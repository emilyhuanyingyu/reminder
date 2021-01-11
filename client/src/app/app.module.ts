import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListsComponent } from './lists/lists.component';
import { DetailsComponent } from './details/details.component';
import { HttpClientModule } from "@angular/common/http";
import { MainService } from "./main.service";
import { RemindersComponent } from './reminders/reminders.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessagesComponent } from './messages/messages.component';


@NgModule({
  declarations: [
    AppComponent,
    ListsComponent,
    DetailsComponent,
    RemindersComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [MainService],
  bootstrap: [AppComponent]
})
export class AppModule { }