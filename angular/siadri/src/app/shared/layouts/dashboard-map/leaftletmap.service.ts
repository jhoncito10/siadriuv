import { element } from 'protractor';
import { world } from './countries';
import { Injectable } from '@angular/core';


declare var L: any;

@Injectable()
export class LeaftletmapService {

  map:any;
  constructor() {}

  plotActivity() {
    var myStyle = {
      color: "#3949AB",
      weight: 5,
      opacity: 0.95
    };
    /*
  let map = new L.Map('map', {
    center: new L.LatLng(40.731253, -73.996139),
    zoom: 12,
  });*/
    this.map = L.map("map", {
      center: [13.463348,-23.266286],
      zoom: 3,
      zoomControl: false
    });
    /*
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  */
    L.control
      .zoom({
        position: "bottomleft"
      })
      .addTo(this.map);

    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox.dark"
    }).addTo(this.map);


    // L.marker([-0.152032,-75.373223]).addTo(map);

   this.organizarGeo();
    
    this.pintarPoligonos();


    var customLayer = L.geoJson(null, {
      style: myStyle
    });
    customLayer.eachLayer(function (layer) {
      layer.bindPopup("holi");
  });
  }

  organizarGeo(){
    for (var index = 0; index < world.features.length; index++) {
      var element = world.features[index];

      for (var j = 0; j < element.geometry.coordinates[0].length; j++) {
        var element2 =  element.geometry.coordinates[0][j];
        var aux;
        aux = element2[1];
        element2[1] = element2[0];
        element2[0] = aux;  
      }
    }
  }

  pintarPoligonos(){
    var latlngs = [[[-0.152032,-75.373223,], [ 0.084801,-75.373223,], [0.416047,-75.373223,]]];
    L.polygon(latlngs, {color: 'red'}).addTo(this.map);
    // for (var index = 0; index < world.features.length; index++) {
    //   var element = world.features[index];
    //   var latlngs = element.geometry.coordinates;
      
    //       var polygon = L.polygon(latlngs, {color: 'red'}).addTo(this.map);
    //       // zoom the map to the polygon
    //      //this.map.fitBounds(polygon.getBounds());
      
    // }

  }
}
