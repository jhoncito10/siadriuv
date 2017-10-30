import { any } from 'codelyzer/util/function';
import { Component, OnInit } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';


@Component({
  selector: 'app-dashboard-map',
  templateUrl: './dashboard-map.component.html',
  styleUrls: ['./dashboard-map.component.css']
})
export class DashboardMapComponent implements OnInit {

  mapa: any= {};
  geojson: any= {};
  countryMouseover: any= {};

  constructor( ) {
   this.mapa = {
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 5,
    center: L.latLng([ 46.879966, -121.726909 ])
  }
   this.countryMouseover = function (feature, leafletEvent) {
    const layer = leafletEvent.target;
    layer.setStyle({
        weight: 2,
        color: '#666',
        fillColor: 'white'
    });
    layer.bringToFront();
};
  }

  ngOnInit() {
  }

}
