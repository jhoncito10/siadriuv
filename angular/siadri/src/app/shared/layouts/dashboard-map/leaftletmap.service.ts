import { Injectable } from '@angular/core';

declare var L: any;

@Injectable()
export class LeaftletmapService {
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
    var map = L.map("map", {
      center: [3.371109, -76.536738],
      zoom: 16,
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
      .addTo(map);

    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox.dark"
    }).addTo(map);

    var customLayer = L.geoJson(null, {
      style: myStyle
    });
  }
}
