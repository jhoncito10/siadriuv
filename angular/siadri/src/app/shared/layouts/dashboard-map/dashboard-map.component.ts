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

  opciones: any= {};
  layersControl: any= {};
  geojson: any= {};

  constructor( ) {
    this.layersControl = {
      baseLayers: {
        'Open Street Map': L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
        'Open Cycle Map': L.tileLayer('http://{s}.tile.opencyclemap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      },
      overlays: {
        'Circulo': L.circle([ 46.95, -122 ], { radius: 500000 }),
        'Big Square': L.polygon([[ 46.8, -121.55 ], [ 46.9, -121.55 ], [ 46.9, -121.7 ], [ 46.8, -121.7 ]]),
        'Marca': L.marker([ 46.879966, -121.726909 ])
      }
   }
   this.opciones = {
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 5,
    center: L.latLng([ 46.879966, -121.726909 ])
  }

  }

  ngOnInit() {
  }

}
