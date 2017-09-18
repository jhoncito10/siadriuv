"use strict";
$(document).ready(function () {

    // funciones generales

    // funcion de tamaño de opbjetos

    Object.size = function (obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    // Funcion de fecha
    var funfecha = function () {
        var f = new Date();
        var m, d, y, h, min, seg, zoneh;
        zoneh = f.getTimezoneOffset() / 60;
        if ((f.getMonth() + 1) < 10) {
            m = '0' + (f.getMonth() + 1);
        } else {
            m = (f.getMonth() + 1);
        }
        if (f.getDate() < 10) {
            d = '0' + f.getDate();
        } else {
            d = f.getDate();
        }
        if (f.getHours() < 10) {
            h = '0' + f.getHours();
        } else {
            h = f.getHours();
        }
        if (f.getMinutes() < 10) {
            min = '0' + f.getMinutes();
        } else {
            min = f.getMinutes();
        }
        if (f.getSeconds() < 10) {
            seg = '0' + f.getSeconds();
        } else {
            seg = f.getSeconds();
        }
      



        var date = m + "/" + d + "/" + f.getFullYear() + ' ' + h + ':' + min + ':' + seg ;
        return date;

    }





    // Referencia de la raiz de la base de datos firebase
    var db = firebase.database();


    // Funciones principales 

    // funcion que rederiza lista de formularios
    var funListadoUsuariosRaw = function () {
        $("#boxtitle").text("Listado laboratorios RAW");// titulo
        $('#container').html(
            // caja de mensaje
            '<div class="small-box bg-red">'+
                    '<div class="inner">'+
                    ' <h3 id="cant-laboratorios" ></h3>'+

                    '<p>Cuidado al modificar estos datos</p>'+
                    '</div>'+
                    '<div class="icon">'+
                    '<i class="ion ion-alert-circled"></i>'+
                    '</div>'+
                    '<a href="#" class="small-box-footer" '+
                    ' data-toggle="popover" title="Información" data-content= "Listado de laboratorios, permite modificar la información en bruto de los nodos en la base de datos, se debe tener cuidado al modificar algunos de estos datos, podría afectar el funcionamiento de la aplicación." >'+
                    'Más información <i class="fa fa-arrow-circle-right"></i>'+
                    '</a>'+
                '</div>'+
                // spiner 
                '<div class="overlay">'+
                    '<i class="fa fa-refresh fa-spin"></i>'+
                '</div>' +
            
                // tabla de contenido
            '<div id="tabla"><table id="tablaequipos" class="table table-bordered table-hover" >' +
            '<thead>' +
            '<tr>' +
            '<th>Nombre laboratorio</th>' +
            '<th>Correo</th>' +
            '<th>Encargado</th>' +
            '<th>Estado</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody id="tablabody" ></tbody>' +
            '</table></div>');
        $('#myModal .modal-body').html('<form class="form-horizontal"></form>');


        var dataid;


        ////console.log('entra equipos');
        db.ref("informacion_laboratorios")
            // .orderByChild('email_univalle')
            .once("value").then(function (laboratorios) {

                 var i = 0,
                    children = laboratorios.numChildren();
                return new Promise(function(resolve){
                    laboratorios.forEach(function(lab) {
                        $('#tablabody').append('<tr>' +
                            '<td  id=' +  lab.key + '>' + lab.val().nombre_de_laboratorio + '</td>' +
                            '<td id=' + lab.key + '>' + lab.val().email_univalle + '</td>' +
                            '<td id=' + lab.key + '>' + lab.val().nombre_responsable + '</td>' +
                            '<td id=' + lab.key + '>' + lab.val().estado + '</td>' +
                            '</tr>');
                            i++;
                        if (i==children) {
                            resolve();
                        }
                        });
                    });
                 
                
              }).then(function (val) {
                  var tableequipos = $('#tablaequipos').DataTable();
                  $(".overlay").remove();
                   $('#tablabody').on('click', 'tr', function () {
                       if ($(this).hasClass('selected')) {
                           $(this).removeClass('selected');

                       }
                       else {
                           tableequipos.$('tr.selected').removeClass('selected');
                           $(this).addClass('selected');
                           dataid = $('.selected').children().attr('id');

                           db.ref("informacion_laboratorios/" + dataid)
                               .once("value", function (actualizalab) {
                                   //  ////console.log(equipo.val());
                                   $('.form-horizontal').html(
                                       "<div class=" + actualizalab.key + ">" +
                                        "<h4>Actualiza la informaciondel laboratorio: "+actualizalab.val().nombre_de_laboratorio+"</h4>" +
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nnombre-lab'>Nombre Laboratorio</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='nnombre-lab' value='" + actualizalab.val().nombre_de_laboratorio + "'  style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'   >" +
                                        "</div>" +
                                        "</div>" +
                                        
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nactividad'>Actividad:</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='nactividad' value='" + actualizalab.val().actividad + "' style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'  >" +
                                        "</div>" +                                        
                                        "</div>" +

                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nfechafundacion'>Fecha de fundación:</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='date' class='actualizar-datos form-control' id='nfechafundacion' value='" + actualizalab.val().ano_de_fundacion + "'   >" +
                                        "</div>" +
                                        "</div>" +

                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ncapacidadestudiantes'>Capacidad estudiantes:</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='number' class='actualizar-datos form-control' id='ncapacidadestudiantes' value='" + actualizalab.val().capacidad_estudiantes + "'   required>" +
                                        "</div>" +
                                        "</div>" + 
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ncapacidadmaxestudiantes'>Capacidad maxima de estudiantes</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='number' class='actualizar-datos form-control' id='ncapacidadmaxestudiantes' value='" + actualizalab.val().capacidad_maxima_estudiantes + "'   required>" +
                                        "</div>" +
                                        "</div>" + 
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ncargo'>Cargo</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='ncargo' value='" + actualizalab.val().cargo + "'   >" +
                                        "</div>" +
                                        "</div>" + 
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ncategoria'>Categoria</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='ncategoria' value='" + actualizalab.val().categoria + "'   >" +
                                        "</div>" +
                                        "</div>" + 
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ncategoriadocente'>Categoria docente</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='ncategoriadocente' value='" + actualizalab.val().categoria_docente + "'   >" +
                                        "</div>" +
                                        "</div>" + 
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ncelular'>Numero celular</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='number' class='actualizar-datos form-control' id='ncelular' value='" + actualizalab.val().celular + "'   >" +
                                        "</div>" +
                                        "</div>" +
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ncodigoescuela'>Edificio</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='number' class='actualizar-datos form-control' id='ncodigoescuela' value='" + actualizalab.val().cod_escuela + "'   required>" +
                                        "</div>" +
                                        "</div>" +
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ncod_georef'>Objeto geografico</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='number' class='actualizar-datos form-control' id='ncod_georef' value='" + actualizalab.val().cod_georef + "'   required>" +
                                        "</div>" +
                                        "</div>" +
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ndireccion'>Direccion:</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='ndireccion' value='" + actualizalab.val().direccion + "'   >" +
                                        "</div>" +
                                        "</div>" + 
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nemail'><b>Email de acceso</b>(encargado)</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='mail' class='actualizar-datos form-control' id='nemail' value='" + actualizalab.val().email_univalle + "'   >" +
                                        "</div>" +
                                        "</div>" + 
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nnombreresponsable'>Nombre del responsable</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='nnombreresponsable' value='" + actualizalab.val().nombre_responsable + "' style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'  >" +
                                        "</div>" +
                                        "</div>" +
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nescuela'>Escuela o departmento</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='nescuela' value='" + actualizalab.val().escuela_o_departamento + "' style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'   >" +

                                        "</div>" +
                                        "</div>" + 
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nespacio'>Espacio:</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='number' class='actualizar-datos form-control' id='nespacio' value='" + actualizalab.val().espacio + "'  required >" +
                                        "</div>" +
                                        "</div>" + 
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ngrupoinvestigacion'>Grupo de investigacion</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='ngrupoinvestigacion' value='" + actualizalab.val().grupo_de_investigacion + "' style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'   >" +
                                        "</div>" +
                                        "</div>" + 
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nhorasemana'>Hora semana</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='nhorasemana' value='" + actualizalab.val().hora_semana + "'   >" +
                                        "</div>" +
                                        "</div>" + 
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nidentificacion'>Identificacion</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='nidentificacion' value='" + actualizalab.val().identificacion + "'   >" +
                                        "</div>" +
                                        "</div>" + 
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nmetros2'>Metros cuadrados</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='number' class='actualizar-datos form-control' id='nmetros2' value='" + actualizalab.val().m2 + "'   >" +
                                        "</div>" +
                                        "</div>" +
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nnotas'>Notas:</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='nnotas' value='" + actualizalab.val().notas + "'   >" +
                                        "</div>" +
                                        "</div>" +
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='noficina'>Oficina</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='noficina' value='" + actualizalab.val().oficina + "'   >" +
                                        "</div>" +
                                        "</div>" +
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='npersonal'>Personal: </label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='npersonal' value='" + actualizalab.val().personal + "'   >" +
                                        "</div>" +
                                        "</div>" +
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nresolucioncreacion'>Resolucion de creacion</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='nresolucioncreacion' value='" + actualizalab.val().resolucion_de_creacion + "'   >" +
                                        "</div>" +
                                        "</div>" +
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nsede'>Sede:</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='nsede' value='" + actualizalab.val().sede + "' style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'   >" +
                                        "</div>" +
                                        "</div>" +
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ntelefono'>Telefono</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='ntelefono' value='" + actualizalab.val().telefono + "'   >" +
                                        "</div>" +
                                        "</div>" +
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ntelefonolab'>Telefono laboratorio</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='ntelefonolab' value='" + actualizalab.val().telefono_lab + "'   >" +
                                        "</div>" +
                                        "</div>" +


                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nestado'>Estado:</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<label class='radio-inline nestado'><input type='radio' name='nestado' value='activo' id='"+actualizalab.key+"activo'>Activo</label>"+
                                        "<label class='radio-inline nestado'><input type='radio' name='nestado' value='inoperante' id='"+actualizalab.key+"inoperante'>Inoperante</label>"+
                                        "</div>" +
                                        "</div>" +

                                        "<div class='form-group'>" +
                                            "<div class='row'>" +

                                                "<div class='col-md-offset-2 col-md-3'>" +
                                                "<button class='btn-borra-laboratorio-raw btn btn-block btn-danger'  key=" + actualizalab.key + " >Borrar laboratorio</button>"+
                                               



                                                "</div>" +
                                                "<div class='col-md-offset-2 col-md-3'>" +
                                                "<button class='btn-actualiza-laboratorio-raw btn btn-block btn-primary'  key=" + actualizalab.key + " >Actualiza datos</button>"+

                                                "</div>" +
                                            "</div>" +
                                        "</div>" +
                                    "</div>" 


                                   );
                                if (actualizalab.val().estado==="activo") {
                                    $("#"+actualizalab.key+"activo").prop("checked", true);
                                }else  {
                                    $("#"+actualizalab.key+"inoperante").prop("checked", true);
                                }




                               });
                       }
                       dataid = $('.selected').children().attr('id');
                       $('#myModal').modal();

               });
                  spinner.stop();


              }, function(error){
                console.log("error",error);
                spinner.stop();

              });
        
    }
    // funcion que renderiza el formulario e nuevo laboratorio
    var funNuevoLaboratorio = function () {
                    
                    $('.modal-title').html('<h3> Nuevo laboratorio </h3>');
                    $('#myModal .modal-body').html('<form class="form-horizontal"></form>');
                    $('.form-horizontal').html(
                                       "<div class= 'nuevolab'>" +
                                       
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nnombre-lab'>Nombre Laboratorio</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='nnombre-lab' style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'  >" +
                                        "</div>" +
                                        "</div>" +

                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ncodigolaboratorio'>Codigo laboratorio</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='number' class='actualizar-datos form-control' id='ncodigolaboratorio'    required>" +
                                        "</div>" +
                                        "</div>" + 

                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nactividad'>Actividad:</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='nactividad'  style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'  >" +
                                        "</div>" +                                        
                                        "</div>" +

                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nfechafundacion'>Fecha de fundación:</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='date' class='actualizar-datos form-control' id='nfechafundacion' >" +
                                        "</div>" +
                                        "</div>" +

                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ncapacidadestudiantes'>Capacidad estudiantes:</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='number' class='actualizar-datos form-control' id='ncapacidadestudiantes'    required>" +
                                        "</div>" +
                                        "</div>" + 
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ncapacidadmaxestudiantes'>Capacidad maxima de estudiantes</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='number' class='actualizar-datos form-control' id='ncapacidadmaxestudiantes'    required>" +
                                        "</div>" +
                                        "</div>" + 
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ncargo'>Cargo</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='ncargo' >" +
                                        "</div>" +
                                        "</div>" + 
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ncategoria'>Categoria</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='ncategoria' >" +
                                        "</div>" +
                                        "</div>" + 
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ncategoriadocente'>Categoria docente</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='ncategoriadocente' >" +
                                        "</div>" +
                                        "</div>" + 
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ncelular'>Numero celular</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='number' class='actualizar-datos form-control' id='ncelular' >" +
                                        "</div>" +
                                        "</div>" +
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ncodigoescuela'>Edificio</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='number' class='actualizar-datos form-control' id='ncodigoescuela'    required>" +
                                        "</div>" +
                                        "</div>" +
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ncod_georef'>Objeto geografico</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='number' class='actualizar-datos form-control' id='ncod_georef'   required>" +
                                        "</div>" +
                                        "</div>" +
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ndireccion'>Direccion:</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='ndireccion' >" +
                                        "</div>" +
                                        "</div>" + 
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nemail'><b>Email de acceso</b>(encargado)</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='mail' class='actualizar-datos form-control' id='nemail' >" +
                                        "</div>" +
                                        "</div>" + 
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nnombreresponsable'>Nombre del responsable</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='nnombreresponsable'  style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'  >" +
                                        "</div>" +
                                        "</div>" +
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nescuela'>Escuela o departmento</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='nescuela'  style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'   >" +

                                        "</div>" +
                                        "</div>" + 
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nespacio'>Espacio:</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='number' class='actualizar-datos form-control' id='nespacio' >" +
                                        "</div>" +
                                        "</div>" + 
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ngrupoinvestigacion'>Grupo de investigacion</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='ngrupoinvestigacion'  style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'   >" +
                                        "</div>" +
                                        "</div>" + 
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nhorasemana'>Hora semana</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='nhorasemana' >" +
                                        "</div>" +
                                        "</div>" + 
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nidentificacion'>Identificacion</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='nidentificacion' >" +
                                        "</div>" +
                                        "</div>" + 
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nmetros2'>Metros cuadrados</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='number' class='actualizar-datos form-control' id='nmetros2' >" +
                                        "</div>" +
                                        "</div>" +
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nnotas'>Notas:</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='nnotas' >" +
                                        "</div>" +
                                        "</div>" +
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='noficina'>Oficina</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='noficina' >" +
                                        "</div>" +
                                        "</div>" +
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='npersonal'>Personal: </label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='npersonal' >" +
                                        "</div>" +
                                        "</div>" +
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nresolucioncreacion'>Resolucion de creacion</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='nresolucioncreacion' >" +
                                        "</div>" +
                                        "</div>" +
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nsede'>Sede:</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='nsede'  style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'   >" +
                                        "</div>" +
                                        "</div>" +
                                        
                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ntelefono'>Telefono</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='ntelefono' >" +
                                        "</div>" +
                                        "</div>" +

                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='ntelefonolab'>Telefono laboratorio</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='ntelefonolab' >" +
                                        "</div>" +
                                        "</div>" +


                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='nestado'>Presta servicios fuera de univalle:</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<label class='radio-inline nestado'><input type='radio' name='nestado' value='activo' id='activo'>Activo</label>"+
                                        "<label class='radio-inline nestado'><input type='radio' name='nestado' value='inoperante' id='inoperante'>Inoperante</label>"+
                                        "</div>" +
                                        "</div>" +

                                        "<div class='form-group'>" +
                                        "<label class='control-label col-sm-4' for='npce'>PCE</label>" +
                                        "<div class='col-sm-8'>" +
                                        "<input type='text' class='actualizar-datos form-control' id='npce' >" +
                                        "</div>" +
                                        "</div>" +

                                        "<div class='form-group'>" +
                                            "<div class='row'>" +

                                                
                                                "<div class='col-md-offset-2 col-md-3'>" +
                                                "<button class='btn-nuevo-laboratorio-raw btn btn-block btn-primary'  >Crear</button>"+

                                                "</div>" +
                                            "</div>" +
                                        "</div>" +
                                    "</div>" 


                                   );
                                $('#myModal').modal();
               
    }


    // funcion que borra un laboratorio
    var funBorrarlab = function (keylab) {
        db.ref('/informacion_laboratorios/'+keylab)
        .remove()
            .then(function() {
                swal("Borrado!",
                "Laboratorio removido de la base de datos.",
                "success");
                funListadoUsuariosRaw();
            })
            .catch(function(error) {
                console.log("Remove failed: " + error.message);
            });
        
    }


     $('#menu-listado-laboratorios-raw').on('click', function (event) {// crea la lista de laboratorios RAW
        event.preventDefault();
        funListadoUsuariosRaw();
    });
    $('#menu-crea-laboratorios-raw').on('click', function (event) {// crea la lista de laboratorios RAW
        event.preventDefault();
        funNuevoLaboratorio();
    });


        $(document).on('click', '.btn-actualiza-laboratorio-raw', function (event) {//actualiza informacion de laboratorio
        event.preventDefault();
        var key = $(this).attr('key');
        var selcodigoescuela = parseInt($("[class='" + key + "']").find('#ncodigoescuela').val());
        var selcodigogeografico = parseInt($("[class='" + key + "']").find('#ncod_georef').val());
        var estudiantes = parseInt($("[class='" + key + "']").find('#ncapacidadestudiantes').val());
        var maxestudiantes = parseInt($("[class='" + key + "']").find('#ncapacidadmaxestudiantes').val());
        var espacio = parseInt($("[class='" + key + "']").find('#nespacio').val());
        if (isNaN(selcodigoescuela)) {
            $("#ncodigoescuela").focus();
            swal("Alerta!", "el edificio debe ser un numero.","error");
        
        }else if (isNaN(selcodigogeografico)) {
            $("#ncod_georef").focus();
            swal("Alerta!","El objeto geografico debe ser un numero.","error");
        
        }else if (isNaN(estudiantes)) {
            $("#ncapacidadestudiantes").focus();
            swal("Alerta!","La cantida de estudiantes debe ser un numero.","error");
        
        }else if (isNaN(maxestudiantes)) {
            $("#ncapacidadmaxestudiantes").focus();
            swal("Alerta!","La cantida maxima de estudiantes debe ser un numero.","error");
                    
        
        }else if (isNaN(espacio)) {
            $("#nespacio").focus();
            swal("Alerta!","El espacio debe ser un numero.","error");
                    
        
        }else {

                    var updates = {};
                    updates['/informacion_laboratorios/' + key + '/actividad/'] = $("[class='" + key + "']").find('#nactividad').val();
                    updates['/informacion_laboratorios/' + key + '/ano_de_fundacion/'] = $("[class='" + key + "']").find('#nfechafundacion').val();
                    updates['/informacion_laboratorios/' + key + '/capacidad_estudiantes/'] = estudiantes;
                    updates['/informacion_laboratorios/' + key + '/capacidad_maxima_estudiantes/'] = maxestudiantes;
                    updates['/informacion_laboratorios/' + key + '/cargo/'] = $("[class='" + key + "']").find('#ncargo').val();
                    updates['/informacion_laboratorios/' + key + '/categoria/'] = $("[class='" + key + "']").find('#ncategoria').val();
                    updates['/informacion_laboratorios/' + key + '/categoria_docente/'] = $("[class='" + key + "']").find('#ncategoriadocente').val();
                    updates['/informacion_laboratorios/' + key + '/celular/'] = $("[class='" + key + "']").find('#ncelular').val();
                    updates['/informacion_laboratorios/' + key + '/cod_escuela/'] = selcodigoescuela;
                    updates['/informacion_laboratorios/' + key + '/direccion/'] = $("[class='" + key + "']").find('#ndireccion').val();
                    updates['/informacion_laboratorios/' + key + '/email_univalle/'] = $("[class='" + key + "']").find('#nemail').val();
                    updates['/informacion_laboratorios/' + key + '/nombre_responsable/'] = $("[class='" + key + "']").find('#nnombreresponsable').val();
                    updates['/informacion_laboratorios/' + key + '/espacio/'] = espacio;
                    updates['/informacion_laboratorios/' + key + '/escuela_o_departamento/'] = $("[class='" + key + "']").find('#nescuela').val();
                    updates['/informacion_laboratorios/' + key + '/grupo_de_investigacion/'] = $("[class='" + key + "']").find('#ngrupoinvestigacion').val();
                    updates['/informacion_laboratorios/' + key + '/hora_semana/'] = $("[class='" + key + "']").find('#nhorasemana').val();
                    updates['/informacion_laboratorios/' + key + '/identificacion/'] = $("[class='" + key + "']").find('#nidentificacion').val();
                    updates['/informacion_laboratorios/' + key + '/m2/'] = $("[class='" + key + "']").find('#nmetros2').val();
                    updates['/informacion_laboratorios/' + key + '/notas/'] = $("[class='" + key + "']").find('#nnotas').val();
                    updates['/informacion_laboratorios/' + key + '/oficina/'] = $("[class='" + key + "']").find('#noficina').val();
                    updates['/informacion_laboratorios/' + key + '/personal/'] = $("[class='" + key + "']").find('#npersonal').val();
                    updates['/informacion_laboratorios/' + key + '/resolucion_de_creacion/'] = $("[class='" + key + "']").find('#nresolucioncreacion').val();
                    updates['/informacion_laboratorios/' + key + '/sede/'] = $("[class='" + key + "']").find('#nsede').val();
                    updates['/informacion_laboratorios/' + key + '/telefono/'] = $("[class='" + key + "']").find('#ntelefono').val();
                    updates['/informacion_laboratorios/' + key + '/nombre_de_laboratorio/'] = $("[class='" + key + "']").find('#nnombre-lab').val();
                    updates['/informacion_laboratorios/' + key + '/telefono_lab/'] = $("[class='" + key + "']").find('#ntelefonolab').val();
                    updates['/informacion_laboratorios/' + key + '/fecha_actualizacion/'] = funfecha();

                        if ($("[class='" + key + "']").find('input[name=nestado]:checked').val()==="activo") {
                        updates['/informacion_laboratorios/' + key + '/estado/'] = "activo";

                        }else if ($("[class='" + key + "']").find('input[name=nestado]:checked').val()==="inoperante") {
                        updates['/informacion_laboratorios/' + key + '/estado/'] = "inoperante";

                        }








                            return firebase.database().ref().update(updates, function(error) {
                            if (error) {
                                swal("Error!",
                                "Error al guardar los datos, intentelo mas tarde",
                                "error");
                            } else {
                                swal("Guardados!",
                                "Datos guardados correctamente",
                                "success");
                                funListadoUsuariosRaw();
                            }
                            });

        }
                    });



    //Accion al ejecutar el boton borrar
    $(document).on('click', '.btn-borra-laboratorio-raw', function (event) {//actualiza informacion de laboratorio
        event.preventDefault();
        var key = $(this).attr('key');
        swal({
        title: "¿Seguro que desea borrar este laboratorio?",
        text: "Este laboratorio no podra ser recuperado",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Si, Borrarlo!",
        closeOnConfirm: false,
        html: false
        }, function(){

            db.ref('/informacion_laboratorios/'+key).once("value")
                .then(function(lab_copia) {

                            var refLabs = db.ref('laboratorios_borrados');
                            var refnewlab = refLabs.push();
                            return refnewlab.set(lab_copia.val()).then(function(){
                                
                                 refnewlab.update({
                                     email_usuario_borador : email,
                                     uid_usuario_borrador: uid,
                                     fecha_borrado : funfecha()
                                 }).then(function(error) {
                                        funBorrarlab(key);
                                    });





                                
                            }).catch(function (error) {
                                swal("Error!",
                                "Error al guardar los datos, intentelo mas tarde",
                                "error");
                            });

                });







            
        });
    });
//****************************************  nuevo laboratorio */
        $(document).on('click', '.btn-nuevo-laboratorio-raw' , function (event) {//agregar  ensayos  a laboratorio
        event.preventDefault();

        var codigolaboratorio = parseInt($(".nuevolab").find('#ncodigolaboratorio').val());
        var selcodigoescuela = parseInt($(".nuevolab").find('#ncodigoescuela').val());
        var selcodigogeografico = parseInt($(".nuevolab").find('#ncod_georef').val());
        var estudiantes = parseInt($(".nuevolab").find('#ncapacidadestudiantes').val());
        var maxestudiantes = parseInt($(".nuevolab").find('#ncapacidadmaxestudiantes').val());
        var espacio = parseInt($(".nuevolab").find('#nespacio').val());
        if (isNaN(codigolaboratorio)) {
             $("#ncodigolaboratorio").focus();
            swal("Alerta!","el codigo debe ser un numero.","error");
        } else if (isNaN(selcodigoescuela)) {
            $("#ncodigoescuela").focus();
            swal("Alerta!","el edificio debe ser un numero.","error");
        }else if (isNaN(selcodigogeografico)) {
            $("#ncod_georef").focus();
            swal("Alerta!","El objeto geografico debe ser un numero.","error");
        }else if (isNaN(estudiantes)) {
            $("#ncapacidadestudiantes").focus();
            swal("Alerta!","La cantida de estudiantes debe ser un numero.","error");
        }else if (isNaN(maxestudiantes)) {
            $("#ncapacidadmaxestudiantes").focus();
            swal("Alerta!","La cantida maxima de estudiantes debe ser un numero.","error");
        }else if (isNaN(espacio)) {
            $("#nespacio").focus();
            swal("Alerta!","El espacio debe ser un numero.","error");
        }else {
            db.ref('informacion_laboratorios')
                .orderByChild('cod_lab')
                .equalTo(codigolaboratorio)
                .once("value")
                .then(function(laboratorios) {
                    console.log(laboratorios.numChildren());
                    console.log(laboratorios.exists());
                    var existelab = laboratorios.exists();
                    if (!existelab) {

                        var newEdif = firebase.database().ref('edificios');
                                newEdif.orderByValue().limitToLast(1).once("value", function(snapshot) {
                                snapshot.forEach(function(data) {
                                    selcodigogeografico = data.val().cod_georef;
                                    selcodigogeografico++;
                        var updates = {};

                        updates['cod_lab'] = codigolaboratorio;  
                        updates['area_conocimiento'] = "";
                        updates['codigo_pruebas_y_ensayos'] = "";
                        updates['email'] = "";
                        updates['equipo_robusto'] = "";
                        updates['grupo_investigacion_encargado'] = "";
                        updates['pce'] = $(".nuevolab").find('#npce').val();
                        updates['telefono_responsable'] = "";

                        updates['actividad'] = $(".nuevolab").find('#nactividad').val();
                        updates['ano_de_fundacion'] = $(".nuevolab").find('#nfechafundacion').val();
                        updates['capacidad_estudiantes'] = estudiantes;
                        updates['capacidad_maxima_estudiantes'] = maxestudiantes;
                        updates['cargo'] = $(".nuevolab").find('#ncargo').val();
                        updates['categoria'] = $(".nuevolab").find('#ncategoria').val();
                        updates['categoria_docente'] = $(".nuevolab").find('#ncategoriadocente').val();
                        updates['celular'] = $(".nuevolab").find('#ncelular').val();
                        updates['cod_escuela'] = selcodigoescuela;
                        updates['cod_georef'] = selcodigogeografico;
                        updates['direccion'] = $(".nuevolab").find('#ndireccion').val();
                        updates['email_univalle'] = $(".nuevolab").find('#nemail').val();
                        updates['nombre_responsable'] = $(".nuevolab").find('#nnombreresponsable').val();
                        updates['espacio'] = espacio;
                        updates['escuela_o_departamento'] = $(".nuevolab").find('#nescuela').val();
                        updates['grupo_de_investigacion'] = $(".nuevolab").find('#ngrupoinvestigacion').val();
                        updates['hora_semana'] = $(".nuevolab").find('#nhorasemana').val();
                        updates['identificacion'] = $(".nuevolab").find('#nidentificacion').val();
                        updates['m2'] = $(".nuevolab").find('#nmetros2').val();
                        updates['notas'] = $(".nuevolab").find('#nnotas').val();
                        updates['oficina'] = $(".nuevolab").find('#noficina').val();
                        updates['personal'] = $(".nuevolab").find('#npersonal').val();
                        updates['resolucion_de_creacion'] = $(".nuevolab").find('#nresolucioncreacion').val();
                        updates['sede'] = $(".nuevolab").find('#nsede').val();
                        updates['telefono'] = $(".nuevolab").find('#ntelefono').val();
                        updates['nombre_de_laboratorio'] = $(".nuevolab").find('#nnombre-lab').val();
                        updates['telefono_lab'] = $(".nuevolab").find('#ntelefonolab').val();
                        updates['fecha_actualizacion'] = funfecha();

                        if ($(".nuevolab").find('input[name=nestado]:checked').val()==="activo") {
                        updates['estado'] = "activo";

                        }else {
                        updates['estado'] = "inoperante";

                        }




                            var refLabs = db.ref('informacion_laboratorios');
                            var refnewlab = refLabs.push();
                            return refnewlab.set(updates).then(function(){
                                 
                                    console.log("The " + data.key + " score is " + data.val());
                                     var newEdifRef = newEdif.push();

                                    newEdifRef.set(
                                        {ESPACIO:espacio,
                                        Latitud:0,
                                        Longitud:0,
                                        OBJECTID:"",
                                        cod_georef:selcodigogeografico,
                                        edif:selcodigoescuela,
                                        escuela_departamento:$(".nuevolab").find('#nescuela').val(),
                                        nombre_lab:$(".nuevolab").find('#nnombre-lab').val(),
                                        piso:0,
                                        sede:$(".nuevolab").find('#nsede').val()}
                                    ).then(function (params) {
                                        
                                    }).catch(function (error) {
                                        console.log('error', error);
                                    });
                                
                                 
                                
                                swal("Guardados!",
                                "Nuevo laboratorio creado correctamente",
                                "success");
                            }).catch(function (error) {
                                swal("Error!",
                                "Error al guardar los datos, intentelo mas tarde",
                                "error");
                            });
                            });
                         //**************  
                            });
                    }else{
                        swal("Error!",
                                "El codigo de laboratorio ya existe!",
                                "error");
                    }
                  

                    
                    //$('#myModal').modal('hide');

                });

        }  


        

    });

});

