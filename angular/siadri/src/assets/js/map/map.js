$(document).ready(function () {




    // declaracion de variables
    var selectedFilter,
        mylayers, 
        map, 
        sql, 
        coffeeShopLocations, 
        layers;
        $buttonCompra = false;
    var map = L.map('map', { center: [3.371109, -76.536738], zoom: 16, zoomControl: false });

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    	maxZoom: 19,
    	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.control.zoom({
        position: 'bottomleft'
    }).addTo(map);


    var db = firebase.database();
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }


    $('.menubusqueda').click(function () {// scripts de acciones en el menu

        if ($(this).attr('id') === 'menu-busq-equipo') {
            $('.form-group').html('');
            $('.form-group').html('<input type="text" class="form-control" aria-describedby="basic-addon1" placeholder="Nombre del equipo" id="input-infolab-busq-equipo" style="text-transform:uppercase;" onkeyup="javascript:this.value=this.value.toUpperCase();">');
            $('#btns-buscar').html('<button type="button" class="btn btn-primary" id="btn-nombre-equipo">Buscar</button>');
            $('.spinner').remove();
            $('#myModal').modal();
        } else if ($(this).attr('id') === 'menu-ubicacion-lab') {
            $('.form-group').html('');
            $('.form-group').html('<input type="text" class="form-control" aria-describedby="basic-addon1" placeholder="Nombre del laboratorio" id="infolab-ubicacion-laboratorio-por-nombre" style="text-transform:uppercase;" onkeyup="javascript:this.value=this.value.toUpperCase();">');
            $('#btns-buscar').html('<button type="button" class="btn btn-primary" id="btn-nombre-laboratorio">Buscar</button>');
            $("#infolab-ubicacion-laboratorio-por-nombre").easyAutocomplete(optionsAutoCompl);
            $('.spinner').remove();
            $('#myModal').modal();

        } else if ($(this).attr('id') === 'menu-busqueda-por-director') {
            $('.form-group').html('');
            $('.form-group').html('<input type="text" class="form-control" aria-describedby="basic-addon1" placeholder="Director" id="infolab-busqueda-por-director" style="text-transform:uppercase;" onkeyup="javascript:this.value=this.value.toUpperCase();">');
            $('#btns-buscar').html('<button type="button" class="btn btn-primary" id="btn-director">Buscar</button>');
            $("#infolab-busqueda-por-director").easyAutocomplete(optionsdirectores);
            $('.spinner').remove();
            $('#myModal').modal();

        } else if ($(this).attr('id') === 'menu-busqueda-por-escuelas') {
            $('.form-group').html('');
            $('.form-group').html('<input type="text" class="form-control" aria-describedby="basic-addon1" placeholder="Nombre de la escuela" id="infolab-busqueda-por-escuelas" style="text-transform:uppercase;" onkeyup="javascript:this.value=this.value.toUpperCase();"> ');
            $('#btns-buscar').html('<button type="button" class="btn btn-primary" id="btn-nombre-escuela">Buscar</button>');
            $("#infolab-busqueda-por-escuelas").easyAutocomplete(optionsescuelas);
            $('.spinner').remove();
            $('#myModal').modal();

        } else if ($(this).attr('id') === 'menu-busqueda-por-grupos-investigacion') {
            $('.form-group').html('');
            $('.form-group').html('<input type="text" class="form-control" aria-describedby="basic-addon1" placeholder="Linea de investigación" id="infolab-busqueda-por-grupos-investigacion" style="text-transform:uppercase;" onkeyup="javascript:this.value=this.value.toUpperCase();"> ');
            $('#btns-buscar').html('<button type="button" class="btn btn-primary" id="btn-grupo-investigacion">Buscar</button>');
            $("#infolab-busqueda-por-grupos-investigacion").easyAutocomplete(optiongruposinvestigacion);
            $('.spinner').remove();
            $('#myModal').modal();

          } else if ($(this).attr('id') === 'menu-prue-ensayos-laboratorio') {
            $('.form-group').html('');
            $('.form-group').html('<input type="text" class="form-control" aria-describedby="basic-addon1" placeholder="Nombre laboratorio" id="input-prue-ensayos-laboratorio" style="text-transform:uppercase;" onkeyup="javascript:this.value=this.value.toUpperCase();"> ');
            $("#input-prue-ensayos-laboratorio").easyAutocomplete(optionsAutoCompl);
            $('#btns-buscar').html('<button type="button" class="btn btn-primary" id="btn-ensayos-laboratorio">Buscar</button>');
            $('.spinner').remove();
            $('#myModal').modal();

          } else if ($(this).attr('id') === 'menu-laboratorios-por-pruebas') {
            $('.form-group').html('');
            $('.form-group').html('<input type="text" class="form-control" aria-describedby="basic-addon1" placeholder="Prueba" id="input-laboratorios-por-pruebas" style="text-transform:uppercase;" onkeyup="javascript:this.value=this.value.toUpperCase();"> ');
            $('#btns-buscar').html('<button type="button" class="btn btn-primary" id="btn-busqueda-prueba">Buscar</button>');
            $("#input-laboratorios-por-pruebas").easyAutocomplete(optionsPruebaEnsayo);
            $('.spinner').remove();
            $('#myModal').modal();

          } else if ($(this).attr('id') === 'menu-busqueda-equipo-robustos') {
            $('.form-group').html('');
            $('.form-group').html('<input type="text" class="form-control" aria-describedby="basic-addon1" placeholder="Nombre equipo" id="input-busqueda-equipo-robustos" style="text-transform:uppercase;" onkeyup="javascript:this.value=this.value.toUpperCase();"> ');
            $('#btns-buscar').html('<button type="button" class="btn btn-primary" id="btn-equipo-robusto">Buscar</button>');
            $("#input-busqueda-equipo-robustos").easyAutocomplete(optionsDescripcionEquiposRobustos);
            $('.spinner').remove();
            $('#myModal').modal();

        } else if ($(this).attr('id') === 'menu-equipos-robustos') {
          $('.spinner').remove();
            equiposrobustosTodos();


        }else if ($(this).attr('id') === 'menu-contacto') {
          $('.spinner').remove();
          $('.form-group').html('');
          $('.form-group').html(`<h2 style="font-size:16px; text-align:left;"><strong>Información de Contacto</strong></h2>
          <ul style="list-style:none; text-align:left; padding:0px">
            <li>Vicerrectoria de investigaciones</li>
            <li><a href="mailto:laboratorios.sig@correounivalle.edu.co" target="_top">laboratorios.sig@correounivalle.edu.co</a></li>
            <li><a href="mailto:Laboratorio.geoposicionamiento@correounivalle.edu.co" target="_top">Laboratorio.geoposicionamiento@correounivalle.edu.co</a></li>
            <li><a href="mailto:jhon.barona@correounivalle.edu.co" target="_top">jhon.barona@correounivalle.edu.co</a></li>
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
    $('#btns-buscar').on('click', '#btn-nombre-laboratorio', function () {
        
        $("img").remove(".leaflet-marker-icon");
        $(".leaflet-marker-shadow").remove();
        $(".leaflet-popup").remove();
        $('.modal-body').append(`<div class="spinner">
                                  <div class="dot1"></div>
                                  <div class="dot2"></div>
                                </div>`);
        

        db.ref("informacion_laboratorios")
        .orderByChild('nombre_de_laboratorio')
        .equalTo($('#infolab-ubicacion-laboratorio-por-nombre').val())
        .once("value").then(function (laboratorio) {
          
            return new Promise(function(resolve){
              var i = 0;
								var children = laboratorio.numChildren();
                leaftobj = {};
                console.log(children);
                if (children === 0) {
                  resolve(leaftobj);
                  swal({
                        title: "Información",
                        text: 'La consulta no arrojo resultados ',
                        html: true,
                        type: "info",
                      });
              
                  $('.spinner').remove();
                  
                } else {
                  laboratorio.forEach(function(lab){

                if (lab.val().estado === "activo") {
                  leaftobj.laboratorio = lab.val();
                  resolve(leaftobj);
                }
                
              });}
              
            });
          }).then(function(leaftobj){
            if (isNumber(leaftobj.laboratorio.cod_georef)) {
              db.ref("edificios")
              .orderByChild("cod_georef")
              .equalTo(leaftobj.laboratorio.cod_georef)
              .once("value").then(function (snapshot) {
                return new Promise(function(resolve){
                  snapshot.forEach(function(edificio){
                      leaftobj.Latitud = edificio.val().Latitud;
                      leaftobj.Longitud = edificio.val().Longitud;
                        resolve(leaftobj);


                  });
                });
              }).then(function(leaftobj){
                $('.spinner').remove();
                if (leaftobj.Latitud !== 0) {
                  L.marker([leaftobj.Longitud, leaftobj.Latitud]).addTo(map)
                     .bindPopup("<b> Edificio: " + leaftobj.laboratorio.cod_escuela +
                     "<br> laboratorio: " + leaftobj.laboratorio.nombre_de_laboratorio +

                     "</b><br> Escuela: " + leaftobj.laboratorio.escuela_o_departamento +
                     "</b><br> Espacio: " + leaftobj.laboratorio.espacio +
                     "<br> Encargado: " + leaftobj.laboratorio.nombre_responsable +
                     "<br> Email contacto: " + leaftobj.laboratorio.email +
                     "<br> Teléfono contacto: " + leaftobj.laboratorio.telefono_lab + " ext "+leaftobj.laboratorio.telefono_ext_lab+
                     "<br> Grupo de investigación: " + leaftobj.laboratorio.grupo_de_investigacion)
                     .openPopup();
                     map.setView(new L.LatLng(leaftobj.Longitud, leaftobj.Latitud), 17);

                }else {
                  $('.spinner').remove();
                  swal({
                        title: "Información",
                        text: 'El laboratorio :'+leaftobj.laboratorio.nombre_de_laboratorio+' por el momento no tiene informacion geografica. Mientras tanto, ' +
                              'esta es la informacion de contacto: <br> Responsable: "'+leaftobj.laboratorio.nombre_responsable+"<br>Email: "+leaftobj.laboratorio.email,
                        html: true,
                        type: "info",
                      });
                }

               $('#myModal').modal('hide');
              }).catch(function (error) {
                $('.spinner').remove();
                  swal({
                            title: "Información",
                            text: 'Error de conexion intentelo mas tarde',
                            html: true,
                            type: "error",
                          });
                  });
            }else {
              $('.spinner').remove();
              swal({
                        title: "Información",
                        text: 'El laboratorio :'+leaftobj.laboratorio.nombre_de_laboratorio+' por el momento no tiene informacion geografica. Mientras tanto, ' +
                              'esta es la informacion de contacto: <br> Responsable: "'+leaftobj.laboratorio.nombre_responsable+"<br>Email: "+leaftobj.laboratorio.email,
                        html: true,
                        type: "info",
                      });

              $('#myModal').modal('hide');

            }


        });
      });

      // ubicacion del laboratorio por director del laboratorio
      $('#btns-buscar').on('click', '#btn-director', function () {
          
          $("img").remove(".leaflet-marker-icon");
          $(".leaflet-marker-shadow").remove();
          $(".leaflet-popup").remove();
          $('.modal-body').append(`<div class="spinner">
                                  <div class="dot1"></div>
                                  <div class="dot2"></div>
                                </div>`);
          db.ref("informacion_laboratorios")
					.orderByChild('nombre_responsable')
					.equalTo($('#infolab-busqueda-por-director').val())
					.once("value").then(function (laboratorios) {
            return new Promise(function(resolve){
              var i = 0;
								var children = laboratorios.numChildren();
                leaftobj = {};
                console.log(children);
                if (children === 0) {
                  resolve(leaftobj);
                  swal({
                        title: "Información",
                        text: 'La consulta no arrojo resultados ',
                        html: true,
                        type: "info",
                      });
              
                  $('.spinner').remove();
                  
                } else {
                  laboratorios.forEach(function(laboratorio){
                if (laboratorio.val().estado==="activo") {
                  var objpruebas = {};


                    if (leaftobj[laboratorio.val().cod_escuela]!==undefined) {
                        leaftobj[laboratorio.val().cod_escuela].nombre_de_laboratorio = leaftobj[laboratorio.val().cod_escuela].nombre_de_laboratorio + '<li>' + laboratorio.val().nombre_de_laboratorio + '</li>';
                    }else {
                        objpruebas.nombre_de_laboratorio =  '<li>' + laboratorio.val().nombre_de_laboratorio+ '</li>';
                        objpruebas.escuela_o_departamento = laboratorio.val().escuela_o_departamento;
                        objpruebas.cod_georef = laboratorio.val().cod_georef;
                        objpruebas.nombre_responsable = laboratorio.val().nombre_responsable;
                        objpruebas.email = laboratorio.val().email;
                        objpruebas.estado = laboratorio.val().estado;
                        objpruebas.Latitud = 0;
                        objpruebas.Longitud = 0;
                    leaftobj[laboratorio.val().cod_escuela] = objpruebas;
                    }
                    
                }
                i++;
                if (i==children) {
                  resolve(leaftobj);
                }
                    
              });
                }
              
              
            });
          }).then(function(leaftobj){
            var keys = Object.getOwnPropertyNames(leaftobj).sort();

            return new Promise(function (resolve) {
              var i = 0;
              keys.forEach(function(k){
                  db.ref("edificios")
                  .orderByChild("cod_georef")
                  .equalTo(leaftobj[k].cod_georef)
                  .once("child_added").then(function (snapshot) {
                    leaftobj[k].Latitud = snapshot.val().Latitud;
                    leaftobj[k].Longitud = snapshot.val().Longitud;
                    i++
                    if (i == keys.length) {
                      resolve(leaftobj);
                    }
                  });

                

              });

            });


          }).then(function (leaftobj) {

            for (i in leaftobj) {

              if (leaftobj[i].Longitud != 0) {
                L.marker([leaftobj[i].Longitud, leaftobj[i].Latitud]).addTo(map)
                  .bindPopup("<b> Edificio: " + i +"</b>"+
                  "<br> Director: " + leaftobj[i].nombre_responsable +
                  "<br> Escuela: " + leaftobj[i].escuela_o_departamento +
                  "<br> laboratorios: <ul>" + leaftobj[i].nombre_de_laboratorio +"</ul>")
                  .openPopup();
                map.setView(new L.LatLng(leaftobj[i].Longitud, leaftobj[i].Latitud), 17);
                $('.spinner').remove();
                $('#myModal').modal('hide');
              }else {
                
                swal({
                        title: "Información",
                        text: 'El laboratorio :'+leaftobj[i].nombre_de_laboratorio+' por el momento no tiene informacion geografica. Mientras tanto, ' +
                              'esta es la informacion de contacto: <br> Responsable: "'+leaftobj[i].nombre_responsable+"<br>Email: "+leaftobj[i].email,
                        html: true,
                        type: "info",
                      });
              $('.spinner').remove();
              $('#myModal').modal('hide');

              }

              }
            });

      });

      // ubicacion del laboratorio por escuela
      $('#btns-buscar').on('click', '#btn-nombre-escuela', function () {
          
          $("img").remove(".leaflet-marker-icon");
          $(".leaflet-marker-shadow").remove();
          $(".leaflet-popup").remove();
          $('.modal-body').append(`<div class="spinner">
                                  <div class="dot1"></div>
                                  <div class="dot2"></div>
                                </div>`);
          db.ref("informacion_laboratorios")
					.orderByChild('escuela_o_departamento')
					.equalTo($('#infolab-busqueda-por-escuelas').val())
					.once("value").then(function (laboratorios) {
							return new Promise(function(resolve){
                var i = 0;
								var children = laboratorios.numChildren();
                leaftobj = {};
                console.log(children);
                if (children === 0) {
                  resolve(leaftobj);
                  swal({
                        title: "Información",
                        text: 'La consulta no arrojo resultados ',
                        html: true,
                        type: "info",
                      });
              
                  $('.spinner').remove();
                  
                } else {
                  laboratorios.forEach(function(laboratorio){
											if (laboratorio.val().estado==="activo") {

                          var objpruebas = {};


                        if (leaftobj[laboratorio.val().cod_escuela]!==undefined) {
                            leaftobj[laboratorio.val().cod_escuela].nombre_de_laboratorio = leaftobj[laboratorio.val().cod_escuela].nombre_de_laboratorio + '<li>' + laboratorio.val().nombre_de_laboratorio + '</li>';
                        }else {
                            objpruebas.nombre_de_laboratorio =  '<li>' + laboratorio.val().nombre_de_laboratorio+ '</li>';
                            objpruebas.escuela_o_departamento = laboratorio.val().escuela_o_departamento;
                            objpruebas.cod_georef = laboratorio.val().cod_georef;
                            objpruebas.email = laboratorio.val().email;
                            objpruebas.Latitud = 0;
                            objpruebas.Longitud = 0;
                        leaftobj[laboratorio.val().cod_escuela] = objpruebas;
                        }
                        
                      }
                        i++;
                        console.log(i,children)
                        if (i==children) {
                          resolve(leaftobj);
                        }
								});
                }
								
								
							});
						}).then(function(leaftobj){
							var keys = Object.getOwnPropertyNames(leaftobj).sort();

							return new Promise(function (resolve) {
								var i = 0;
								keys.forEach(function(k){
									
										db.ref("edificios")
										.orderByChild("cod_georef")
										.equalTo(leaftobj[k].cod_georef)
										.once("child_added").then(function (snapshot) {
											leaftobj[k].Latitud = snapshot.val().Latitud;
											leaftobj[k].Longitud = snapshot.val().Longitud;
											i++
												if (i == keys.length) {
													resolve(leaftobj);
												}
										});

									

								});

							});


						}).then(function (leaftobj) {

							for (i in leaftobj) {

								if (leaftobj[i].Longitud != 0) {
									L.marker([leaftobj[i].Longitud, leaftobj[i].Latitud]).addTo(map)
											.bindPopup("<b> Edificio: " + i +
											"</b><br> Escuela: " + leaftobj[i].escuela_o_departamento +

											"<br> laboratorios: <ul>" + leaftobj[i].nombre_de_laboratorio )
											.openPopup();
									map.setView(new L.LatLng(leaftobj[i].Longitud, leaftobj[i].Latitud), 17);
                  $('.spinner').remove();
                  $('#myModal').modal('hide');
								}else {
                  swal({
                        title: "Información",
                        text: 'El laboratorio :'+leaftobj[i].nombre_de_laboratorio+' por el momento no tiene informacion geografica. Mientras tanto, ' +
                              'esta es la informacion de contacto: <br> Responsable: "'+leaftobj[i].nombre_responsable+"<br>Email: "+leaftobj[i].email,
                        html: true,
                        type: "info",
                      });
              
                  $('.spinner').remove();
                  $('#myModal').modal('hide');
                }

								}
							});

      });

      // ubicacion del laboratorio por grupo de investigacion
      $('#btns-buscar').on('click', '#btn-grupo-investigacion', function () {
          
          $("img").remove(".leaflet-marker-icon");
          $(".leaflet-marker-shadow").remove();
          $(".leaflet-popup").remove();
          $('.modal-body').append(`<div class="spinner">
                                  <div class="dot1"></div>
                                  <div class="dot2"></div>
                                </div>`);
            db.ref("informacion_laboratorios")
  					.orderByChild('grupo_de_investigacion')
  					.equalTo($('#infolab-busqueda-por-grupos-investigacion').val())
  					.once("value").then(function (laboratorios) {
              return new Promise(function(resolve){
                var i = 0;
								var children = laboratorios.numChildren();
                leaftobj = {};
                console.log(children);
                if (children === 0) {
                  resolve(leaftobj);
                  swal({
                        title: "Información",
                        text: 'La consulta no arrojo resultados ',
                        html: true,
                        type: "info",
                      });
              
                  $('.spinner').remove();
                  
                } else {
                  laboratorios.forEach(function(laboratorio){
                     if (laboratorio.val().estado === "activo") {
                        var objpruebas = {};


                      if (leaftobj[laboratorio.val().cod_escuela]!==undefined) {
                          leaftobj[laboratorio.val().cod_escuela].nombre_de_laboratorio = leaftobj[laboratorio.val().cod_escuela].nombre_de_laboratorio + '<li>' + laboratorio.val().nombre_de_laboratorio + '</li>';
                      }else {
                          objpruebas.nombre_de_laboratorio =  '<li>' + laboratorio.val().nombre_de_laboratorio+ '</li>';
                          objpruebas.escuela_o_departamento = laboratorio.val().escuela_o_departamento;
                          objpruebas.email = laboratorio.val().email;
                          objpruebas.grupo_de_investigacion = laboratorio.val().grupo_de_investigacion;
                          objpruebas.cod_georef = laboratorio.val().cod_georef;
                          objpruebas.nombre_responsable = laboratorio.val().nombre_responsable;
                          objpruebas.Latitud = 0;
                          objpruebas.Longitud = 0;
                      leaftobj[laboratorio.val().cod_escuela] = objpruebas;
                      }
                      
                      }
                      i++;
                      if (i==children) {
                      resolve(leaftobj);
                      }
                });
                };
                
              });
            }).then(function(leaftobj){
              var keys = Object.getOwnPropertyNames(leaftobj).sort();

              return new Promise(function (resolve) {
                var i = 0;
                keys.forEach(function(k){
                  
                    db.ref("edificios")
                    .orderByChild("cod_georef")
                    .equalTo(leaftobj[k].cod_georef)
                    .once("child_added").then(function (snapshot) {
                      leaftobj[k].Latitud = snapshot.val().Latitud;
                      leaftobj[k].Longitud = snapshot.val().Longitud;
                      i++
                        if (i == keys.length) {
                          resolve(leaftobj);
                        }
                    });

                

                });

              });


            }).then(function (leaftobj) {

              for (i in leaftobj) {

                if (leaftobj[i].Longitud != 0) {
                  L.marker([leaftobj[i].Longitud, leaftobj[i].Latitud]).addTo(map)
                      .bindPopup("<b> Edificio: " + i +
                      "</b><br> Escuela: " + leaftobj[i].escuela_o_departamento +
                      "</b><br> Grupo de investigación: " + leaftobj[i].grupo_de_investigacion +
                      "<br> email: " + leaftobj[i].email +
                      "<br> laboratorios: <ul>" + leaftobj[i].nombre_de_laboratorio +"</ul>")
                      .openPopup();
                  map.setView(new L.LatLng(leaftobj[i].Longitud, leaftobj[i].Latitud), 17);
                  $('.spinner').remove();
                 $('#myModal').modal('hide');

                }else {
                  $('.spinner').remove();
                  $('#myModal').modal('hide');
                  swal({
                        title: "Información",
                        text: 'El laboratorio :'+leaftobj[i].nombre_de_laboratorio+' por el momento no tiene informacion geografica. Mientras tanto, ' +
                              'esta es la informacion de contacto: <br> Responsable: "'+leaftobj[i].nombre_responsable+"<br>Email: "+leaftobj[i].email,
                        html: true,
                        type: "info",
                      });
                }

                }

              });

          
      });









    //scripts consultas ensayos informacion_laboratorios
    // que pruebas o ensayos se prestan en el laboratorio
    $('#btns-buscar').on('click', '#btn-ensayos-laboratorio', function () {
        
        $("img").remove(".leaflet-marker-icon");
        $(".leaflet-marker-shadow").remove();
        $(".leaflet-popup").remove();
        $('.modal-body').append(`<div class="spinner">
                                  <div class="dot1"></div>
                                  <div class="dot2"></div>
                                </div>`);
        var tempensayos = '';


        var funcionDibuja = function (nombre) {
                db.ref("informacion_laboratorios")
                .orderByChild('nombre_de_laboratorio')
                .equalTo(nombre).once("value").then( function (laboratorios) {
                var children = laboratorios.numChildren();  
                console.log(children);
                if (children === 0) {
                    swal({
                          title: "Información",
                          text: 'La consulta no arrojo resultados ',
                          html: true,
                          type: "info",
                        });
                
                    $('.spinner').remove();
                } else {
                  laboratorios.forEach(function (laboratorio) {
                    
                  
                if (laboratorio.val().estado === "activo") {
                  db.ref("edificios")
                        .orderByChild("cod_georef")
                        .equalTo(laboratorio.val().cod_georef).once("child_added", function (snapshot) {
                          
                            var i = 0;
                            var numChildren = 0;
                             db.ref("ensayos").orderByChild('nombre_laboratorio')
                                .equalTo(nombre)
                                .once("value").then(function(pruebas){
                                  
                                  numChildren = pruebas.numChildren();
                                  pruebas.forEach(function (prueba) {
                                    if (prueba.val().estado === "activo") {
                                            tempensayos = tempensayos + "<li>" + prueba.val().prueba_ensayo + "</li>";
                                          i++;

                                          if (i==numChildren) {
                                            L.marker([snapshot.val().Longitud, snapshot.val().Latitud]).addTo(map)
                                                .bindPopup("<div id=''><b>edificio: " + snapshot.val().edif +
                                                "</b><br>" + laboratorio.val().nombre_de_laboratorio +
                                                "<br> Escuela: " + laboratorio.val().escuela_o_departamento +
                                                "</b><br> Espacio: " + laboratorio.val().espacio +
                                                "<br> Encargado: " + laboratorio.val().nombre_responsable +
                                                "<br> Email contacto: " + laboratorio.val().email +
                                                "<br> Teléfono contacto: " + laboratorio.val().telefono_lab +

                                                "<br> prueba:<ul> " + tempensayos + "</ul> </div>")
                                                .openPopup();

                                            map.setView(new L.LatLng(snapshot.val().Longitud, snapshot.val().Latitud), 17);
                                            $('.spinner').remove();
                                            $('#myModal').modal('hide');
                                          }
                                        }else{
                                          i++;
                                        }
                                  });
                                        

                                });


                        });
                }                    
                });
                }
                  
                });
        }
        funcionDibuja($('#input-prue-ensayos-laboratorio').val());

        
    });



    // que laboratorio presenta la prueba o ensayo:
    $('#btns-buscar').on('click', '#btn-busqueda-prueba', function () {
        
        $("img").remove(".leaflet-marker-icon");
        $(".leaflet-marker-shadow").remove();
        $(".leaflet-popup").remove();
        $('.modal-body').append(`<div class="spinner">
                                  <div class="dot1"></div>
                                  <div class="dot2"></div>
                                </div>`);

        var templabs = '';
        var coordenadas = [];



            db.ref("ensayos")
                .orderByChild('prueba_ensayo')
                .equalTo($('#input-laboratorios-por-pruebas').val()).once("value").then(function (pruebas) {
                  var children = pruebas.numChildren();  
                console.log(children);
                if (children === 0) {
                    swal({
                          title: "Información",
                          text: 'La consulta no arrojo resultados ',
                          html: true,
                          type: "info",
                        });
                
                    $('.spinner').remove();
                } else {
                  pruebas.forEach(function (prueba) {
                    if (prueba.val().estado === "activo") {
                      db.ref("informacion_laboratorios")
                        .orderByChild('nombre_de_laboratorio')
                        .equalTo(prueba.val().nombre_laboratorio).once("child_added").then(function (equipo) {
                            if (equipo.val().estado === "activo") {
                              db.ref("edificios")
                                .orderByChild('cod_georef')
                                .equalTo(equipo.val().cod_georef).once("child_added").then(function (edificio) {
                                    L.marker([edificio.val().Longitud, edificio.val().Latitud]).addTo(map)
                                        .bindPopup("<div><b>edificio: " + edificio.val().edif + "</b><br>" + prueba.val().nombre_laboratorio +
                                        "<br> Escuela: " + equipo.val().escuela_o_departamento +
                                        "</b><br> Espacio: " + equipo.val().espacio +
                                        "<br> Encargado: " + equipo.val().nombre_responsable +
                                        "<br> Email contacto: " + equipo.val().email +
                                        "<br> Teléfono contacto: " + equipo.val().telefono_lab +
                                        "<br> Pruebas:<ul><li> " + prueba.val().prueba_ensayo + "</li></ul> </div>"+
                                        "<button  class='btn btn-primary btn-lg btn-block btn-solicitar'>Solicitar prueba</button>")
                                        .openPopup();
                                    map.setView(new L.LatLng(edificio.val().Longitud, edificio.val().Latitud), 17);

                                    // asigna valores al formulario de solicitud de servicio
                                    $("#prueba_ensayo_e").val(prueba.val().prueba_ensayo);
                                    $("#cod_ensayo_e").val(prueba.val().cod_ensayo);
                                    $("#cod_lab_e").val(prueba.val().cod_lab);
                                    $("#costo_prueba_e").val(prueba.val().costo_prueba);
                                    $("#descripcion_e").val(prueba.val().descripcion);
                                    $("#nombre_laboratorio_e").val(prueba.val().nombre_laboratorio);
                                    $("#normas_prueba_e").val(prueba.val().normas_prueba);
                                    $("#palabras_clave_e").val(prueba.val().palabras_clave);
                                    $("#servicios_fuerauv_e").val(prueba.val().servicios_fuerauv);

                                });
                            }
                        });
                    }
                  });
                }
                    
                });

        $('.spinner').remove();
        $('#myModal').modal('hide');
    });





    

});
