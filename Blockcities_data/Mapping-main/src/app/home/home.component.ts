import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import { combineLatest, of, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { MapService } from '../services/map/map.service';
import { MapboxLayer } from '@deck.gl/mapbox';
import { ScatterplotLayer } from '@deck.gl/layers';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { ThrowStmt } from '@angular/compiler';
import { h3ToChildren, getRes0Indexes, geoToH3,h3ToGeo, h3ToGeoBoundary, kRing, polyfill } from 'h3-js';
// import {geojson2h3} from 'geojson2h3';
import { h3SetToFeatureCollection } from 'geojson2h3';
import { element } from 'protractor';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'DecimalPipe'})
export class NumNotRoundPipe implements PipeTransform {
  transform(value: number): number {
    var num1 = Math.floor(value * 100) / 100;
    return num1;
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  showHeatMap = false;
  rentalPropertyAvailable = false;
  getState = '';
  getCity = '';
  getZip = '';
  city = '';
  country = '';
  state_name = '';
  countryCode = '';
  heatmap_hex: any = {};
  alldata: any = [];
  daysOnMarket = false;
  daysOnMarketVal = '';
  rentalRateShow = false;
  showtopproperties = false;
  showSummary = false;
  showRental = false;
  showWalkability = false;
  showCityInvestments = false;
  tileAvailable = false;
  country_card_spinner = false;
  city_card_spinner = false;
  showProForma = false;
  address = '';
  activeTile = '';
  getCitySummaryData: any = [];
  cityInvestmentProfile: any = [];
  cityTopProperties: any = [];
  CitySummaryShow = false;
  showMapAlert = true;
  h3IndexRes1 = '';
  currentLngLat:any = {};
  citySummary = [];
  cityInvestments = [];
  cityTopPropertiesList = [];
  selectCountry = '';
  countryList = [{"Code": "AF", "Name": "Afghanistan"},{"Code": "AX", "Name": "\u00c5land Islands"},{"Code": "AL", "Name": "Albania"},{"Code": "DZ", "Name": "Algeria"},{"Code": "AS", "Name": "American Samoa"},{"Code": "AD", "Name": "Andorra"},{"Code": "AO", "Name": "Angola"},{"Code": "AI", "Name": "Anguilla"},{"Code": "AQ", "Name": "Antarctica"},{"Code": "AG", "Name": "Antigua and Barbuda"},{"Code": "AR", "Name": "Argentina"},{"Code": "AM", "Name": "Armenia"},{"Code": "AW", "Name": "Aruba"},{"Code": "AU", "Name": "Australia"},{"Code": "AT", "Name": "Austria"},{"Code": "AZ", "Name": "Azerbaijan"},{"Code": "BS", "Name": "Bahamas"},{"Code": "BH", "Name": "Bahrain"},{"Code": "BD", "Name": "Bangladesh"},{"Code": "BB", "Name": "Barbados"},{"Code": "BY", "Name": "Belarus"},{"Code": "BE", "Name": "Belgium"},{"Code": "BZ", "Name": "Belize"},{"Code": "BJ", "Name": "Benin"},{"Code": "BM", "Name": "Bermuda"},{"Code": "BT", "Name": "Bhutan"},{"Code": "BO", "Name": "Bolivia, Plurinational State of"},{"Code": "BQ", "Name": "Bonaire, Sint Eustatius and Saba"},{"Code": "BA", "Name": "Bosnia and Herzegovina"},{"Code": "BW", "Name": "Botswana"},{"Code": "BV", "Name": "Bouvet Island"},{"Code": "BR", "Name": "Brazil"},{"Code": "IO", "Name": "British Indian Ocean Territory"},{"Code": "BN", "Name": "Brunei Darussalam"},{"Code": "BG", "Name": "Bulgaria"},{"Code": "BF", "Name": "Burkina Faso"},{"Code": "BI", "Name": "Burundi"},{"Code": "KH", "Name": "Cambodia"},{"Code": "CM", "Name": "Cameroon"},{"Code": "CA", "Name": "Canada"},{"Code": "CV", "Name": "Cape Verde"},{"Code": "KY", "Name": "Cayman Islands"},{"Code": "CF", "Name": "Central African Republic"},{"Code": "TD", "Name": "Chad"},{"Code": "CL", "Name": "Chile"},{"Code": "CN", "Name": "China"},{"Code": "CX", "Name": "Christmas Island"},{"Code": "CC", "Name": "Cocos (Keeling) Islands"},{"Code": "CO", "Name": "Colombia"},{"Code": "KM", "Name": "Comoros"},{"Code": "CG", "Name": "Congo"},{"Code": "CD", "Name": "Congo, the Democratic Republic of the"},{"Code": "CK", "Name": "Cook Islands"},{"Code": "CR", "Name": "Costa Rica"},{"Code": "CI", "Name": "C\u00f4te d'Ivoire"},{"Code": "HR", "Name": "Croatia"},{"Code": "CU", "Name": "Cuba"},{"Code": "CW", "Name": "Cura\u00e7ao"},{"Code": "CY", "Name": "Cyprus"},{"Code": "CZ", "Name": "Czech Republic"},{"Code": "DK", "Name": "Denmark"},{"Code": "DJ", "Name": "Djibouti"},{"Code": "DM", "Name": "Dominica"},{"Code": "DO", "Name": "Dominican Republic"},{"Code": "EC", "Name": "Ecuador"},{"Code": "EG", "Name": "Egypt"},{"Code": "SV", "Name": "El Salvador"},{"Code": "GQ", "Name": "Equatorial Guinea"},{"Code": "ER", "Name": "Eritrea"},{"Code": "EE", "Name": "Estonia"},{"Code": "ET", "Name": "Ethiopia"},{"Code": "FK", "Name": "Falkland Islands (Malvinas)"},{"Code": "FO", "Name": "Faroe Islands"},{"Code": "FJ", "Name": "Fiji"},{"Code": "FI", "Name": "Finland"},{"Code": "FR", "Name": "France"},{"Code": "GF", "Name": "French Guiana"},{"Code": "PF", "Name": "French Polynesia"},{"Code": "TF", "Name": "French Southern Territories"},{"Code": "GA", "Name": "Gabon"},{"Code": "GM", "Name": "Gambia"},{"Code": "GE", "Name": "Georgia"},{"Code": "DE", "Name": "Germany"},{"Code": "GH", "Name": "Ghana"},{"Code": "GI", "Name": "Gibraltar"},{"Code": "GR", "Name": "Greece"},{"Code": "GL", "Name": "Greenland"},{"Code": "GD", "Name": "Grenada"},{"Code": "GP", "Name": "Guadeloupe"},{"Code": "GU", "Name": "Guam"},{"Code": "GT", "Name": "Guatemala"},{"Code": "GG", "Name": "Guernsey"},{"Code": "GN", "Name": "Guinea"},{"Code": "GW", "Name": "Guinea-Bissau"},{"Code": "GY", "Name": "Guyana"},{"Code": "HT", "Name": "Haiti"},{"Code": "HM", "Name": "Heard Island and McDonald Islands"},{"Code": "VA", "Name": "Holy See (Vatican City State)"},{"Code": "HN", "Name": "Honduras"},{"Code": "HK", "Name": "Hong Kong"},{"Code": "HU", "Name": "Hungary"},{"Code": "IS", "Name": "Iceland"},{"Code": "IN", "Name": "India"},{"Code": "ID", "Name": "Indonesia"},{"Code": "IR", "Name": "Iran, Islamic Republic of"},{"Code": "IQ", "Name": "Iraq"},{"Code": "IE", "Name": "Ireland"},{"Code": "IM", "Name": "Isle of Man"},{"Code": "IL", "Name": "Israel"},{"Code": "IT", "Name": "Italy"},{"Code": "JM", "Name": "Jamaica"},{"Code": "JP", "Name": "Japan"},{"Code": "JE", "Name": "Jersey"},{"Code": "JO", "Name": "Jordan"},{"Code": "KZ", "Name": "Kazakhstan"},{"Code": "KE", "Name": "Kenya"},{"Code": "KI", "Name": "Kiribati"},{"Code": "KP", "Name": "Korea, Democratic People's Republic of"},{"Code": "KR", "Name": "Korea, Republic of"},{"Code": "KW", "Name": "Kuwait"},{"Code": "KG", "Name": "Kyrgyzstan"},{"Code": "LA", "Name": "Lao People's Democratic Republic"},{"Code": "LV", "Name": "Latvia"},{"Code": "LB", "Name": "Lebanon"},{"Code": "LS", "Name": "Lesotho"},{"Code": "LR", "Name": "Liberia"},{"Code": "LY", "Name": "Libya"},{"Code": "LI", "Name": "Liechtenstein"},{"Code": "LT", "Name": "Lithuania"},{"Code": "LU", "Name": "Luxembourg"},{"Code": "MO", "Name": "Macao"},{"Code": "MK", "Name": "Macedonia, the Former Yugoslav Republic of"},{"Code": "MG", "Name": "Madagascar"},{"Code": "MW", "Name": "Malawi"},{"Code": "MY", "Name": "Malaysia"},{"Code": "MV", "Name": "Maldives"},{"Code": "ML", "Name": "Mali"},{"Code": "MT", "Name": "Malta"},{"Code": "MH", "Name": "Marshall Islands"},{"Code": "MQ", "Name": "Martinique"},{"Code": "MR", "Name": "Mauritania"},{"Code": "MU", "Name": "Mauritius"},{"Code": "YT", "Name": "Mayotte"},{"Code": "MX", "Name": "Mexico"},{"Code": "FM", "Name": "Micronesia, Federated States of"},{"Code": "MD", "Name": "Moldova, Republic of"},{"Code": "MC", "Name": "Monaco"},{"Code": "MN", "Name": "Mongolia"},{"Code": "ME", "Name": "Montenegro"},{"Code": "MS", "Name": "Montserrat"},{"Code": "MA", "Name": "Morocco"},{"Code": "MZ", "Name": "Mozambique"},{"Code": "MM", "Name": "Myanmar"},{"Code": "NA", "Name": "Namibia"},{"Code": "NR", "Name": "Nauru"},{"Code": "NP", "Name": "Nepal"},{"Code": "NL", "Name": "Netherlands"},{"Code": "NC", "Name": "New Caledonia"},{"Code": "NZ", "Name": "New Zealand"},{"Code": "NI", "Name": "Nicaragua"},{"Code": "NE", "Name": "Niger"},{"Code": "NG", "Name": "Nigeria"},{"Code": "NU", "Name": "Niue"},{"Code": "NF", "Name": "Norfolk Island"},{"Code": "MP", "Name": "Northern Mariana Islands"},{"Code": "NO", "Name": "Norway"},{"Code": "OM", "Name": "Oman"},{"Code": "PK", "Name": "Pakistan"},{"Code": "PW", "Name": "Palau"},{"Code": "PS", "Name": "Palestine, State of"},{"Code": "PA", "Name": "Panama"},{"Code": "PG", "Name": "Papua New Guinea"},{"Code": "PY", "Name": "Paraguay"},{"Code": "PE", "Name": "Peru"},{"Code": "PH", "Name": "Philippines"},{"Code": "PN", "Name": "Pitcairn"},{"Code": "PL", "Name": "Poland"},{"Code": "PT", "Name": "Portugal"},{"Code": "PR", "Name": "Puerto Rico"},{"Code": "QA", "Name": "Qatar"},{"Code": "RE", "Name": "R\u00e9union"},{"Code": "RO", "Name": "Romania"},{"Code": "RU", "Name": "Russian Federation"},{"Code": "RW", "Name": "Rwanda"},{"Code": "BL", "Name": "Saint Barth\u00e9lemy"},{"Code": "SH", "Name": "Saint Helena, Ascension and Tristan da Cunha"},{"Code": "KN", "Name": "Saint Kitts and Nevis"},{"Code": "LC", "Name": "Saint Lucia"},{"Code": "MF", "Name": "Saint Martin (French part)"},{"Code": "PM", "Name": "Saint Pierre and Miquelon"},{"Code": "VC", "Name": "Saint Vincent and the Grenadines"},{"Code": "WS", "Name": "Samoa"},{"Code": "SM", "Name": "San Marino"},{"Code": "ST", "Name": "Sao Tome and Principe"},{"Code": "SA", "Name": "Saudi Arabia"},{"Code": "SN", "Name": "Senegal"},{"Code": "RS", "Name": "Serbia"},{"Code": "SC", "Name": "Seychelles"},{"Code": "SL", "Name": "Sierra Leone"},{"Code": "SG", "Name": "Singapore"},{"Code": "SX", "Name": "Sint Maarten (Dutch part)"},{"Code": "SK", "Name": "Slovakia"},{"Code": "SI", "Name": "Slovenia"},{"Code": "SB", "Name": "Solomon Islands"},{"Code": "SO", "Name": "Somalia"},{"Code": "ZA", "Name": "South Africa"},{"Code": "GS", "Name": "South Georgia and the South Sandwich Islands"},{"Code": "SS", "Name": "South Sudan"},{"Code": "ES", "Name": "Spain"},{"Code": "LK", "Name": "Sri Lanka"},{"Code": "SD", "Name": "Sudan"},{"Code": "SR", "Name": "Suriname"},{"Code": "SJ", "Name": "Svalbard and Jan Mayen"},{"Code": "SZ", "Name": "Swaziland"},{"Code": "SE", "Name": "Sweden"},{"Code": "CH", "Name": "Switzerland"},{"Code": "SY", "Name": "Syrian Arab Republic"},{"Code": "TW", "Name": "Taiwan, Province of China"},{"Code": "TJ", "Name": "Tajikistan"},{"Code": "TZ", "Name": "Tanzania, United Republic of"},{"Code": "TH", "Name": "Thailand"},{"Code": "TL", "Name": "Timor-Leste"},{"Code": "TG", "Name": "Togo"},{"Code": "TK", "Name": "Tokelau"},{"Code": "TO", "Name": "Tonga"},{"Code": "TT", "Name": "Trinidad and Tobago"},{"Code": "TN", "Name": "Tunisia"},{"Code": "TR", "Name": "Turkey"},{"Code": "TM", "Name": "Turkmenistan"},{"Code": "TC", "Name": "Turks and Caicos Islands"},{"Code": "TV", "Name": "Tuvalu"},{"Code": "UG", "Name": "Uganda"},{"Code": "UA", "Name": "Ukraine"},{"Code": "AE", "Name": "United Arab Emirates"},{"Code": "GB", "Name": "United Kingdom"},{"Code": "US", "Name": "United States"},{"Code": "UM", "Name": "United States Minor Outlying Islands"},{"Code": "UY", "Name": "Uruguay"},{"Code": "UZ", "Name": "Uzbekistan"},{"Code": "VU", "Name": "Vanuatu"},{"Code": "VE", "Name": "Venezuela, Bolivarian Republic of"},{"Code": "VN", "Name": "Viet Nam"},{"Code": "VG", "Name": "Virgin Islands, British"},{"Code": "VI", "Name": "Virgin Islands, U.S."},{"Code": "WF", "Name": "Wallis and Futuna"},{"Code": "EH", "Name": "Western Sahara"},{"Code": "YE", "Name": "Yemen"},{"Code": "ZM", "Name": "Zambia"},{"Code": "ZW", "Name": "Zimbabwe"}]

  getStateRentalRate: any = [];
  countryData: any = {};
  cityData: any = {};
  walkabilityData: any = {};
  rentalRateList = [];
  call_index = 1;
  roi_long = 0;
  roi_short = 0;
  airbnb_roi_long = 0;
  airbnb_roi_short = 0;
  title = 'mapbox-blockcities';
  top_property_marker = [];
  availableHexagons = [];
  showActiveTile = false;
  nftImage="../../../assets/images/ocean.jpg"
  showNFT = false;  
  // tile_map = {"832830fffffffff": "vtanXtVbeXX6X3dnH4dueyGzfM2qdyG3DP6yMD112WG",
  //   "832664fffffffff": "EoUx8Ez2vLjZfDEGpv9tRejzZq6YVV6moGwYfWg5a1TZ",
  //   "832a10fffffffff": "EHbZf7S2kMrQUqxFyzQW9yHVkWoxw1h4TSWQEFbeS3og",
  //   "832ab2fffffffff": "J8wLPi6N9hFPC3iS6dbbEyL9KKyi2Azvsf9LdcSXTP6D",
  //   "832aa8fffffffff": "Cc63Bcai2jTR2WudfhcF4boM35PU6HeLHnEi2LFcwEbG"}
      //  "8428001ffffffff"
    // tile_map = {'8426923ffffffff':'8LXBXfkhbqXXeXdoYMyxWRkuZeZjP9cH2zNCYDu5zf1K'}
    tile_map = {}
    activeNft = {}
    nft_count = 0
  @ViewChild('mapEl', { static: true })
  mapEl: ElementRef<HTMLDivElement>;

  private map: mapboxgl.Map;

  constructor(
    private mapSrv: MapService,
    private http: HttpClient
  ) {
  }

  ngAfterViewInit(): void {
    const bounds = [[-122.66336, 37.492987], [-122.250481, 37.871651]];

    this.map = new mapboxgl.Map({
      container: 'mapEl',
      style: 'mapbox://styles/mapbox/light-v9',
      center: { lng: -102.380979, lat: 35.877742 },
      zoom: 0,
      // pitch: 20,
      attributionControl: false
    });


    this.map.addControl(
      new mapboxgl.NavigationControl({
        showZoom: true,
        showCompass: true,
        visualizePitch: true,
      }),
      'bottom-right'
    );
    this.map.setRenderWorldCopies(false);
    this.map.setMaxBounds([[-180, -90], [180, 90]]);

    this.map.on('click', (e) => {
      console.log(e);
      // window.addEventListener('click',  (e) =>{
      // Fly to a random location by offsetting the point -74.50, 40
      // by up to 5 degrees.
      console.log(e.lngLat.lat, e.lngLat.lng)
      this.map.flyTo({
        center: [
          e.lngLat.lng,
          e.lngLat.lat
        ],
        zoom: 5,

        essential: true // this animation is considered essential with respect to prefers-reduced-motion
      });

      if (this.showHeatMap) {
        this.map.flyTo({
          center: [
            e.lngLat.lng,
            e.lngLat.lat
          ],
          zoom: 12,
  
          essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });  
      }
      this.currentLngLat = e.lngLat
      
      this.getStates(this.currentLngLat);
    });



    this.mapSrv.map.next(this.map);

    let hoveredStateId = null;
    let hoveredStateId1 = null;

    this.map.on('load',async () => {



      
      const layers = this.map.getStyle().layers;
      const labelLayerId = layers.find(
      (layer) => layer.type === 'symbol' && layer.layout['text-field']
      ).id;
       


      console.log('map loaded');

      var hexagons = this.h3indexes(4)
      var hexagons2 = this.h3indexes(3)
      var hexagons3 = this.h3indexes(1)
      // this.availableHexagons = hexagons

      this.heatmap_hex = {'8844fffffffffff': 0.8}
      console.log(this.heatmap_hex)
      // this.renderHexes(this.map, hexagons)



      this.map.addSource('states', {
        'type': 'geojson',
        'data':
          'https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson'
      });


      this.map.addSource('counties', {
        'type': 'geojson',
        'data':
          'https://gist.githubusercontent.com/jyaganeh/4301986/raw/b6f62f86866890d3a30d55154e9e0277369f6728/us-counties.json'
      });


      

      this.map.addSource('cities', {
        'type': 'geojson',
        'data':
          'https://blockcities-assets.s3.amazonaws.com/stanford-bx729wr3020-geojson.json'
      });

      

      // this.map.addLayer({
      //   'id': 'cities-circle',
      //   'type': 'circle',
      //   'source': 'cities',
      //   "minzoom": 7
      // });


      // const popup = new mapboxgl.Popup({
      //   closeButton: false,
      //   closeOnClick: false
      //   });

      // this.map.on('mouseenter', 'cities-circle', (e) => {
      //   // Change the cursor style as a UI indicator.
      //   this.map.getCanvas().style.cursor = 'pointer';
         
      //   // Copy coordinates array.
        
      //   var coordinates0 = e.features[0].properties.longitude
      //   var coordinates1 = e.features[0].properties.latitude
      //   const description = e.features[0].properties.name;
         
      //   while (Math.abs(e.lngLat.lng - coordinates0) > 180) {
      //     coordinates0 += e.lngLat.lng > coordinates0 ? 360 : -360;
      //   }
         
      //   // Populate the popup and set its coordinates
      //   // based on the feature found.
      //   popup.setLngLat([coordinates0, coordinates1]).setHTML(description).addTo(this.map);
      //   });
         
      //   this.map.on('mouseleave', 'cities-circle', () => {
      //     this.map.getCanvas().style.cursor = '';
      //   popup.remove();
      //   });

      this.map.addLayer({
        'id': 'state-fills',
        'type': 'fill',
        'source': 'states',
        'layout': {},
        'paint': {
          'fill-color': '#627BC1',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false], 0.2, 0.07]
        }
      });


      // When the user moves their mouse over the state-fill layer, we'll update the
      // feature state for the feature under the mouse.
      this.map.on('mousemove', 'state-fills', (e) => {

        if (e.features.length > 0) {
          if (hoveredStateId !== null) {
            this.map.setFeatureState(
              { source: 'states', id: hoveredStateId },
              { hover: false }
            );
              
          }
          hoveredStateId = e.features[0].id;
          this.map.setFeatureState(
            { source: 'states', id: hoveredStateId },
            { hover: true }
          );

        }
      });

      
      // When the mouse leaves the state-fill layer, update the feature state of the
      // previously hovered feature.
      this.map.on('mouseleave', 'state-fills', () => {
        console.log('hoveredStateId mouseleave', hoveredStateId )

        if (hoveredStateId !== null) {
          this.map.setFeatureState(
            { source: 'states', id: hoveredStateId },
            { hover: false }
          );
        }
        hoveredStateId = null;
      });
      this.renderHexes(this.map, hexagons2, hoveredStateId1, '2', 3, 5)
      this.renderHexes(this.map, hexagons3, hoveredStateId1, '3', 1, 3)
      this.http.get(`https://blockcities-assets.s3.amazonaws.com/vritual1-2.json`).subscribe(map_json => {
        console.log('map_json', map_json)
        this.tile_map = map_json
        this.renderHexes(this.map, hexagons, hoveredStateId1, '1', 5, 24)

      })
      
      this.mapSrv.map.complete();

    });

    this.mapSrv.getData(1)
      .pipe(
        switchMap(d => combineLatest(of(d), this.mapSrv.map)),
        map(([d, glMap]) => {
          return this.setLayers(glMap, d);
        })
      )
      .subscribe();
    this.search();
  }

  async getHeatmapHex(){
    var result = await this.http.post(`https://6v6cdh7hil.execute-api.us-east-1.amazonaws.com/dev/data/heatmap`, {}).toPromise()    
    this.heatmap_hex = result[0]
  }
  

  setLayers(m: mapboxgl.Map, data: any): Observable<mapboxgl.Map> {
    const scatter = new MapboxLayer({
      id: "scatter",
      type: ScatterplotLayer,
      data,
      source: "scatter",
      opacity: 0.8,
      filled: true,
      radiusMinPixels: 2,
      radiusMaxPixels: 5,
      getPosition: d => [d.longitude, d.latitude],
      getFillColor: d =>
        d.n_killed > 0 ? [200, 0, 40, 150] : [255, 140, 0, 100],
      pickable: true,
      onHover: ({ object, x, y }) => {
        if (!!object) {
          console.log(object, x, y);
        }
      }
    });

    m.addLayer(scatter);
    return of(m);


  }



calculateGrossRev(hudmonthly){
    return hudmonthly*(12);
}

calcNOIShortTerm(grossRev) {
    // Takes into account 50% of the rev for cost
    return grossRev*(.5);
}

calcNOILongTerm(grossRev) {
    // Takes into account 30% of the rev for cost   
    return grossRev*(.7);
}

calcReturnOnInvestment(noi, unitPrice) {
    // Calculates the return on investment
    let roi = (noi / unitPrice) * 100
    let roundedresult = Math.round(roi * 100) / 100;
    return roundedresult;
}

getROI(rentAmount, unitAmount, duration="long") {
    // gets ROI. Options are 0 - Short Term noi, 1 -Long Term noi
    let grossRev = this.calculateGrossRev(rentAmount);
    if (duration == "long") {
        var noi = this.calcNOILongTerm(grossRev);
    } else if (duration == "short") {
        var noi = this.calcNOIShortTerm(grossRev);
    }
    let roi = this.calcReturnOnInvestment(noi, unitAmount);
    return roi;
}

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  changeResolution(event){
    
    var resolution = event.target.value;
    // this.renderHexes
    // this.h3IndexRes1 = geoToH3(lnglat['lat'], lnglat['lng'], 1);
    // var childrenHexes = this.getChildrenHexes(this.h3IndexRes1,2)
    // var hoveredStateId1 = null;
    // this.renderHexes(this.map, childrenHexes, hoveredStateId1, this.call_index)

  }
   
  getCountryData(countryCode){
     this.country_card_spinner = true
    var raw = JSON.stringify({"country":countryCode.toUpperCase() });    
  
    this.http.post(`https://6v6cdh7hil.execute-api.us-east-1.amazonaws.com/dev/data/country`, raw).subscribe(res => {
        
        this.countryData = res[0]
        this.country_card_spinner = false     
  })
}

getWalkabilityData(h3Index){

  this.country_card_spinner = true
  
  var raw = JSON.stringify({"tile_id":h3Index });    

  this.http.post(`https://6v6cdh7hil.execute-api.us-east-1.amazonaws.com/dev/data/walkability`, raw).subscribe(res => {
      
      this.walkabilityData = res[0]
      console.log('this.walkabilityData', this.walkabilityData)
      this.country_card_spinner = false
    if(typeof(this.walkabilityData) == 'undefined'){
      this.getWalkabilityLiveData()
    }
  })
  var ingestion_payload = JSON.stringify(
    {
     "lat": this.currentLngLat['lat'],
     "lon": this.currentLngLat['lng']
    });
this.http.post(`https://6v6cdh7hil.execute-api.us-east-1.amazonaws.com/dev/data_upload`, ingestion_payload).subscribe(res => {
  console.log('res', res)
})


}

getWalkabilityLiveData(){
      
  var ingestion_payload = JSON.stringify(
    {
     "lat": this.currentLngLat['lat'],
     "lon": this.currentLngLat['lng']
    
    });
  this.http.post(`https://6v6cdh7hil.execute-api.us-east-1.amazonaws.com/dev/data/live-data`, ingestion_payload).subscribe(res => {
    console.log('getWalkabilityLiveData', res)
    this.walkabilityData = res
})
}

getCityData(city, state){
  this.country_card_spinner = true
 var raw = JSON.stringify({ "state":state.toUpperCase(),
                            "city":this.capitalizeFirstLetter(city) });    

 this.http.post(`https://6v6cdh7hil.execute-api.us-east-1.amazonaws.com/dev/data/city`, raw).subscribe(res => {
     this.cityData = res[0]
     this.getProFormaData()
     this.country_card_spinner = false
     console.log(res[0])
     console.log(this.cityData)
     console.log('typeof(this.cityData)', typeof(this.cityData))
    if (typeof(this.cityData) == 'undefined'){
      this.getCitySummary()
      
    }
    })
    
     var ingestion_payload = JSON.stringify({ "state":state.toUpperCase(),
                                              "city":this.capitalizeFirstLetter(city),
                                              "address": this.address

                                            });
  this.http.post(`https://6v6cdh7hil.execute-api.us-east-1.amazonaws.com/dev/data_upload`, ingestion_payload).subscribe(res => {
    console.log('res', res)
    })
  



}
  // var processed: any = await fetch("https://6v6cdh7hil.execute-api.us-east-1.amazonaws.com/dev/data/country", requestOptions)
  //     .then(response => response.text())
  //     .then(result => console.log(result))
  //     .catch(error => console.log('error', error));

  // }

  getStates(lnglat) {
    if (!this.showRental && !this.showWalkability && !this.showHeatMap && !this.showProForma){
      this.showSummary = false;
    }


    this.call_index += 1
    this.showMapAlert = false;
    this.currentLngLat
    this.h3IndexRes1 = geoToH3(lnglat['lat'], lnglat['lng'], 1);
    var childrenHexes = this.getChildrenHexes(this.h3IndexRes1,2)
    var hoveredStateId1 = null;
    // this.renderHexes(this.map, childrenHexes, hoveredStateId1, this.call_index)
    
    this.getHeatmapHex()
    var h3Index = geoToH3(lnglat['lat'], lnglat['lng'], 8);
    console.log('h3Index', h3Index)
    // h3Index = '8844c158d3fffff'
    this.getWalkabilityData(h3Index)

    this.mapSrv.reverseGeocoding(lnglat).subscribe(res => {
      
      const region = res.features.filter(obj => obj.place_type.includes('region'));
      const address = res.features.filter(obj => obj.place_type.includes('address'));
      var place = res.features.filter(obj => obj.place_type.includes('place'));
      const postcode = res.features.filter(obj => obj.place_type.includes('postcode'));
      const countryData = res.features.filter(obj => obj.place_type.includes('country'));
      
      if (place.length == 0){
        place = res.features.filter(obj => obj.place_type.includes('region'));
        this.nftImage="../../../assets/images/ocean.jpg"
        this.city=""
      }
      
      try {
        var place_list = place[0].place_name.split(',')
        if (address.length>0){
        this.address = address[0].place_name
      }
        
        this.city = place_list[0];
        this.country = place_list[place_list.length-1];
        try {
          this.getState = region[0].properties.short_code.split('-')[1];
        } catch (error) {
          this.getState = ''   
        }
  
          this.countryCode = countryData[0].properties.short_code.toUpperCase();
        this.state_name = region[0].text
        if (postcode.length > 0){
        this.getZip = postcode[0].text
        }
      } catch (error) {
        console.log(error)        
      }
      
      this.getCountryData(this.countryCode)
      this.getCityData(this.city,this.getState)
      // document.querySelector<HTMLInputElement>('.mapboxgl-ctrl-geocoder--input').value = this.city + ',' + this.getState;

      this.rentalPropertyAvailable = true;
      
      
      if (this.rentalRateShow) {
        this.getRentalRate();
      };
    });
  }

  getProFormaData(){
    
    if(typeof(this.cityData) != 'undefined'){
      this.roi_long = this.getROI(this.cityData.avg_traditional_rental,this.cityData.avg_property_price,"long")
      this.roi_short = this.getROI(this.cityData.avg_traditional_rental,this.cityData.avg_property_price,"short")  
    }
    if(typeof(this.cityData) != 'undefined'){
    this.airbnb_roi_short = this.getROI(this.cityData.avg_airbnb_rental,this.cityData.avg_property_price,"short")
    this.airbnb_roi_long = this.getROI(this.cityData.avg_airbnb_rental,this.cityData.avg_property_price,"long")

    if (this.airbnb_roi_short == Number.POSITIVE_INFINITY || this.airbnb_roi_short == Number.NEGATIVE_INFINITY || isNaN(this.airbnb_roi_short)){
      this.airbnb_roi_short = 0;
    }
    if (this.airbnb_roi_long == Number.POSITIVE_INFINITY || this.airbnb_roi_long == Number.NEGATIVE_INFINITY || isNaN(this.airbnb_roi_long)){
      this.airbnb_roi_long = 0;
    }
    if (this.roi_short == Number.POSITIVE_INFINITY || this.roi_short == Number.NEGATIVE_INFINITY || isNaN(this.roi_short)){
      this.roi_short = 0;
    }
    if (this.roi_long == Number.POSITIVE_INFINITY || this.roi_long == Number.NEGATIVE_INFINITY || isNaN(this.roi_long)){
      this.roi_long = 0;
    }


    }
    // this.getROI(rentAmount, unitAmount, duration="long")
  }

  search() {
    
    var geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
    });
    document.getElementById('geocoder').appendChild(geocoder.onAdd(this.map));

    geocoder.on('result', (e) => {
      console.log('e', e)


      this.getStates({ 'lng': e.result.center[0], 'lat': e.result.center[1] })
    });

  }
  getProperies(city, address, city_name) {
    this.getState = city.split('-')[1];
    const headers = new HttpHeaders({
      "x-rapidapi-key": environment.rapidApiKey,
      "x-rapidapi-host": "mashvisor-api.p.rapidapi.com"
    });
    this.http.get(`https://mashvisor-api.p.rapidapi.com/property?state=${this.getState}&id=2430136`, { headers: headers }).subscribe(res => {
      this.alldata = res;
      console.log(this.alldata);
      if (this.alldata.status == 'success') {
        
        this.getCity = this.alldata.content.city;
        this.getZip = this.alldata.content.zip;
        console.log(this.getCity);
        this.rentalPropertyAvailable = true;
        this.daysOnMarketVal = this.alldata.content.daysOnMarket;
      }
    })
  }

  selectCountryHandler (event: any) {
    //update the ui
    this.selectCountry = event.target.value;
    this.getCountryData(this.selectCountry)
  }
  selectMapState(event: any){
    if (event.target.checked === false){
      this.map.setLayoutProperty('state-fills', 'visibility', 'none');
    }  else {
      this.map.setLayoutProperty('state-fills', 'visibility', 'visible');
      this.map.setLayoutProperty('state-fills', 'visibility', 'visible');
    }
  }
  selectMapGrid(event: any){
    if (event.target.checked === false){
      this.map.setLayoutProperty('hex-borders1', 'visibility', 'none');
      this.map.setLayoutProperty('hex-fills1', 'visibility', 'none');
      this.map.setLayoutProperty('hex-borders2', 'visibility', 'none');
      this.map.setLayoutProperty('hex-fills2', 'visibility', 'none');
    }  else {
      this.map.setLayoutProperty('hex-borders1', 'visibility', 'visible');
      this.map.setLayoutProperty('hex-fills1', 'visibility', 'visible');
      this.map.setLayoutProperty('hex-borders2', 'visibility', 'visible');
      this.map.setLayoutProperty('hex-fills2', 'visibility', 'visible');
    }
  }

  toggleSummary(){
  this.showSummary = !this.showSummary;
  this.showRental = false;
  this.showWalkability = false;
  this.showHeatMap = false;
  this.showProForma = false;
  }
  toogleProForma(){
    this.showProForma = !this.showProForma;
    this.showSummary = false;
    this.showRental = false;
    this.showWalkability = false;
    this.showHeatMap = false;
    
  }

  toggleWalkability(){
    if (Object.keys(this.currentLngLat).length == 0) {
      this.showMapAlert = true
    }
    this.showWalkability = !this.showWalkability;
    this.showSummary = false;
    this.showRental = false;  
    this.showHeatMap = false;
    this.showProForma = false;

  }

toogleHeatMap(){
  if (Object.keys(this.currentLngLat).length == 0) {
    this.showMapAlert = true
  }
  
  this.renderHeatmap(this.map, this.heatmap_hex)

  this.showHeatMap = !this.showHeatMap;
  this.showWalkability = false;
  this.showSummary = false;
  this.showRental = false;  
  this.showProForma = false;

}

  setInvestment() {
    this.showCityInvestments = !this.showCityInvestments;
    if (this.showCityInvestments) {
      this.getInvestment();
    }
  }

  setCitySummary() {
    this.CitySummaryShow = !this.CitySummaryShow;
    if (this.showtopproperties) {
      this.getCitySummary();
    }
  }

  setshowtopproperties() {
    this.showtopproperties = !this.showtopproperties;
    if (!this.showtopproperties) {
      this.top_property_marker.forEach((marker) => marker.remove())
      this.top_property_marker = []
    }
  }


  buyTile(){
    if (this.tile_map.hasOwnProperty(this.activeTile)){
      debugger
      var url=this.tile_map[this.activeTile][0]['Link'];
      window.open(url, '_blank').focus();
    } else {

      alert('No NFT Tile available for this region, Tile Id '+this.activeTile)
    }
    this.showActiveTile = false;
  }

  availableTile(){
    this.tileAvailable = !this.tileAvailable
  //  var tile_map = {"832830fffffffff": "vtanXtVbeXX6X3dnH4dueyGzfM2qdyG3DP6yMD112WG",
  //   "832664fffffffff": "EoUx8Ez2vLjZfDEGpv9tRejzZq6YVV6moGwYfWg5a1TZ",
  //   "832a10fffffffff": "EHbZf7S2kMrQUqxFyzQW9yHVkWoxw1h4TSWQEFbeS3og",
  //   "832ab2fffffffff": "J8wLPi6N9hFPC3iS6dbbEyL9KKyi2Azvsf9LdcSXTP6D",
  //   "832aa8fffffffff": "Cc63Bcai2jTR2WudfhcF4boM35PU6HeLHnEi2LFcwEbG"}
    // debugger
    // var tile_map_keys = Object.keys(this.tile_map)
    // tile_map_keys.forEach(element => {
    //   var layer_index = this.availableHexagons[element]
    //   debugger
    //   alert(this.availableHexagons[element])
      // 'hex-fills'+layer_index
      if (this.tileAvailable){
        this.availableHexagons.forEach(element => {
          // this.map.setPaintProperty('hex-fills'+element, 'fill-color', 'green');
          this.map.setFeatureState(
            { source: 'h3-hexes1', id: element },
            { highlight: true }
          );   
          this.map.setFeatureState(
            { source: 'h3-hexes1', id: element },
            { hover: true }
          );   
      });
  
      } else{
        this.availableHexagons.forEach(element => {
          // this.map.setPaintProperty('hex-fills'+element, 'fill-color', 'green');
          this.map.setFeatureState(
            { source: 'h3-hexes1', id: element },
            { highlight: false }
          );   
          this.map.setFeatureState(
            { source: 'h3-hexes1', id: element },
            { hover: false }
          );   
      });
  
      }

    // });
    // if (tile_map.hasOwnProperty(this.activeTile)){
    //   var url="https://tiles.blockcities.com/#/art/"+tile_map[this.activeTile];
    //   window.open(url, '_blank').focus();
    // } else {
    //   alert('No NFT available')
    // }
    
    
    
  }
  /* Airbnb Rental Rates Data */
  setRentalRate() {
    
    if (Object.keys(this.currentLngLat).length == 0) {
      this.showMapAlert = true
    }
    this.showHeatMap = false;

    this.showSummary = false;
    this.showRental = !this.showRental;
    this.showWalkability = false;
    this.showProForma = false;

    // if (this.rentalRateShow) {
    //   this.getRentalRate();
    //   this.getTradRentalRate();
    // }
    // this.showCityInvestments = !this.showCityInvestments;
    // if (this.showCityInvestments) {
    //   this.getInvestment();
    // }
    // this.CitySummaryShow = !this.CitySummaryShow;
    // if (this.showtopproperties) {
    //   this.getCitySummary();
    // }
  }

  getRentalRate() {
    if (this.rentalRateShow) {
      this.rentalRateList = [];
      const headers = new HttpHeaders({
        "x-rapidapi-key": environment.rapidApiKey,
        "x-rapidapi-host": "mashvisor-api.p.rapidapi.com"
      });
      this.http.get(`https://mashvisor-api.p.rapidapi.com/rental-rates?state=${this.getState}&source=airbnb&city=${this.city}&zip_code=${this.getZip}`, { headers: headers }).subscribe(res => {
        
        this.getStateRentalRate = res;
        if (this.getStateRentalRate.status == 'success') {
          this.rentalRateList.push(this.getStateRentalRate.content.retnal_rates);
          //console.log(this.getStateRentalRate.content.retnal_rates);
        }
      });
    }
  }

  public barChartOptions: ChartOptions = {
    responsive: true,
  };

  public barChartLabels: Label[] = ['0 Rooms', '1 Room', '2 Rooms', '3 Rooms', '4 Rooms'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Airbnb', backgroundColor: '#FF708B' },
    { data: [], label: 'Traditional', backgroundColor: '#383874' }
  ];

  getCitySummary() {
    
    console.log('calling getCitySummary')
    this.citySummary = [];
    const headers = new HttpHeaders({
      "x-rapidapi-key": environment.rapidApiKey,
      "x-rapidapi-host": "mashvisor-api.p.rapidapi.com"
    });
    
    this.http.get(`https://mashvisor-api.p.rapidapi.com/trends/summary/${this.getState}/${this.city}`, { headers: headers }).subscribe(res => {
      this.getCitySummaryData = res;
      console.log('this.getCitySummaryData', this.getCitySummaryData)
      if (this.getCitySummaryData.status == 'success') {
        this.cityData = this.getCitySummaryData.content;
        this.getProFormaData()
        console.log('this.cityData updated', this.cityData)

        // this.citySummary.push(this.getCitySummaryData.content);
      } else{
        this.cityData = {}
        this.getProFormaData()

      }
    });

    // if (this.showtopproperties) {
    //   this.cityTopPropertiesList = [];
    //   this.http.get(`https://mashvisor-api.p.rapidapi.com/city/properties/${this.getState}/${this.city}`, { headers: headers }).subscribe(res => {
    //     this.cityTopProperties = res;

    //     if (this.cityTopProperties.status == 'success') {

    //       this.cityTopPropertiesList = this.cityTopProperties.content.properties;

    //       this.cityTopPropertiesList.forEach(element => {
    //         var popup = new mapboxgl.Popup({ offset: 25 })
    //           .setLngLat([element.longitude, element.latitude])
    //           .setHTML('\
    //       <p><img width="220px" height="150px" src='+ element.image + '></p>\
    //       <p style="width: 100%;margin:5px 0; font-size: 15px;"><i class="bi bi-building"></i> '+ element.address + '</p>\
    //       <p style="width: 100%;margin:5px 0;float:left"> <b style="width: 70%;float: left;"><i class="bi bi-rulers"></i> &nbsp;Sqft: </b>'+ element.sqft + '</p>\
    //       <p style="width: 100%;margin:5px 0;float:left"> <b style="width: 70%;float: left;"><i class="bi bi-tag"></i> &nbsp;List Price: </b>'+ element.list_price_formatted + '</p>\
    //       <p style="width: 100%;margin:5px 0;float:left"> <b style="width: 70%;float: left;"><i class="bi bi-cash-stack"></i> &nbsp;Traditional ROI: </b>'+ element.price_per_sqft + '</p>\
    //       <p style="width: 100%;margin:5px 0;float:left"> <b style="width: 70%;float: left;"><i class="bi bi-tags"></i> &nbsp;Last Sale Price: </b>'+ element.last_sale_price + '</p>\
    //       <p style="width: 100%;margin:5px 0;float:left"> <b style="width: 70%;float: left;"><i class="bi bi-calendar-week"></i> &nbsp;Days on Market: </b>'+ element.days_on_market + '</p>\
    //       <p style="width: 100%;margin:5px 0;float:left"> <b style="width: 70%;float: left;"><i class="bi bi-cash"></i> &nbsp;Airbnb Rental Income: </b>'+ element.rental_income.airbnb + '</p>\
    //       <p style="width: 100%;margin:5px 0;float:left"> <b style="width: 70%;float: left;"><i class="bi bi-cash"></i> &nbsp;Traditional Rental Income: </b>'+ element.rental_income.traditional + '</p>')
    //         var marker = new mapboxgl.Marker()
    //         marker.setLngLat([element.longitude, element.latitude])
    //         marker.addTo(this.map); // add the marker to the map
    //         marker.setPopup(popup) // sets a popup on this marker
    //         this.top_property_marker.push(marker);
    //       });
    //     }


    //   });
    // }
  }

  getInvestment() {
    const headers = new HttpHeaders({
      "x-rapidapi-key": environment.rapidApiKey,
      "x-rapidapi-host": "mashvisor-api.p.rapidapi.com"
    });
    this.cityInvestments = [];
    
    this.http.get(`https://mashvisor-api.p.rapidapi.com/city/investment/${this.getState}/${this.city}`, { headers: headers }).subscribe(res => {
      this.cityInvestmentProfile = res;

      if (this.cityInvestmentProfile.status == 'success') {
        this.barChartData[1].data = [];
        this.barChartData[0].data = [];
        this.cityInvestments.push(this.cityInvestmentProfile.content);
        var airbnb_rental_rates = this.cityInvestmentProfile.content.airbnb_rental_rates
        for (const key in airbnb_rental_rates) {
          this.barChartData[0].data.push(airbnb_rental_rates[key])
        }
        var traditional_rental_rates = this.cityInvestmentProfile.content.traditional_rental_rates
        for (const key in traditional_rental_rates) {
          this.barChartData[1].data.push(traditional_rental_rates[key])
        }
      }
    });
  }

  onMarkerClicked() {
    console.log("click");
  }

  /* Traditional Rental Rates Data */
  getStateTradRentalRate: any = [];

  tradRentalRateList = [];
  getTradRentalRate() {
    console.log(this.tradRentalRateList);
    this.tradRentalRateList = [];
    const headers = new HttpHeaders({
      "x-rapidapi-key": environment.rapidApiKey,
      "x-rapidapi-host": "mashvisor-api.p.rapidapi.com"
    });
    
    this.http.get(`https://mashvisor-api.p.rapidapi.com/rental-rates?state=${this.getState}&source=traditional&city=${this.getCity}&zip_code=${this.getZip}`, { headers: headers }).subscribe(res => {
      this.getStateTradRentalRate = res;
      if (this.getStateTradRentalRate.status == 'success') {

        this.tradRentalRateList.push(this.getStateTradRentalRate.content.retnal_rates);
      }
    });
  }


  /* Air bnb Data */
  getStateairbnb: any = [];
  tradRentalbnbShow = false;
  tradRentalbnbList = [];
  getairbnb() {
    console.log(this.tradRentalbnbList);
    this.tradRentalbnbList = [];
    const headers = new HttpHeaders({
      "x-rapidapi-key": environment.rapidApiKey,
      "x-rapidapi-host": "mashvisor-api.p.rapidapi.com"
    });
    this.http.get(`https://mashvisor-api.p.rapidapi.com/rental-rates?state=${this.getState}&source=traditional&city=${this.getCity}&zip_code=${this.getZip}`, { headers: headers }).subscribe(res => {
      this.getStateairbnb = res;
      if (this.getStateairbnb.status == 'success') {
        this.tradRentalbnbShow = true;
        this.tradRentalbnbList.push(this.getStateairbnb.content.retnal_rates);
      }
    });
  }


  /* Traditional Occupancy Data */
  getStateairoccupancy: any = [];
  tradRentaloccupancyShow = false;
  tradRentaloccupancyList = [];
  getairoccupancy() {
    console.log(this.tradRentaloccupancyList);
    this.tradRentaloccupancyList = [];
    const headers = new HttpHeaders({
      "x-rapidapi-key": environment.rapidApiKey,
      "x-rapidapi-host": "mashvisor-api.p.rapidapi.com"
    });
    this.http.get(`https://mashvisor-api.p.rapidapi.com/rental-rates?state=${this.getState}&source=traditional&city=${this.getCity}&zip_code=${this.getZip}`, { headers: headers }).subscribe(res => {
      this.getStateairoccupancy = res;
      if (this.getStateairoccupancy.status == 'success') {
        this.tradRentaloccupancyShow = true;
        this.tradRentaloccupancyList.push(this.getStateairoccupancy.content.retnal_rates);
      }
    });
  }


  /* Traditional Roi Data */
  getStatetraditionalroi: any = [];
  tradRentaltraditionalroiShow = false;
  tradRentaltraditionalroiList = [];
  gettraditionalroi() {
    console.log(this.tradRentaltraditionalroiList);
    this.tradRentaltraditionalroiList = [];
    const headers = new HttpHeaders({
      "x-rapidapi-key": environment.rapidApiKey,
      "x-rapidapi-host": "mashvisor-api.p.rapidapi.com"
    });
    this.http.get(`https://mashvisor-api.p.rapidapi.com/rental-rates?state=${this.getState}&source=traditional&city=${this.getCity}&zip_code=${this.getZip}`, { headers: headers }).subscribe(res => {
      this.getStatetraditionalroi = res;
      if (this.getStatetraditionalroi.status == 'success') {
        this.tradRentaltraditionalroiShow = true;
        this.tradRentaltraditionalroiList.push(this.getStatetraditionalroi.content.retnal_rates);
      }
    });
  }


  /* Traditional occupancy Data */
  getStatetraditionaloccupancy: any = [];
  tradRentaltraditionaloccupancyShow = false;
  tradRentaltraditionaloccupancyList = [];
  gettraditionaloccupancy() {
    console.log(this.tradRentaltraditionaloccupancyList);
    this.tradRentaltraditionaloccupancyList = [];
    const headers = new HttpHeaders({
      "x-rapidapi-key": environment.rapidApiKey,
      "x-rapidapi-host": "mashvisor-api.p.rapidapi.com"
    });
    this.http.get(`https://mashvisor-api.p.rapidapi.com/rental-rates?state=${this.getState}&source=traditional&city=${this.getCity}&zip_code=${this.getZip}`, { headers: headers }).subscribe(res => {
      this.getStatetraditionaloccupancy = res;
      if (this.getStatetraditionaloccupancy.status == 'success') {
        this.tradRentaltraditionaloccupancyShow = true;
        this.tradRentaltraditionaloccupancyList.push(this.getStatetraditionaloccupancy.content.retnal_rates);
      }
    });
  }

  h3indexes(resolution) {
    // Get all of the base cells for the initial iteration
    const baseCells = getRes0Indexes();
    const hexes = {};
    var hex_index = 0;
    const bounds = this.map.getBounds();
    // debugger
    // var polygon = [[bounds["_sw"]['lat'], bounds["_sw"]['lng']], 
    //                [bounds["_ne"]['lat'], bounds["_ne"]['lng']], 
    //                [bounds["_sw"]['lng'], bounds["_sw"]['lat'] ]]
    // var hexagons = polyfill(polygon, 0);
    // debugger
    // var polygon = [[53.34669780736859, -168.827311010202],
    // [53.42532748013827, -133.429361791452],
    // [14.034410278532205, -114.55485007270201],
    // [14.119661502130421, -61.86442038520205],
    // [71.50544606932016, -57.20621726020205],
    // [71.83710307285531, -168.65152976020204]]

    
    // // var latbounds = new mapboxgl.LngLatBounds(polygon);
      

    
    for (const index of baseCells) {
      var children = Object.values({ ...h3ToChildren(index,resolution) });


      children.forEach((element) => {
        hex_index += 1;
        hexes[element.toString().toLowerCase()] = hex_index;
      });

    }

    // hexes.reduce((res, hexagon) => ({...res, [hexagon]: Math.random()}), {});

    return hexes;
  }


  getChildrenHexes(index, res){
    var hexes = {};
    var hex_index = 0;
      var children = Object.values({ ...h3ToChildren(index, res) });


      children.forEach((element) => {
        hex_index += 1;
        hexes[element.toString().toLowerCase()] = hex_index;
      });
      return hexes
  }


  fixTransmeridian(feature) {
    function fixTransmeridianCoord(coord) {
      const lng = coord[0];
      coord[0] = lng < 0 ? lng + 360 : lng;
    }

    function fixTransmeridianLoop(loop) {
      let isTransmeridian = false;
      for (let i = 0; i < loop.length; i++) {
        // check for arcs > 180 degrees longitude, flagging as transmeridian
        if (Math.abs(loop[0][0] - loop[(i + 1) % loop.length][0]) > 180) {
          isTransmeridian = true;
          break;
        }
      }
      if (isTransmeridian) {
        loop.forEach(fixTransmeridianCoord);
      }
    }

    function fixTransmeridianPolygon(polygon) {
      polygon.forEach(fixTransmeridianLoop);
    }
    const { type } = feature;
    if (type === 'FeatureCollection') {
      feature.features.map(this.fixTransmeridian);
      return;
    }
    const { type: geometryType, coordinates } = feature.geometry;

    switch (geometryType) {
      case 'LineString':
        fixTransmeridianLoop(coordinates);
        return;
      case 'Polygon':
        fixTransmeridianPolygon(coordinates);
        return;
      case 'MultiPolygon':
        coordinates.forEach(fixTransmeridianPolygon);
        return;
      default:
        throw new Error(`Unknown geometry type: ${geometryType}`);
    }
  }
  renderHeatmap(map, hexagons) {
    var config = {
      lng: -122.4,
      lat: 37.7923539,
      zoom: 11.5,
      fillOpacity: 0.6,
      colorScale: ["#ffffcc", "#78c679", "#006837"]
    }
    
    

    // Transform the current hexagon map into a GeoJSON object
    const heatmapgeojson = h3SetToFeatureCollection(
      Object.keys(hexagons),
      hex => ({value: hexagons[hex]})
    );
    this.fixTransmeridian(heatmapgeojson);
    for (var feature in heatmapgeojson.features){
      heatmapgeojson.features[feature].id = parseInt(feature)
     }
     
    const sourceId = 'h3-hexes-heatmap';
    const layerId = `${sourceId}-layer`;
    let source = map.getSource(sourceId);
    
    // Add the source and layer if we haven't created them yet
    if (!source) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: heatmapgeojson
      });
      map.addLayer({
        'id': 'heatmap-border',
        'type': 'line',
        'source': 'h3-hexes-heatmap',
        'layout': {},
        'paint': {
          'line-color': 'rgba(3, 23, 13,0.2)',
          'line-width': 3
        }
      });

      map.addLayer({
        id: layerId,
        source: sourceId,
        type: 'fill',
        interactive: false,
        paint: {
          'fill-outline-color': 'rgb(3, 23, 13)',
        }
      });
      source = map.getSource(sourceId);
    }
  
    // Update the geojson data
    source.setData(heatmapgeojson);
    
    // Update the layer paint properties, using the current config values
    map.setPaintProperty(layerId, 'fill-color', {
      property: 'value',
      stops: [
        [0, config.colorScale[0]],
        [0.5, config.colorScale[1]],
        [1, config.colorScale[2]]
      ]
    });
    
    map.setPaintProperty(layerId, 'fill-opacity', config.fillOpacity);
    
  }


  renderHexes(map, hexagons, hoveredStateId1, sourceIndex, minzoom, maxzoom) {

      // var hexagons = this.h3indexes()
      
      var geojson = h3SetToFeatureCollection(
        Object.keys(hexagons),
        hex => ({ id: parseInt(hexagons[hex]), value: hex })
      );
      this.fixTransmeridian(geojson);
      var tile_map_keys = Object.keys(this.tile_map)
      console.log('tile_map_keys', tile_map_keys)
      for (var feature in geojson.features){
        
        geojson.features[feature].id = parseInt(feature)
        if (tile_map_keys.includes(geojson.features[feature].properties.value)) {
          
          this.availableHexagons.push(parseInt(feature))
        }

    }
  
      // Add the source and layer if we haven't created them yet
      var sourceId = 'h3-hexes'+sourceIndex
      var layerId = 'hex-fills'+sourceIndex
      
      console.log('Adding layer', layerId)
      map.addSource(sourceId, {
        type: 'geojson',
        data: geojson
      });
      debugger
      map.addLayer({
        'id': 'hex-borders'+sourceIndex,
        'type': 'line',
        'source': sourceId,
        'layout': {},
        'minzoom': minzoom,
        'maxzoom': maxzoom,

        'paint': {
          'line-color': 'rgba(193, 98, 123,0.2)',
          'line-width': 1
        }
      });
      
      map.addLayer({
        'id': layerId,
        'type': 'fill',
        'source': sourceId,
        'layout': {},
        'minzoom': minzoom,
        'maxzoom': maxzoom,        
        'paint': {
          // 'fill-color': 'rgba(193, 98, 123,0.2)',
          'fill-color': [
            'case', 
            ['boolean', ['feature-state', 'highlight'], false], 
            '#84C446', // orange
            'rgba(193, 98, 123,0.2)'],
          
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false], 0.9, 0.1]
        }
      });

      map.on('click', layerId, (e) => {

        if (e.features.length > 0) {
            
          
          this.activeTile = e.features[0].properties.value
          this.nft_count = this.tile_map[this.activeTile]
          console.log('this.nft_count', this.nft_count)
          debugger
 
          var latlon = h3ToGeo(this.activeTile)
          var bbox = h3ToGeoBoundary(this.activeTile)
          
          this.nftImage = "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/"+latlon[1]+","+latlon[0]+",9.85,9,60/250x250?access_token=pk.eyJ1IjoiYmxvY2tjaXRpZXMiLCJhIjoiY2tqdWZvYTl1MmtzNTJ4bGVlOTh2N25tMiJ9.uHCNSl_ZAdgL1zrnUG1y7A"
          if (typeof this.tile_map[this.activeTile] !== 'undefined'){
            this.activeNft = this.tile_map[this.activeTile][0]
          } else {
            this.activeNft = {}
          }
          
          this.tileAvailable = true
          
          this.showNFT = true
          
          
          console.log('this.activeTile', this.activeTile)
          this.showActiveTile = true
        }

      })
      map.on('mousemove', layerId, (e) => {
        map.getCanvas().style.cursor = 'pointer'

        if (e.features.length > 0) {
          if (hoveredStateId1 !== null) {
            map.setFeatureState(
              { source: sourceId, id: hoveredStateId1 },
              { hover: false }
            );  
          }
          
          hoveredStateId1 = e.features[0].id;
          map.setFeatureState(
            { source: sourceId, id: hoveredStateId1 },
            { hover: true }
          );
        }
      });
  
      // When the mouse leaves the state-fill layer, update the feature state of the
      // previously hovered feature.
      map.on('mouseleave', layerId, () => {
        if (hoveredStateId1 !== null) {
          map.setFeatureState(
            { source: sourceId, id: hoveredStateId1 },
            { hover: false }
          );
        }
        hoveredStateId1 = null;
      });

  }

  ngOnDestory() {
    this.mapSrv.map.subscribe(glMap => {
      glMap.removeLayer("scatter");
    });
  }


}
