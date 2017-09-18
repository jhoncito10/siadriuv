
$(document).ready(function () {
  // comfiguracion de la barra de navegacion de escritorio
   funfecha = function(){
    var f = new Date();
   var m,d,y,h,min,seg,zoneh;
   zoneh = f.getTimezoneOffset()/60;
   if(( f.getMonth() +1)<10){
       m = '0'+( f.getMonth() +1);
   }else{
       m = ( f.getMonth() +1);
   }
    if(f.getDate()<10){
       d = '0'+f.getDate();
   }else{
       d = f.getDate();
   }
   if(f.getHours()<10){
       h = '0'+f.getHours();
   }else{
       h = f.getHours();
   }
   if(f.getMinutes()<10){
       min = '0'+f.getMinutes();
   }else{
       min = f.getMinutes();
   }
   if(f.getSeconds()<10){
       seg = '0'+f.getSeconds();
   }else{
       seg = f.getSeconds();
   }
   



   var date = m + "/" + d + "/" + f.getFullYear()+' '+h+':'+min+':'+seg;
   return date;

  }

// configuracion del mapa
     map = L.map('map', { center: [3.371109, -76.536738], zoom: 16, zoomControl: false });

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    	maxZoom: 19,
    	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.control.zoom({
        position: 'bottomleft'
    }).addTo(map);

   
  




    //***************************referencia raiz Db firebase ************************ */
     db = firebase.database();
    //****************************************scripts validacion de datos y notificaciones********************************

      var objtareas = {};
      var refusertareas;

      firebase.auth().onAuthStateChanged(function(user) {

        if (user) {
          objtareas.uid = user.uid;
          refusertareas = db.ref("usuariostareasCompletadas/"+user.uid);
          objtareas.mensajes = '';
          db.ref("tareas").orderByChild("displayname").once('value').then(function (tareas) {
            var i=0;
            var hijos = tareas.numChildren();
            var contnotificaciones = 0;
            return new Promise(function (resolve) {
              tareas.forEach(function (tarea) {
                db.ref("usuariostareasCompletadas/"+user.uid).once("value").then(function (tareasUsuarios) {
                  if (tareasUsuarios.val()==null) {
                    // Get a key for a new Post.
                    var fecha = funfecha();
                      var newPostKey = db.ref("usuariostareasCompletadas/"+user.uid).push().key;
                      db.ref("usuariostareasCompletadas/"+user.uid+"/"+newPostKey).update({
                        usuario:user.email,
                      displayname: tarea.val().displayname,
                      estado: "pendiente",
                      mensaje: tarea.val().mensaje,
                      fecha:fecha
                    }).then(function (resp) {
                      objtareas.mensajes=objtareas.mensajes+'<li><strong>'+tarea.val().mensaje+'</strong></li>';
                      i++;
                      contnotificaciones++;
                      if (i==hijos) {
                        resolve(contnotificaciones); ;
                      }
                    });
                  }else{
                    tareasUsuarios.forEach(function (tareausuario) {
                     if (tareausuario.val().displayname==tarea.val().displayname && tareausuario.val().estado=='completa') {
                        i++;
                        if (i==hijos) {
                          resolve(contnotificaciones); ;
                        }
                      }else if(tareausuario.val().displayname==tarea.val().displayname && tareausuario.val().estado!='completa'){
                        objtareas.mensajes=objtareas.mensajes+'<li><strong>'+tarea.val().mensaje+'</strong></li>';
                        i++;
                        contnotificaciones++;
                        if (i==hijos) {
                          resolve(contnotificaciones); ;
                        }
                      }
                    });

                  }


                });

              });
            });

          }).then(function (contnotificaciones) {
            if (contnotificaciones>0) {
              $('#notificaciones').popover({ content: "Usted tiene notificaciones pendientes !", trigger: "manual"});
              $('#notificaciones').popover('show');
            }
            $("#numero-notificaciones").text(contnotificaciones);
          });
          db.ref("usuariostareasCompletadas/"+objtareas.uid)
          .orderByChild("estado")
          .equalTo("pendiente")
          .once("value").then(function(tareaspendientes){
            tareaspendientes.forEach(function (tarea) {
            });
          });
        } else {
          // User is signed out.
            window.location="../index.html";

            $('body').html('');

        }

      });

    $('#notificaciones').click(function () {
      $('#notificaciones').popover('hide');
      $('.modal-title').text('notificaciones');
      $('.modal-body').html(objtareas.mensajes);
      $('#myModal').modal();
    });


    var actualizaestadotarea = function (key,estado) {
      var fecha =funfecha();
      refusertareas.child(key).update({
        estado: estado,
        fecha:fecha
      });
    }






    //*********************************************termina validaciones ******************************************
    //script muestra contacto
    $('#menu-contacto').click(function () {
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
      $('#myModal').modal();

    });



    // scripts ubicar puntero

    $('#menu-ubicacion-lab-usuario').on('click', function () {
        $('#map').show();
        spinner.spin(target);
        $("img").remove(".leaflet-marker-icon");
        $(".leaflet-marker-shadow").remove();
        $(".leaflet-popup").remove();
        db.ref("informacion_laboratorios")
        .orderByChild('email_univalle')
        .equalTo(email)
        .once("value").then(function (laboratorios) {
          return new Promise(function(resolve){
            var i = 0;
            var children = laboratorios.numChildren();
            leaftobj = {};
            laboratorios.forEach(function(laboratorio){
            //	console.log('laboratorio',laboratorio.val());
                  var objpruebas = {};


                  if (leaftobj[laboratorio.val().cod_escuela]!==undefined) {
                      leaftobj[laboratorio.val().cod_escuela].nombre_de_laboratorio = leaftobj[laboratorio.val().cod_escuela].nombre_de_laboratorio + '<li>' + laboratorio.val().nombre_de_laboratorio + '</li>';
                  }else {
                      objpruebas.nombre_de_laboratorio =  '<li>' + laboratorio.val().nombre_de_laboratorio+ '</li>';
                      objpruebas.escuela_o_departamento = laboratorio.val().escuela_o_departamento;
                      objpruebas.cod_georef = laboratorio.val().cod_georef;
                      objpruebas.nombre_responsable = laboratorio.val().nombre_responsable;
                      objpruebas.email_univalle = laboratorio.val().email_univalle;

                      objpruebas.Latitud = 0;
                      objpruebas.Longitud = 0;
                  leaftobj[laboratorio.val().cod_escuela] = objpruebas;
                  }
                  i++;
                  if (i==children) {
                    resolve(leaftobj);
                  }
            });
          });
        }).then(function(leaftobj){
          var keys = Object.getOwnPropertyNames(leaftobj).sort();
          return new Promise(function (resolve) {
            var i = 0;
            keys.forEach(function(k){
                  db.ref("edificios")
                  .orderByChild("cod_georef")
                  .equalTo(parseInt(leaftobj[k].cod_georef))
                  .once("child_added").then(function (snapshot) {
                    console.log(snapshot.val().Latitud);
                    leaftobj[k].Latitud = snapshot.val().Latitud;
                    leaftobj[k].Longitud = snapshot.val().Longitud;
                    i++;

                      if (i == keys.length) {
                        resolve(leaftobj);
                      }
                  });
                  
            });

          });


        }).then(function (leaftobj) {

          for (i in leaftobj) {
            if (leaftobj[i].Longitud !== 0 || leaftobj[i].Longitud !== 0) {
              
              L.marker([leaftobj[i].Longitud, leaftobj[i].Latitud]).addTo(map)
                  .bindPopup("<b> Edificio: " + leaftobj[i].cod_escuela +
                  "</b><br> Escuela: " + leaftobj[i].escuela_o_departamento +

                  "<br> laboratorios: <ul>" + leaftobj[i].nombre_de_laboratorio )
                  .openPopup();
              map.setView(new L.LatLng(leaftobj[i].Longitud, leaftobj[i].Latitud), 17);
              spinner.stop();
            }else {
              swal({
                        title: "Información",
                        text: 'El laboratorio :'+leaftobj[i].nombre_de_laboratorio+' por el momento no tiene informacion geografica, mientras tanto.' +
                              'puede asignarle una en la seccion ->"Cambiar ubicación en el mapa"',
                        html: true,
                        type: "info",
                      });
              
              spinner.stop();
            }

            }
          });

    });


    $('#menu-busqueda-por-director-usuario').on('click', function () {// genera formularios para actualizar informacion personal del director de laboratorio
        $('.modal-body').html('');
        spinner.spin(target);
        $("img").remove(".leaflet-marker-icon");
        $(".leaflet-marker-shadow").remove();
        $(".leaflet-popup").remove();

        db.ref("informacion_laboratorios")
        .orderByChild('email_univalle')
        .equalTo(email)
        .on("child_added", function (laboratorio) {
          $('.modal-title').text("Actualiza tus datos por laboratorio");
                $('.modal-body').
                append("<div class='" + laboratorio.key + "'><h4> Edificio " + laboratorio.val().cod_escuela + "  " + laboratorio.val().nombre_de_laboratorio + "</h4>" +
                "<form class='form-horizontal'>" +
                "<div class='form-group'>" +
                "<label class='control-label col-sm-2' for='ncelular'>Celular:</label>" +
                "<div class='col-sm-10'>" +

                "<input type='number' class='actualizar-datos form-control' id='ncelular' value='" + laboratorio.val().celular + "' >" +
                "</div>" +
                "</div>" +
                "<div class='form-group'>" +
                "<label class='control-label col-sm-2' for='ncargo'>Cargo:</label>" +
                "<div class='col-sm-10'>" +
                  "<select class='actualizar-datos form-control' id='ncargo" + laboratorio.key + "'>"+
                    "<option>Técnico de laboratorio</option>"+
                    "<option>Profesional de laboratorio</option>"+
                    "<option>Docente responsable del laboratorio</option>"+
                    "<option>Docente investigador</option>"+
                    "<option>Estudiante</option>"+
                    "<option>Director técnico</option>"+
                    "<option>Director de calidad</option>"+
                  "</select>"+
                "</div>" +
                "</div>" +
                "<div class='form-group'>" +
                "<label class='control-label col-sm-2' for='nnombres'>Nombres:</label>" +
                "<div class='col-sm-10'>" +
                "<input type='text' class='actualizar-datos form-control' id='nnombres' value='" + laboratorio.val().nombre_responsable + "' style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();' >" +

                "</div>" +
                "</div>" +
                "<div class='form-group'>" +
                "<label class='control-label col-sm-2' for='ntelefono'>Teléfono personal:</label>" +
                "<div class='col-sm-10'>" +
                " <input type='number' class='actualizar-datos form-control' id='ntelefono' value='" + laboratorio.val().telefono + "' >" +
                "</div>" +
                "</div>" +
                "<div class='form-group'>" +

                "<div class='col-sm-offset-2 col-sm-10'>" +
                "<button class='btn-actualizar-datos btn btn-default' id='" + laboratorio.key + "'>actualizar</button></form></div>" +
                "</div>" +
                "</div>");
                if (laboratorio.val().cargo === "Técnico de laboratorio" ||
                    laboratorio.val().cargo === "Profesional de laboratorio" ||
                    laboratorio.val().cargo === "Docente responsable del laboratorio" ||
                    laboratorio.val().cargo === "Docente investigador" ||
                    laboratorio.val().cargo === "Estudiante" ||
                    laboratorio.val().cargo === "Director técnico" ||
                    laboratorio.val().cargo === "Director de calidad" ) {
                      $("#ncargo"+ laboratorio.key).val(laboratorio.val().cargo);
                }
              });
        spinner.stop();
        $('#myModal').modal();
    });



    $('#menu-general-laboratorio').on('click', function () {// genera formularios para actualizar informacion general
        $('.modal-body').html('');
        spinner.spin(target);
        $("img").remove(".leaflet-marker-icon");
        $(".leaflet-marker-shadow").remove();
        $(".leaflet-popup").remove();
        ////console.log($('#infolab-busqueda-por-director').val());
        db.ref("informacion_laboratorios").orderByChild('email_univalle').equalTo(email).on("child_added", function (laboratorio) {


                // //console.log(snapshot.val());
                $('.modal-title').text("Actualiza informacion general por laboratorio");
                $('.modal-body').
                    append("<div class='" + laboratorio.key + "'><h4> Edificio " + laboratorio.val().cod_escuela+ "  " + laboratorio.val().nombre_de_laboratorio + "</h4>" +
                    "<form class='form-horizontal'>" +
                    "<div class='form-group'>" +
                    "<label class='control-label col-sm-2' for='nactividad'>Actividad:</label>" +
                    "<div class='col-sm-10'>" +
                    "<input type='text' class='actualizar-datos form-control' id='nactividad' value='" + laboratorio.val().actividad + "' >" +
                    "</div>" +
                    "</div>" +
                    "<div class='form-group'>" +
                    "<label class='control-label col-sm-2' for='narea_conocimiento'>Area del conocimiento:</label>" +
                    "<div class='col-sm-10'>" +
                    `<div class="checkbox">
                    <label><input class="narea_conocimiento" type="checkbox" value="Ciencias Agrícolas">Ciencias Agrícolas</label>
                    </div>
                    <div class="checkbox">
                    <label><input class="narea_conocimiento" type="checkbox" value="Ciencias medicas y de Salud">Ciencias medicas y de Salud</label>
                    </div>
                    <div class="checkbox ">
                    <label><input class="narea_conocimiento" type="checkbox" value="Ciencias naturales" >Ciencias naturales</label>
                    </div>
                    <div class="checkbox">
                    <label><input class="narea_conocimiento" type="checkbox" value="Ciencias Sociales">Ciencias Sociales</label>
                    </div>
                    <div class="checkbox">
                    <label><input class="narea_conocimiento" type="checkbox" value="Humanidades">Humanidades</label>
                    </div>
                    <div class="checkbox ">
                    <label><input class="narea_conocimiento" type="checkbox" value="Ingeniería y tecnología" >Ingeniería y tecnología</label>
                    </div>`+

                    //"<input type='text' class='actualizar-datos form-control' id='narea_conocimiento' value='" + laboratorio.val().area_conocimiento + "' >" +
                    "</div>" +
                    "</div>" +
                    "<div class='form-group'>" +
                    "<label class='control-label col-sm-2' for='nresolucion_de_creacion'>Resolucion:</label>" +
                    "<div class='col-sm-10'>" +
                    "<input type='text' class='actualizar-datos form-control' id='nresolucion_de_creacion' value='" + laboratorio.val().resolucion_de_creacion + "' disabled>" +
                    "</div>" +
                    "</div>" +
                    "<div class='form-group'>" +
                    "<label class='control-label col-sm-2' for='ndireccion'>Direccion de envio:</label>" +
                    "<div class='col-sm-10'>" +
                    "<input type='text' class='actualizar-datos form-control' id='ndireccion' value='" + laboratorio.val().direccion + "' >" +
                    "</div>" +
                    "</div>" +
                    "<div class='form-group'>" +
                    "<label class='control-label col-sm-2' for='notroemail'>Email laboratorio:</label>" +
                    "<div class='col-sm-10'>" +
                    "<input type='email' class='actualizar-datos form-control' id='notroemail' value='" + laboratorio.val().email + "' title = 'Email de contacto' >" +
                    "</div>" +
                    "</div>" +

                    "<div class='form-group'>" +
                    "<label class='control-label col-sm-2' for='ntelefono_lab'>Teléfono laboratorio:</label>" +
                    "<div class='col-sm-10'>" +
                    " <input type='number' class='actualizar-datos form-control' id='ntelefono_lab' value='" + laboratorio.val().telefono_lab + "' title = 'Teléfono  de contacto' >" +
                    "</div>" +
                    "</div>" +
                    "<div class='form-group'>" +
                    "<label class='control-label col-sm-2' for='ntelefono_ext_lab'>Extensión teléfono laboratorio:</label>" +
                    "<div class='col-sm-10'>" +
                    " <input type='number' class='actualizar-datos form-control' id='ntelefono_ext_lab' value='" + laboratorio.val().telefono_ext_lab + "' title = 'Teléfono  de contacto' >" +
                    "</div>" +
                    "</div>" +

                    "<div class='form-group'>" +
                    "<label class='control-label col-sm-2' for='ngrupoinves'>Línea de investigación:</label>" +
                    "<div class='col-sm-10'>" +
                    "<input type='text' class='actualizar-datos form-control' id='ngrupoinves' value='" + laboratorio.val().grupo_de_investigacion + "' >" +
                    "</div>" +
                    "</div>" +


                    "<div class='form-group'>" +

                    "<div class='col-sm-offset-2 col-sm-10'>" +
                    "<button class='btn-actualizar-generales btn btn-default' id='" + laboratorio.key + "'>actualizar</button></form></div>" +
                    "</div>" +
                    "</div>");
                    var str = laboratorio.val().area_conocimiento;
                    var res = str.split(",");
                    for (var i = 1; i < res.length; i++) {
                      $("[class='" + laboratorio.key + "']").find("[value='" + res[i] + "']").prop("checked",true);
                    }





        });
        spinner.stop();
        $('#myModal').modal();
    });



    $('#menu-ensayoslaboratorio-usuario').on('click', function () {// crea la lista de ensayos para acualizar
        $('.modal-body').html('');
        //console.log($(this).attr('id'));
        spinner.spin(target);
        $("img").remove(".leaflet-marker-icon");
        $(".leaflet-marker-shadow").remove();
        $(".leaflet-popup").remove();
        $('.modal-title').text("Actualiza los ensayos prestados por el laboratorio");


        db.ref("informacion_laboratorios")
            .orderByChild('email_univalle')
            .equalTo(email).on("child_added", function (laboratorio) {
                //  //console.log(laboratorio);

                    //    var i = 0;
                        //  //console.log(snapshot);
                        db.ref("ensayos").orderByChild('nombre_laboratorio')
                            .equalTo(laboratorio.val().nombre_de_laboratorio)
                            .on("child_added", function (pruebas) {
                                $('.modal-body').
                                    append("<div class=" + pruebas.key + "><h4> Edificio " + laboratorio.val().cod_escuela + "  " + laboratorio.val().nombre_de_laboratorio + "</h4>" +
                                    "<form class='form-horizontal'>" +

                                    "<div class='form-group'>" +
                                    "<label class='control-label col-sm-4' for='nservicios'>Presta servicios fuera de univalle:</label>" +
                                    "<div class='col-sm-8'>" +
                                      "<label class='radio-inline nservicios'><input type='radio' name='nservicios' value='si' id='"+pruebas.key+"si'>Si</label>"+
                                      "<label class='radio-inline nservicios'><input type='radio' name='nservicios' value='no' id='"+pruebas.key+"no'>No</label>"+
                                    "</div>" +
                                    "</div>" +
                                    "<div class='form-group'>" +
                                    "<label class='control-label col-sm-4' for='nensayo'>Nombre de la prueba:</label>" +
                                    "<div class='col-sm-8'>" +
                                    "<input type='text' class='actualizar-datos form-control' id='nensayo' value='" + pruebas.val().prueba_ensayo + "' >" +

                                    "</div>" +
                                    "</div>" +
                                    "<div class='form-group'>" +
                                      "<label class='control-label col-sm-4' for='ndescripcion'>Descripción</label>" +
                                      "<div class='col-sm-8'>" +
                                        "<textarea type='textarea' class='actualizar-datos form-control' id='ndescripcion'  >" + pruebas.val().descripcion + "</textarea>" +
                                      "</div>" +
                                    "</div>" +
                                    "<div class='form-group'>" +
                                      "<label class='control-label col-sm-4' for='npalabras_clave'>Palabras clave</label>" +
                                      "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='npalabras_clave' value='" + pruebas.val().palabras_clave + "' >" +
                                      "</div>" +
                                    "</div>" +

                                    "<div class='form-group'>" +
                                      "<label class='control-label col-sm-4' for='nnormas_prueba'>Normas que rigen la prueba</label>" +
                                      "<div class='col-sm-8'>" +
                                        "<textarea type='textarea' class='actualizar-datos form-control' id='nnormas_prueba'  >" + pruebas.val().normas_prueba + "</textarea>" +
                                      "</div>" +
                                    "</div>" +
                                    "<div class='form-group'>" +
                                      "<label class='control-label col-sm-4' for='ncosto_prueba'>Costo de la prueba</label>" +
                                      "<div class='col-sm-8'>" +
                                        "<input type='number' class='actualizar-datos form-control' id='ncosto_prueba' value='" + pruebas.val().costo_prueba + "' >" +
                                      "</div>" +
                                    "</div>" +

                                    "<div class='form-group'>" +
                                    "<div class='col-sm-offset-2 col-sm-10'>" +
                                    "<button class='btn-actualizar-ensayo btn btn-default' id=" + pruebas.key + ">actualizar</button></form></div>" +
                                    "</div>" +
                                    "</div>");

                                    if (pruebas.val().servicios_fuerauv==="si") {
                                        $("#"+pruebas.key+"si").prop("checked", true)
                                    }else if (pruebas.val().servicios_fuerauv==="no") {
                                      $("#"+pruebas.key+"no").prop("checked", true)
                                    }







                    });
            });


        spinner.stop();
        $('#myModal').modal();
    });




    $('#menu-nuevoservicio-laboratorio').on('click', function () {// genera formularios para nuevo ensayo
        $('.modal-body').html('');
        spinner.spin(target);
        $("img").remove(".leaflet-marker-icon");
        $(".leaflet-marker-shadow").remove();
        $(".leaflet-popup").remove();
        //  //console.log('entra');

        $('.modal-title').text("Agrega una nueva prueba o ensayo");
        $('.modal-body').
            html("<div ><h4> Nueva prueba o ensayo </h4>" +
            "<form class='form-horizontal'>" +
            "<div class='form-group'>" +
            "<label class='control-label col-sm-4' for='sel1'>Seleciona el laboratorio</label>" +
            "<div class='col-sm-8'>" +
            "<select class='form-control' id='sel1'>" +

            "</select>" +
            "</div>" +
            "</div>" +

            "<div class='form-group'>" +
            "<label class='control-label col-sm-4' for='nservicios'>Presta servicios fuera de univalle:</label>" +
            "<div class='col-sm-8'>" +
              "<label class='radio-inline nservicios'><input type='radio' name='nservicios' value='si' id='nsi'>Si</label>"+
              "<label class='radio-inline nservicios'><input type='radio' name='nservicios' value='no' id='nno'>No</label>"+
            "</div>" +
            "</div>" +
            "<div class='form-group'>" +
            "<label class='control-label col-sm-4' for='nensayo'>Nombre de la prueba:</label>" +
            "<div class='col-sm-8'>" +
            "<input type='text' class='actualizar-datos form-control' id='nensayo'  >" +

            "</div>" +
            "</div>" +
            "<div class='form-group'>" +
              "<label class='control-label col-sm-4' for='ndescripcion'>Descripcion</label>" +
              "<div class='col-sm-8'>" +
                "<textarea type='text' class='actualizar-datos form-control' id='ndescripcion' ></textarea>" +
              "</div>" +
            "</div>" +
            "<div class='form-group'>" +
              "<label class='control-label col-sm-4' for='npalabras_clave'>Palabras clave</label>" +
              "<div class='col-sm-8'>" +
                "<input type='text' class='actualizar-datos form-control' id='npalabras_clave' >" +
              "</div>" +
            "</div>" +
            "<div class='form-group'>" +
              "<label class='control-label col-sm-4' for='nnormas_prueba'>Normas que rigen la prueba</label>" +
              "<div class='col-sm-8'>" +
                "<textarea type='text' class='actualizar-datos form-control' id='nnormas_prueba' ></textarea>" +
              "</div>" +
            "</div>" +
            "<div class='form-group'>" +
              "<label class='control-label col-sm-4' for='ncosto_prueba'>Costo de la prueba</label>" +
              "<div class='col-sm-8'>" +
                "<input type='number' class='actualizar-datos form-control' id='ncosto_prueba' >" +
              "</div>" +
            "</div>" +
            "<div class='form-group'>" +

            "<div class='col-sm-offset-2 col-sm-10'>" +
            "<button class='btn-nuevo-ensayo btn btn-default' >agregar</button></form></div>" +
            "</div>" +
            "</div>");
        db.ref("informacion_laboratorios").orderByChild('email_univalle').equalTo(email).on("child_added", function (laboratorio) {

            $('#sel1').append("<option id'" + laboratorio.val().nombre_de_laboratorio + "'>" + laboratorio.val().nombre_de_laboratorio + "</option>");


        });
        spinner.stop();
        $('#myModal').modal();
    });



    $('#menu-busqueda-equipo-laboratorio').on('click', function () {// crea la lista de equipos
      $('.modal-title').text("Listado de los equipos vinculados a su laboratorio");

        $('.modal-body').html('<div class="container-fluid"><div class="row"><div class = "col-md-12"><h3>por el momento esta zona se encuentra en construccion</h3><div><div></div>');
        $('#myModal').modal();





    });

    $('#menu-nuevo-usuario').on('click', function () {// crea la lista de equipos
      $('.modal-title').text("Agrega un colaborador de laboratorio");
      $('.modal-body').html('');
      //console.log($(this).attr('id'));
      spinner.spin(target);
      $("img").remove(".leaflet-marker-icon");
      $(".leaflet-marker-shadow").remove();
      $(".leaflet-popup").remove();


      db.ref("informacion_laboratorios")
          .orderByChild('email_univalle')
          .equalTo(email).once("value", function (laboratorios) {
              
            laboratorios.forEach(function (laboratorio) {
              $('.modal-body').
                append("<div class=" + laboratorio.key + "><h4> Edificio " + laboratorio.val().cod_escuela + "  " + laboratorio.val().nombre_de_laboratorio + "</h4>" +
                "<form class='form-horizontal'>" +

              
              
                "<div class='form-group'>" +
                  "<label class='control-label col-sm-4' for='ncolaborador'>Correo del usuario colaborador</label>" +
                  "<div class='col-sm-8'>" +
                    "<input type='text' class='actualizar-datos form-control colaborador' id='ncolaborador' value='" + laboratorio.val().colaborador + "' >" +
                  "</div>" +
                "</div>" +

              

                "<div class='form-group'>" +
                "<div class='col-sm-offset-2 col-sm-10'>" +
                "<button class='btn-actualizar-colaborador btn btn-primary' id=" + laboratorio.key + ">actualizar</button></form></div>" +
                "</div>" +
                "</div>"
              );
            });
            $(".colaborador").easyAutocomplete(optionsAutoCompleteCorreos);
            $("#ncolaborador").width("70%");
          });


      spinner.stop();
      $('#myModal').modal();





    });








    // scripts actualizar datos**********************************************************************************
    $(document).on('click', '.btn-actualizar-datos', function (event) {//actualiza datos personales del encargado de laboratorio
        event.preventDefault();
        var key = $(this).attr('id');
        console.log($("[class='" + key + "']").find('#ncargo'+key).val());

        var updates = {};
        updates['/informacion_laboratorios/' + key + '/celular/'] = $("[class='" + key + "']").find('#ncelular').val();
        updates['/informacion_laboratorios/' + key + '/cargo/'] = $("[class='" + key + "']").find('#ncargo'+key).val();
        updates['/informacion_laboratorios/' + key + '/nombre_responsable/'] = $("[class='" + key + "']").find('#nnombres').val();
        updates['/informacion_laboratorios/' + key + '/telefono/'] = $("[class='" + key + "']").find('#ntelefono').val();
        updates['/informacion_laboratorios/' + key + '/fecha_actualizacion/'] = funfecha();
        updates['/informacion_laboratorios/' + key + '/estado/'] = "activo";

        return firebase.database().ref().update(updates, function(error) {
          if (error) {
            alert("Error al gaurdas los datos, verifique los campos e intentelo de nuevo.");
          } else {
            swal("Guardados!",
                                "Datos guardados correctamente",
                                "success");
          }
        }).then(function (error) {

          refusertareas
          .orderByChild('displayname')
          .equalTo("actualiza_datos_personales")
          .once("child_added").then(function (tarea) {

            actualizaestadotarea(tarea.key,"completa");

          });
        });




    });

    $(document).on('click', '.btn-actualizar-generales', function (event) {//actualiza datos generales del laboratorio
        event.preventDefault();
        var key = $(this).attr('id');
        var array_areas = $("[class='" + key + "']").find('.narea_conocimiento');
        var string_areas = "";
        for(var i=0 ;i<array_areas.length;i++){
          if ($( array_areas[i] ).prop( "checked" )) {
            string_areas=string_areas+","+array_areas[i].value;
          }

        }
        var updates = {};
        updates['/informacion_laboratorios/' + key + '/actividad/'] = $("[class='" + key + "']").find('#nactividad').val();
        updates['/informacion_laboratorios/' + key + '/area_conocimiento/'] = string_areas;
        updates['/informacion_laboratorios/' + key + '/direccion/'] = $("[class='" + key + "']").find('#ndireccion').val();
        updates['/informacion_laboratorios/' + key + '/grupo_de_investigacion/'] = $("[class='" + key + "']").find('#ngrupoinves').val();
        updates['/informacion_laboratorios/' + key + '/email/'] = $("[class='" + key + "']").find('#notroemail').val();
        updates['/informacion_laboratorios/' + key + '/telefono_lab/'] = $("[class='" + key + "']").find('#ntelefono_lab').val();
        updates['/informacion_laboratorios/' + key + '/telefono_ext_lab/'] = $("[class='" + key + "']").find('#ntelefono_ext_lab').val();
        updates['/informacion_laboratorios/' + key + '/fecha_actualizacion/'] = funfecha();
        updates['/informacion_laboratorios/' + key + '/estado/'] = "activo";

        return firebase.database().ref().update(updates, function(error) {
          if (error) {
            alert("Error al gaurdas los datos, verifique los campos e intentelo de nuevo.");
          } else {
            swal("Guardados!",
                                "Datos guardados correctamente",
                                "success");
          }
        }).then(function (error) {

          refusertareas
          .orderByChild('displayname')
          .equalTo("actualiza_datos_generales")
          .once("child_added").then(function (tarea) {

            actualizaestadotarea(tarea.key,"completa");

          });
        });




    });

    $(document).on('click', '.btn-actualizar-colaborador', function (event) {//actualiza datos generales del laboratorio
      event.preventDefault();
      var key = $(this).attr('id');
      var emailusuario = $("[class='" + key + "']").find('#ncolaborador').val();    
     
      var updates = {};
      updates['/informacion_laboratorios/' + key + '/colaborador/'] = emailusuario;
     

      return firebase.database().ref().update(updates, function(error) {
        if (error) {
          alert("Error al gaurdas los datos, verifique los campos e intentelo de nuevo.");
        } else {
          swal("Guardados!",
                              "Datos guardados correctamente",
                              "success");
        }
      }).then(function (error) {

          var refusuario = firebase.database().ref('/usuarios/');
          // refusuario.orderByChild

          // refusuario.update({url:'nivel2sub/index.html'});

          refusuario
          .orderByChild('email')
          .equalTo(emailusuario)
          .once("value")
          .then(function (usuarios) {// se ejecuta al terminar la consulta nombres
              var children = usuarios.numChildren(),
                      i = 0;
              usuarios.forEach(function (usuario) {// agrega cada valor al arreglo
      
                  refusuario.child(usuario.key+'/url/').set('nivel2sub/index.html');
                  
              });
          });
          

        
      });




  });



    $(document).on('click', '.btn-actualizar-ensayo', function (event) {//actualiza ensayos  de laboratorio
      event.preventDefault();
      var $btnensayo = $(this);
          $btnensayo.attr("disabled","disabled");
      var key = $(this).attr('id'),
            costo = parseInt($("[class='" + key + "']").find('#ncosto_prueba').val());

            if (isNaN(costo)) {
              costo = 0;
            }

        var updates = {};

        updates['/ensayos/' + key + '/prueba_ensayo/'] = $("[class='" + key + "']").find('#nensayo').val();
        updates['/ensayos/' + key + '/descripcion/'] = $("[class='" + key + "']").find('#ndescripcion').val();
        updates['/ensayos/' + key + '/palabras_clave/'] = $("[class='" + key + "']").find('#npalabras_clave').val();
        updates['/ensayos/' + key + '/normas_prueba/'] = $("[class='" + key + "']").find('#nnormas_prueba').val();
        updates['/ensayos/' + key + '/costo_prueba/'] = costo;
        updates['/ensayos/' + key + '/fecha_actualizacion/'] = funfecha();
        updates['/ensayos/' + key + '/estado/'] = "activo";

        if ($("[class='" + key + "']").find('input[name=nservicios]:checked').val()==="si") {
          updates['/ensayos/' + key + '/servicios_fuerauv/'] = "si";

        }else if ($("[class='" + key + "']").find('input[name=nservicios]:checked').val()==="no") {
          updates['/ensayos/' + key + '/servicios_fuerauv/'] = "no";

        }

        return firebase.database().ref().update(updates, function(error) {
          $btnensayo.removeAttr("disabled");
          if (error) {
            alert("Error al guadar los datos, verifique los campos e intentelo de nuevo.");
          } else {
            swal("Guardados!","Datos guardados correctamente","success");
          }
        }).then(function (error) {

          refusertareas
          .orderByChild('displayname')
          .equalTo("actualizar_ensayos")
          .once("child_added").then(function (tarea) {

            actualizaestadotarea(tarea.key,"completa");

          });
        });




    });





    $(document).on('click', '.btn-nuevo-ensayo', function (event) {//agregar  ensayos  a laboratorio
        event.preventDefault();
        var key,
            costo = parseInt($('#ncosto_prueba').val()),
            $btnensayo = $(this);
            $btnensayo.attr("disabled","disabled");
        if (isNaN(costo)) {
          costo = 0;
        }
        db.ref('ensayos').orderByChild('cod_ensayo').limitToLast(1).once("value").then(function(snapshot) {
          //console.log(snapshot.key);
          snapshot.forEach(function(data) {
            key=data.key;
            key++;
            var ref = db.ref('/ensayos/' + key);
            var obj = {
                nombre_laboratorio: $('#sel1').val(),
                prueba_ensayo: $('#nensayo').val(),
                descripcion:$('#ndescripcion').val(),
                palabras_clave:$('#npalabras_clave').val(),
                cod_ensayo:key,
                normas_prueba:$('#nnormas_prueba').val(),
                costo_prueba: costo,
                fecha_actualizacion: funfecha(),
                estado: "activo"
            };

            if ($('input[name=nservicios]:checked').val()==="si") {
              obj.servicios_fuerauv = "si";

            }else if ($('input[name=nservicios]:checked').val()==="no") {
              obj.servicios_fuerauv = "no";

            }

            ref.set(obj, function(error) {
              $btnensayo.removeAttr("disabled");
              if (error) {
                alert("Error al gaurdas los datos, verifique los campos e intentelo de nuevo.");
              } else {
                swal("Guardados!","Datos guardados correctamente","success");
              }
            });
            $('#myModal').modal('hide');

          });
        });

    });


   





});
