import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatToolbarModule} from '@angular/material';

import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, MatToolbarModule],
  exports: [HttpClientModule],
  providers: [HttpClient, HttpClientModule,],
  bootstrap: [AppComponent]
})
export class AppModule { }
