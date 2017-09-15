$(document).ready(function () {


  

    // declaracion de variables
    var $buttonCompra = false;

    // config mapa
    var map = L.map('map').setView([30, 0], 2);
    var paises = {};
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    	
    	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.control.zoom({
        position: 'bottomleft'
    }).addTo(map);

    var myStyle = {
      fillColor: "grey",
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };

    var myGeojSonLayerGroup = L.geoJson(world, {
      onEachFeature: myOnEachFeature,
      style: myStyle
    }).addTo(map);

    
     function myOnEachFeature(feature, layer) {
      var props = feature.properties;
      var item = $('<div class="cntrys"><p class="title">' + props.name + '</a></p></div>');
      item.data("countryLayer", layer);
      item.data("countryName", props.name);
      paises[feature.properties.name] = feature.geometry;
    }




    var db = firebase.database();
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }


    $('.menubusqueda').click(function () {// scripts de acciones en el menu

        if ($(this).attr('id') === 'menu-convenios-pais') {
            $('.form-group').html('');
            $('.form-group').html('<input type="text" class="form-control" aria-describedby="basic-addon1" placeholder="ingrese un pais" id="input-busqueda-pais" >');
            $('#btns-buscar').html('<button type="button" class="btn btn-primary" id="btn-busqueda-pais">Buscar</button>');
            $("#input-busqueda-pais").easyAutocomplete(optionsAutoComplConvenios);
            $('#myModal').modal();
        } else if ($(this).attr('id') === 'menu-contacto') {
          $('.form-group').html('');
          $('.form-group').html(`<h2 style="font-size:16px; text-align:left;"><strong>Información de Contacto</strong></h2>
          <ul style="list-style:none; text-align:left; padding:0px">
            <li>Vicerrectoria de investigaciones</li>
            <li><a href="mailto:convenios@correounivalle.edu.co" target="_top">laboratorios.sig@correounivalle.edu.co</a></li>
            <li>Ciudad Universitaria Melendez</li>
            <li>Teléfono +57 2 3212100 </li>
            <li>Universidad del Valle</li>
            <li>Cali - Colombia</li>

          </ul>`);
          $('#btns-buscar').html('');
          $('#myModal').modal();

        }



    });


    // scripts de Consultas informacion de los laboratorios
    // busqueda de lab por codigo del laboratorio

    // ubicacion del laboratorio por nombre
    $('#btns-buscar').on('click', '#btn-busqueda-pais', function () {
      var valuequery = $('#input-busqueda-pais').val();
         $('#myModal').modal('hide');
        myGeojSonLayerGroup.resetStyle(myGeojSonLayerGroup);
        $("img").remove(".leaflet-marker-icon");
        $(".leaflet-marker-shadow").remove();
        $(".leaflet-popup").remove();
        $('.form-group').empty();
        $('#btns-buscar').empty();
    
        db.ref("convenios")
        .orderByChild('country')
        .equalTo(valuequery)
        .once("value").then(function (convenios) {
          var i=0,
              numconvenios = convenios.numChildren();
          return new Promise(function(resolve){
            convenios.forEach(function(convenio){
                console.log( convenio.val() );
                $('.form-group').append(`<div class="box box-widget widget-user-2">
            <div class="widget-user-header bg-yellow">
              
              <h3 class="widget-user-username">${convenio.val().institution}</h3>
              <h5 class="widget-user-desc">Pais: ${convenio.val().country}</h5>
            </div>
            <div class="box-footer no-padding">
              <ul class="nav nav-stacked">
                <li>Descripcion: ${convenio.val().description}</li>
                <li><a href="${convenio.val().pdf}">Documentacion <span class="pull-right badge bg-aqua">PDF</span></a></li>
                <li><a href="${convenio.val().web}">Site <span class="pull-right badge bg-green">web</span></a></li>
                <li>Tipo: ${convenio.val().type} </li>
              </ul>
            </div>
          </div>`);
          i++;
          console.log(i,numconvenios);
          if (i === numconvenios) {
            console.log('resuelve');
            resolve();
          }
        });

          });
              
          }).then(function(val){
              L.geoJSON(paises[valuequery], {
              style: {
                fillColor: "red",
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
              }
          }).bindPopup(function (layer) {
              return $('#myModal').modal();
          }).addTo(map);

             $('#myModal').modal();
             console.log(paises);
               
            
              //  map.setView(new L.LatLng(leaftobj[i].Longitud, leaftobj[i].Latitud), 17);
            


        });
      });

     

});
