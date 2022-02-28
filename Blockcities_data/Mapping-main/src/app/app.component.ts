import { Component } from '@angular/core';
import { ViewChild } from '@angular/core'
import { ElementRef } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapService, } from './services/map/map.service';
import {MapboxLayer} from '@deck.gl/mapbox';
import {Observable} from 'rxjs';
import {ScatterplotLayer} from '@deck.gl/layers';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs'
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  

  constructor(
    private mapSrv: MapService
  ) {
}

}
