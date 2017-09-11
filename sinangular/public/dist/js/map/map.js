$(document).ready(function () {




  // declaracion de variables
  var $buttonCompra = false;
  

  // config mapa
  var map = L.map('map').setView([30, 0], 2);
  var paises = {};
  L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {

    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);


  map.setView([3.376480, -76.533414], 2);



  // Define an icon called cssIcon
  var cssIcon = L.divIcon({
    // Specify a class name we can refer to in CSS.
    className: 'css-icon',
    html: '<div class="gps_ring"></div>'
    // Set marker width and height
    , iconSize: [50, 50]
    // ,iconAnchor: [11,11]
  });

  // Create three markers and set their icons to cssIcon
  L.marker([3.376480, -76.533414], { icon: cssIcon }).addTo(map);


  var myGeojSonLayerGroup = L.geoJson(world, {
    onEachFeature: myOnEachFeature,
  });


  function myOnEachFeature(feature, layer) {
    
    paises[feature.properties.name] = feature.geometry;
  }
  



  var db = firebase.database();
  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }


  $('.menubusqueda').click(function () {// scripts de acciones en el menu

    if ($(this).attr('id') === 'menu-convenios-pais') {
      $('#myModal .form-group').html('');
      $('#myModal .form-group').html('<input type="text" class="form-control" placeholder="Ingrese un pais" id="input-busqueda-pais" >');
      $('#btns-buscar').html('<button type="button" class="btn btn-primary" id="btn-busqueda-pais">Buscar</button>');
      $("#input-busqueda-pais").easyAutocomplete(optionsAutoComplConvenios);
      $('#myModal').modal();
    } else if ($(this).attr('id') === 'menu-busqueda-por-tipo') {
      $('#myModal .form-group').html('');
      $('#myModal .form-group').html('<input type="text" class="form-control" placeholder="Ingrese un tipo" id="input-busqueda-tipo" >');
      $('#btns-buscar').html('<button type="button" class="btn btn-primary" id="btn-busqueda-tipo">Buscar</button>');
      $("#input-busqueda-tipo").easyAutocomplete(optionsAutoComplTipos);
      $('#myModal').modal();

    } else if ($(this).attr('id') === 'menu-busqueda-por-academia') {
      $('#myModal .form-group').html('');
      $('#myModal .form-group').html('<input type="text" class="form-control" placeholder="Ingrese un programa academico" id="input-busqueda-carreras" >');
      $('#btns-buscar').html('<button type="button" class="btn btn-primary" id="btn-busqueda-carreras">Buscar</button>');
      $("#input-busqueda-carreras").easyAutocomplete(optionsProgramaAcademicos);
      $('#myModal').modal();

    } else if ($(this).attr('id') === 'menu-contacto') {
      $('#myModal .form-group').html('');
      $('#myModal .form-group').html(`<h2 style="font-size:16px; text-align:left;"><strong>Información de Contacto</strong></h2>
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
    //myGeojSonLayerGroup.resetStyle();
    $("img").remove(".leaflet-marker-icon");
    $(".leaflet-marker-shadow").remove();
    $(".leaflet-popup").remove();
    $('#contenedor_resultados').empty();
    $('#btns-buscar').empty();

    db.ref("convenios")
      .orderByChild('country')
      .equalTo(valuequery)
      .once("value").then(function (convenios) {
        var i = 0,
          numconvenios = convenios.numChildren();
        return new Promise(function (resolve) {
          convenios.forEach(function (convenio) {
            var institution = convenio.val().institution || 'No disponible';
            var country = convenio.val().country || 'No disponible';
            var description = convenio.val().description || 'No disponible';
            var pdf = convenio.val().pdf || 'No disponible';
            var web = convenio.val().web || 'No disponible';
            var type = convenio.val().type || 'No disponible';
            var expires = convenio.val().expires || 'No disponible';
            $('#contenedor_resultados').append(`<div class="box box-widget widget-user-2">
            <div class="widget-user-header bg-yellow">
              
              <h3 class="widget-user-username">${institution}</h3>
              <h5 class="widget-user-desc">Pais: ${country}</h5>
            </div>
            <div class="box-footer no-padding">
              <ul class="nav nav-stacked">
                <li>Descripcion: ${description}</li>
                <li><a href="${pdf}" target="_blank">Documentacion <span class="pull-right badge bg-aqua">PDF</span></a></li>
                <li><a href="${web}" target="_blank">Site <span class="pull-right badge bg-green">web</span></a></li>
                <li>Tipo: ${type} </li>
                <li>Expira: ${expires} </li>
              </ul>
            </div>
          </div>`);
            i++;
            if (i === numconvenios) {
              resolve();
            }
          });

        });

      }).then(function (val) {
        
        
        
         i =  L.geoJSON(paises[valuequery], {
          setStyle: {
            fillColor: "red",
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
          }
        }).bindPopup(function (layer) {
          return $('#btn-sidebar').trigger('click');

        }).addTo(map);
        
        $('#sidebar-right-contenido').addClass( "control-sidebar-open" );
        
        
      });
  });



  $('#btns-buscar').on('click', '#btn-busqueda-tipo', function () {
    var valuequery = $('#input-busqueda-tipo').val();
    $('#myModal').modal('hide');
    //myGeojSonLayerGroup.resetStyle();
    $("img").remove(".leaflet-marker-icon");
    $(".leaflet-marker-shadow").remove();
    $(".leaflet-popup").remove();
    $('#contenedor_resultados').empty();
    $('#btns-buscar2').empty();

    db.ref("convenios")
      .orderByChild('type')
      .equalTo(valuequery)
      .once("value").then(function (convenios) {
        var i = 0,
          numconvenios = convenios.numChildren();
        return new Promise(function (resolve) {
          convenios.forEach(function (convenio) {
            var institution = convenio.val().institution || 'No disponible';
            var country = convenio.val().country || 'No disponible';
            var description = convenio.val().description || 'No disponible';
            var pdf = convenio.val().pdf || 'No disponible';
            var web = convenio.val().web || 'No disponible';
            var type = convenio.val().type || 'No disponible';
            var expires = convenio.val().expires || 'No disponible';
            $('#contenedor_resultados').append(`<div class="box box-widget widget-user-2">
                  <div class="widget-user-header bg-yellow">
                    <h3 class="widget-user-username">${institution}</h3>
                    <h5 class="widget-user-desc">Pais: ${country}</h5>
                  </div>
                  <div class="box-footer no-padding">
                    <ul class="nav nav-stacked">
                      <li>Descripcion: ${description}</li>
                      <li><a href="${pdf}" target="_blank">Documentacion <span class="pull-right badge bg-aqua">PDF</span></a></li>
                      <li><a href="${web}" target="_blank">Site <span class="pull-right badge bg-green">web</span></a></li>
                      <li>Tipo: ${type} </li>
                      <li>Expira: ${expires} </li>
                    </ul>
                  </div>
                </div>`);
                
                L.geoJSON(paises[country], {
                  setStyle: {
                    fillColor: "white",
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                  }
                }).bindPopup(function (layer) {
                //  
                  return $('#btn-sidebar').trigger('click');
                }).addTo(map);
                
            i++;
            if (i === numconvenios) {
              resolve();
            }
          });

        });

      }).then(function (val) {

        
        //$('#btn-sidebar').trigger('click');
        $('#sidebar-right-contenido').addClass( "control-sidebar-open" );
        
      });
  });




  $('#btns-buscar').on('click', '#btn-busqueda-carreras', function () {
    var valuequery = $('#input-busqueda-carreras').val();
    $('#myModal').modal('hide');
   // myGeojSonLayerGroup.resetStyle();
    $("img").remove(".leaflet-marker-icon");
    $(".leaflet-marker-shadow").remove();
    $(".leaflet-popup").remove();
    $('#contenedor_resultados').empty();
    $('#btns-buscar2').empty();

    L.geoJSON().resetStyle(paises);

    db.ref("convenios")
      .orderByChild('type')
      .once("value").then(function (convenios) {
        var i = 0,
          numconvenios = convenios.numChildren();
        return new Promise(function (resolve) {
          convenios.forEach(function (convenio) {
            object = convenio.val().programas_escuelas;
            for (var key in object) {
              if (object.hasOwnProperty(key)) {
                var element = object[key];
                var n = element.search(valuequery);

                if (n != -1) {
                  var institution = convenio.val().institution || 'No disponible';
                  var country = convenio.val().country || 'No disponible';
                  var description = convenio.val().description || 'No disponible';
                  var pdf = convenio.val().pdf || 'No disponible';
                  var web = convenio.val().web || 'No disponible';
                  var type = convenio.val().type || 'No disponible';
                  var expires = convenio.val().expires || 'No disponible';
                  $('#contenedor_resultados').append(`<div class="box box-widget widget-user-2">
                        <div class="widget-user-header bg-yellow">
                          <h3 class="widget-user-username">${institution}</h3>
                          <h5 class="widget-user-desc">Pais: ${country}</h5>
                        </div>
                        <div class="box-footer no-padding">
                          <ul class="nav nav-stacked">
                            <li>Descripcion: ${description}</li>
                            <li>Programas academicos: ${element}</li>
                            <li><a href="${pdf}" target="_blank">Documentacion <span class="pull-right badge bg-aqua">PDF</span></a></li>
                            <li><a href="${web}" target="_blank">Site <span class="pull-right badge bg-green">web</span></a></li>
                            <li>Tipo: ${type} </li>
                            <li>Expira: ${expires} </li>
                          </ul>
                        </div>
                      </div>`);
                      
                        i = L.geoJSON(paises[country], {
                        setStyle: {
                        fillColor: "yellow",
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                      }
                      }).bindPopup(function (layer) {
                        return $('#btn-sidebar').trigger('click');
                      }).addTo(map);
                      
                }

               
                
                
              }
            }
            i++;

            if (i === numconvenios) {
              resolve();
            }
          });

        });

      }).then(function (val) {

        
        //$('#btn-sidebar').trigger('click');
        $('#sidebar-right-contenido').addClass( "control-sidebar-open" );
        
      });
  });



});
