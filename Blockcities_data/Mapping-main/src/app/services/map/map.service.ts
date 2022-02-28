import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import { AsyncSubject } from 'rxjs';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map = new AsyncSubject<mapboxgl.Map>();

  constructor(
    private http: HttpClient  ) {
  }

  getData(file = 1): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
     'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijc4YjUzOThiYTI3YjIxNzE4YTU4ZjFjMDQ2MTYxODJkODY5M2YxZmJkZWJjNDEyZDk4YjVmMjRiNDgzY2IxZmY0N2UyNmQ1NDY2MTg3NjFhIn0'.eyJhdWQiOiI2IiwianRpIjoiNzhiNTM5OGJhMjdiMjE3MThhNThmMWMwNDYxNjE4MmQ4NjkzZjFmYmRlYmM0MTJkOThiNWYyNGI0ODNjYjFmZjQ3ZTI2ZDU0NjYxODc2MWEiLCJpYXQiOjE2MTQ5MTIxNjYsIm5iZiI6MTYxNDkxMjE2NiwiZXhwIjoxOTMwNDQ0OTY2LCJzdWIiOiIxNDUyOCIsInNjb3BlcyI6W119.Eawa_GwRoONGx7FM5FXQTacU7EftnTLdhFPD5xpALhGWqhElUX1hBkZgcqmXOCEhad-LFeiCVI6bx7OjZ9ZEZQ`
    })

    // return this.http.get<any>(`../../../assets/data.${file}.json`);
    return this.http.get('https://www.huduser.gov/hudapi/public/fmr/data/0801499999BlcyI6W119.Eawa_GwRoONGx7FM5FXQTacU7EftnTLd', { headers: headers });

  }
  reverseGeocoding(latlong) : Observable<any> {
    return this.http.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${latlong.lng},${latlong.lat}.json?access_token=${environment.mapbox.accessToken}`)
  }

}
