import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AdminModule} from "./admin/admin.module";
import {AppComponent} from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AdminModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
