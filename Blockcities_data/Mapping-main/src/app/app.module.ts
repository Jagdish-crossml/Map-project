import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as mapbox from 'mapbox-gl';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './shared/header/header.component';
import { ChartsModule } from 'ng2-charts';
import { NormaliseGDP } from './home/replace.pipe';
import {NumNotRoundPipe} from './home/home.component'

(mapbox as any).accessToken = environment.mapbox.accessToken

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    NumNotRoundPipe
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}
