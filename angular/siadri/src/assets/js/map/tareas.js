
$(document).ready(function () {
 var map = L.map("map").setView([30, 0], 2);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    var myStyle = {
      fillColor: "grey",
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };

    $('#sidecol').empty();
    var myGeojSonLayerGroup = L.geoJson(world, {
      onEachFeature: myOnEachFeature,
      style: myStyle
    }).addTo(map);

    $(".cntrys").click(function() {
      var item = $(this);
      console.log("clicked on item " + item.data("countryName"));
      myGeojSonLayerGroup.resetStyle(myGeojSonLayerGroup);
      item.data("countryLayer").setStyle({
        fillColor: "red",
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
      });
    });

    function myOnEachFeature(feature, layer) {
      var props = feature.properties;
      var item = $('<div class="cntrys"><p class="title">' + props.name + '</a></p></div>');
      item.data("countryLayer", layer);
      item.data("countryName", props.name);
      $('#sidecol').append(item);
    }




});
