
$(document).ready(function () {



        /**
         * @constructor
         */
        function Cache() {
            this._data = {};
        }
        //Y luego le agregamos los métodos:

        /**
         * Agrega o reemplaza un elemento del
         * cache
         *
         * @param {String} key
         * @param {Object} value
         */
        Cache.prototype.set = function(key, value) {
            this._data[key] = value;
        };

        /**
         * Agrega o reemplaza un elemento del
         * cache
         *
         * @param {String} key
         * @return {Object} value
         */
        Cache.prototype.get = function(key) {
            return this._data[key];
        };
        //Con esta implementación, ya podemos realizar las operaciones básicas:

        // Instanciamos nuestro cache
       // var cache = new Cache();

        // Almacenamos informacion
       // cache.set('person', 'John Doe');

        // Y la obtenemos
       //console.log(cache.get('person')); // "John Doe"


/**
         * @constructor
         */
        function CacheArray() {
            this._data = [];
        }
        //Y luego le agregamos los métodos:

        /**
         * Agrega o reemplaza un elemento del
         * cache
         *
         * @param {String} key
         * @param {Object} value
         */
        CacheArray.prototype.set = function(value) {
            this._data.push( value);
        };

        /**
         * Agrega o reemplaza un elemento del
         * cache
         *
         * @param {String} key
         * @return {Object} value
         */
        CacheArray.prototype.get = function(key) {
            if(key !== undefined){
                                console.log(this._data);

                return this._data[key];
            }else{
                return this._data;
            }
            
        };
        //Con esta implementación, ya podemos realizar las operaciones básicas:

        // Instanciamos nuestro cache
       // var cachearray = new CacheArray();
        // Almacenamos informacion
        //cachearray.set( 'francisco Hurtado');

        // Y la obtenemos
       // console.log(cachearray.get()); // "John Doe"














    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    // Get the size of an object
     

    var db = firebase.database();






    $('#menu-generar-listado-labs').on('click', function () {// crea la lista de equipos
        
        $("#boxtitle").text("Listado laboratorios");
        $('#container').html(
            //spinner
            '<div class="overlay">'+
                '<i class="fa fa-refresh fa-spin"></i>'+
                '</div>'+
            
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
        $('#myModal .modal-body').html('<form class="form-horizontal"></form>')


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
                                   $('.form-horizontal').html("<div class=" + actualizalab.key + ">" +
                                       "<h4>Actualiza la informaciondel laboratorio: "+actualizalab.val().nombre_de_laboratorio+"</h4>" +
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
                                       "</div>" + "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='ncapacidadmaxestudiantes'>Capacidad maxima de estudiantes</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='number' class='actualizar-datos form-control' id='ncapacidadmaxestudiantes' value='" + actualizalab.val().capacidad_maxima_estudiantes + "'   required>" +
                                       "</div>" +
                                       "</div>" + "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='ncargo'>Cargo</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='ncargo' value='" + actualizalab.val().cargo + "'   >" +
                                       "</div>" +
                                       "</div>" + "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='ncategoria'>Categoria</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='ncategoria' value='" + actualizalab.val().categoria + "'   >" +
                                       "</div>" +
                                       "</div>" + "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='ncategoriadocente'>Categoria docente</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='ncategoriadocente' value='" + actualizalab.val().categoria_docente + "'   >" +
                                       "</div>" +
                                       "</div>" + "<div class='form-group'>" +
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
                                       "</div>" + "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='nemail'><b>Email de acceso</b>(encargado)</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='mail' class='actualizar-datos form-control' id='nemail' value='" + actualizalab.val().email_univalle + "'   >" +
                                       "</div>" +
                                       "</div>" + "<div class='form-group'>" +
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
                                       "</div>" + "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='nespacio'>Espacio:</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='number' class='actualizar-datos form-control' id='nespacio' value='" + actualizalab.val().espacio + "'  required >" +
                                       "</div>" +
                                       "</div>" + "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='ngrupoinvestigacion'>Grupo de investigacion</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='ngrupoinvestigacion' value='" + actualizalab.val().grupo_de_investigacion + "' style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'   >" +
                                       "</div>" +
                                       "</div>" + "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='nhorasemana'>Hora semana</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='nhorasemana' value='" + actualizalab.val().hora_semana + "'   >" +
                                       "</div>" +
                                       "</div>" + "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='nidentificacion'>Identificacion</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='nidentificacion' value='" + actualizalab.val().identificacion + "'   >" +
                                       "</div>" +
                                       "</div>" + "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='nmetros2'>Metros cuadrados</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='number' class='actualizar-datos form-control' id='nmetros2' value='" + actualizalab.val().m2 + "'   >" +
                                       "</div>" +
                                       "</div>" +"<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='nnotas'>Notas:</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='nnotas' value='" + actualizalab.val().notas + "'   >" +
                                       "</div>" +
                                       "</div>" +"<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='noficina'>Oficina</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='noficina' value='" + actualizalab.val().oficina + "'   >" +
                                       "</div>" +
                                       "</div>" +"<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='npersonal'>Personal: </label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='npersonal' value='" + actualizalab.val().personal + "'   >" +
                                       "</div>" +
                                       "</div>" +"<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='nresolucioncreacion'>Resolucion de creacion</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='nresolucioncreacion' value='" + actualizalab.val().resolucion_de_creacion + "'   >" +
                                       "</div>" +
                                       "</div>" +"<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='nsede'>Sede:</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='nsede' value='" + actualizalab.val().sede + "' style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'   >" +
                                       "</div>" +
                                       "</div>" +"<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='ntelefono'>Telefono</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='ntelefono' value='" + actualizalab.val().telefono + "'   >" +
                                       "</div>" +
                                       "</div>" +"<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='ntelefonolab'>Telefono laboratorio</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='ntelefonolab' value='" + actualizalab.val().telefono_lab + "'   >" +
                                       "</div>" +
                                       "</div>" +

                                       "<div class='form-group'>" +

                                       "<div class='col-sm-offset-2 col-sm-10'>" +
                                       "<button class='btn-actualiza-laboratorio btn btn-primary'  key=" + actualizalab.key + " >Actualiza datos</button></form></div>" +
                                       "</div>" +
                                       "</div>" +
                                       "</div>"

                                   );




                               });
                       }
                       dataid = $('.selected').children().attr('id');
                       $('#myModal').modal();

               });
                  $(".overlay").remove();


              }, function(error){
                console.log("error",error);
                $(".overlay").remove();

              });
            });



    $('#menu-generar-listado-usuarios').on('click', function (event) {// crea la lista de usuarios
        event.preventDefault();
        
        $("#boxtitle").text("Listado Usuarios");

        $('#container').html(
            '<div class="overlay">'+
                '<i class="fa fa-refresh fa-spin"></i>'+
                '</div>'+
            '<div id="tabla"><table id="tablausuarios" class="table table-bordered table-hover" >' +
            '<thead>' +
            '<tr>' +
            '<th>Usuario</th>' +
            '<th>Correo</th>' +
            '<th>Rol</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody id="tablabody" ></tbody>' +
            '</table></div>');

        $('#myModal .modal-body').html('<form class="form-horizontal"></form>');


        db.ref("usuarios")
            .once("value").then(function (usuarios) {
                var i = 0,
                    children = usuarios.numChildren();
                return new Promise(function(resolve){
                    usuarios.forEach(function(usuario) {
                        $('#tablabody').append('<tr>' +
                            '<td  id=' +  usuario.key + '>' + usuario.val().displayname + '</td>' +
                            '<td id=' + usuario.key + '>' + usuario.val().email + '</td>' +
                            '<td id=' + usuario.key + '>' + usuario.val().url + '</td>' +
                            '</tr>');
                            i++;
                        if (i==children) {
                            resolve();
                        }
                        });
                    });
                
               

            }).then(function (resolve) {
                var tablausuarios = $('#tablausuarios').DataTable();
                
                $(".overlay").remove();
                 $('#tablabody').on('click', 'tr', function (event) {
                     event.preventDefault();
                    if ($(this).hasClass('selected')) {
                        $(this).removeClass('selected');

                    }
                    else {
                        tablausuarios.$('tr.selected').removeClass('selected');
                        $(this).addClass('selected');
                        dataid = $('.selected').children().attr('id');

                        db.ref("usuarios/" + dataid)
                            .once("value", function (snapactualizausuario) {
                                //console.log(actualizalab.val());
                                $('.form-horizontal').html(
                                    "<div class=" + snapactualizausuario.key + ">" +
                                    "<form class='form-horizontal'>" +
                                        "<h4>Actualiza la informacion del usuario: "+snapactualizausuario.val().email+"</h4>" +
                                        "<div class='form-group'>" +
                                            "<label class='control-label col-sm-3' for='ndisplayname'>Nombre:</label>" +
                                            "<div class='col-sm-9'>" +
                                            "<input type='text' class='actualizar-datos form-control' id='ndisplayname' value='" + snapactualizausuario.val().displayname + "' style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'  >" +
                                            "</div>" +
                                        "</div>" +
                                        
                                        "<div class='form-group'>" +
                                            "<label class='control-label col-sm-3' for='nempresa'>Empresa:</label>" +
                                            "<div class='col-sm-9'>" +
                                            "<input type='text' class='actualizar-datos form-control' id='nempresa' value='" + snapactualizausuario.val().empresa + "' style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'  >" +
                                            "</div>" +
                                        "</div>" +

                                        "<div class='form-group'>" +
                                            "<label class='control-label col-sm-3' for='ntelefono'>Telefono:</label>" +
                                            "<div class='col-sm-9'>" +
                                            "<input type='text' class='actualizar-datos form-control' id='ntelefono' value='" + snapactualizausuario.val().telefono + "' style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'  >" +
                                            "</div>" +
                                        "</div>" +

                                        "<div class='form-group'>" +
                                            "<label class='control-label col-sm-3' for='ndireccion'>Direccion:</label>" +
                                            "<div class='col-sm-9'>" +
                                            "<input type='text' class='actualizar-datos form-control' id='ndireccion' value='" + snapactualizausuario.val().direccion + "' style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'  >" +
                                            "</div>" +
                                        "</div>" +

                                        "<div class='form-group'>" +
                                            "<label class='control-label col-sm-3' for='nrol'>Rol:</label>" +
                                            "<div class='col-sm-9'>" +
                                                "<select class='actualizar-datos form-control' id='nrol'>"+
                                                    "<option value = 'pages/map.html'>Basico</option>"+
                                                    "<option value = 'nivel2/index.html'>Director laboratorio</option>"+
                                                    "<option value = 'pages/admon.html'>Administrador</option>"+
                                                "</select>"+
                                            "</div>" +
                                        "</div>" +

                                    

                                        "<div class='form-group'>" +// boton de actualizar

                                            "<div class='col-sm-offset-2 col-sm-10'>" +
                                            "<button class='btn-actualiza-usuario btn btn-primary'  key=" + snapactualizausuario.key + " >Actualiza datos</button>" +
                                            "</div>" +
                                        "</div>" +
                                    "</form>"+   
                                    "</div>"

                                );
                                if (snapactualizausuario.val().url === "pages/map.html" ||
                                    snapactualizausuario.val().url === "nivel2/index.html" ||
                                    snapactualizausuario.val().url === "pages/admon.html" ) {
                                    $("#nrol").val(snapactualizausuario.val().url);
                                }



                            });
                    }
                    $('#myModal').modal();

            });
            });

    });

$('#menu-generar-listado-estado').on('click', function (event) {// crea la lista de usuarios contareas pendientes
        event.preventDefault();
        
        $("#boxtitle").text("Listado de usuarios con tareas pendientes");

        $('#container').html(
             '<div class="small-box bg-yellow">'+
                '<div class="inner">'+
                ' <h3 id="cant-laboratorios" ></h3>'+

                '<p>Usuarios con tareas pendientes </p>'+
                '</div>'+
                '<div class="icon">'+
                '<i class="ion ion-stats-bars"></i>'+
                '</div>'+
                '<a href="#" class="small-box-footer" '+
                ' data-toggle="popover" title="Información" data-content= "Listado de usuarios en el sistema, que aun tienen tareas pendientes" >'+
                'Más información <i class="fa fa-arrow-circle-right"></i>'+
                '</a>'+
            '</div>'+
            '<div class="overlay">'+
                '<i class="fa fa-refresh fa-spin"></i>'+
                '</div>' +
            
            '<div id="tabla"><table id="tablausuarios" class="table table-bordered table-hover" >' +
            '<thead>' +
            '<tr>' +
            '<th>Usuario</th>' +
            '<th>Correo</th>' +
            '<th>Estado Laboratorio</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody id="tablabody" ></tbody>' +
            '</table></div>');
        $('#myModal .modal-body').html('<form class="form-horizontal"></form>');


           var refUser = db.ref("/usuariostareasCompletadas/");
            var reflaboratorios = db.ref("/informacion_laboratorios/");

            objCompletas = {};

            
            
            refUser
                .once("value").then(function(tarea) {//DEUDA TECNICA, ESTE CODIGO SE PUEDE MEJORAR
                var i = 0,
                    children = tarea.numChildren();
                return new Promise(function(resolve){
                tarea.forEach(function(usuario) {
                    var childresUsuario = usuario.numChildren();//pendiente
                    usuario.forEach(function(tareausuario) {              
                        

                    if (tareausuario.val().estado=="pendiente") {

                        if (objCompletas[tareausuario.val().usuario]!==undefined) {
                            objCompletas[tareausuario.val().usuario].cantTareas ++ ;
                            }else {
                            
                            objCompletas[tareausuario.val().usuario] = {};
                            objCompletas[tareausuario.val().usuario].cantTareas =1 ; 
                            objCompletas[tareausuario.val().usuario].usuario = tareausuario.val().estado ; 
                            objCompletas[tareausuario.val().usuario].keyusuario = usuario.key ;
                            objCompletas[tareausuario.val().usuario].keytarea = tareausuario.key;
                            objCompletas[tareausuario.val().usuario].fecha = tareausuario.val().fecha ;
                        }
                        
                            i++;
                            //console.log(i,children);
                            if (i==children) {
                            resolve(objCompletas);
                            }
                            

                    }else{
                        i++;
                            //console.log(i,children);
                            if (i==children) {
                            resolve(objCompletas);
                            }
                    }
                                    


                    });

                
                
                
            });

            });

            }).then(function (params) {
            
            var i = 0,
                cantObj = Object.size(params),
                cantUsuariospendientes = 0,
                csvContent = "data:text/csv;charset=utf-8,";
            return new Promise(function(resolve){
                for (usuario in params){                    
                    if (params[usuario].cantTareas !== 0) {
                    reflaboratorios
                    .orderByChild('email_univalle')
                                .equalTo(usuario)
                                .limitToFirst(1)
                                .once("value").then(function(laboratorios) {
                                    var children = laboratorios.exists();
                                if (children) {
                                    laboratorios.forEach(function (lab) {
                                        $('#tablabody').append('<tr>' +
                                        '<td >' + lab.val().nombre_responsable + '</td>' +
                                        '<td >' + lab.val().email_univalle + '</td>' +
                                        '<td >' + lab.val().estado + '</td>' +
                                        '</tr>');
                                        csvContent += lab.val().nombre_responsable+","
                                                        +lab.val().email_univalle+"\n" ;
                                        i++;
                                        cantUsuariospendientes++;
                                        if (i==cantObj) {
                                        $("#cant-laboratorios").text(cantUsuariospendientes);    
                                        resolve(csvContent);
                                        }
                                    });
                                    
                                }else{
                                    i++;
                                    if (i==cantObj) {
                                     $("#cant-laboratorios").text(cantUsuariospendientes);   
                                    resolve(csvContent);
                                    }
                                }
                                
                                }).catch(function(err) {
                                        console.log("error");
                                    });
                    
                    }
                }
            });
            
        }).then(function (csvContent) {
            var tablausuarios = $('#tablausuarios').DataTable();
               
           $(".overlay").remove();
            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "my_data.csv");
            document.body.appendChild(link); // Required for FF

            link.click(); 
            });
        });




//***********************inicio laboratorios inoperantes**************************** */
        $('#menu-generar-listado-laboratorios').on('click', function (event) {// crea la lista de laboratorios inoperantes
        event.preventDefault();
        
        $("#boxtitle").text("Listado de laboratorios Inactivos (inoperantes)");

        $('#container').html(
            '<div class="small-box bg-yellow">'+
                '<div class="inner">'+
                '<h3 id="cant-laboratorios" ></h3>'+

                '<p>Laboratorios Inactivos</p>'+
                '</div>'+
                '<div class="icon">'+
                '<i class="ion ion-stats-bars"></i>'+
                '</div>'+
                '<a href="#" class="small-box-footer'+
                ' data-toggle="popover" title="Información" data-content= "Listado de laboratorios inactivos (tareas pendientes ó no han sido actualizados) ">'+
                'Más información <i class="fa fa-arrow-circle-right"></i>'+
                '</a>'+
            '</div>'+
            '<div class="overlay">'+
                '<i class="fa fa-refresh fa-spin"></i>'+
                '</div>'+
            
            
            '<div id="tabla"><table id="tablausuarios" class="table table-bordered table-hover" >' +
            '<thead>' +
            '<tr>' +
            '<th>Laboratorio</th>' +
            '<th>Nombre director</th>' +
            '<th>Correo director</th>' +
            '<th>Estado Laboratorio</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody id="tablabody" ></tbody>' +
            '</table></div>');
        $('#myModal .modal-body').html('<form class="form-horizontal"></form>');


           //var refUser = db.ref("/usuariostareasCompletadas/");
            var reflaboratorios = db.ref("/informacion_laboratorios/");

            objCompletas = {};

            
            
            reflaboratorios
                .once("value").then(function(laboratorios) {//DEUDA TECNICA, ESTE CODIGO SE PUEDE MEJORAR
                var i = 0,
                    children = laboratorios.numChildren();
                return new Promise(function(resolve){
                laboratorios.forEach(function(laboratorio) {

                    if (laboratorio.val().estado=== "inoperante") {
                            objCompletas[laboratorio.key] = {} ;

                            objCompletas[laboratorio.key].email_univalle = laboratorio.val().email_univalle ||"No disponible" ;
                            objCompletas[laboratorio.key].estado = laboratorio.val().estado ||"No disponible" ; 
                            objCompletas[laboratorio.key].nombre_de_laboratorio = laboratorio.val().nombre_de_laboratorio ||"No disponible" ;
                            objCompletas[laboratorio.key].nombre_responsable = laboratorio.val().nombre_responsable ||"No disponible" ;

                            i++;
                            //console.log(i,children);
                            if (i==children) {
                            resolve(objCompletas);
                            }
                            

                    }else{
                        i++;
                            //console.log(i,children);
                            if (i==children) {
                            resolve(objCompletas);
                            }
                    }
                                    



                
                
                
            });

            });

        }).then(function (params) {
            //console.log(params);
            cacheEemails = new CacheArray();

            var i = 0,
                cantObj = Object.size(params),
                csvContent = "data:text/csv;charset=utf-8,";
            return new Promise(function(resolve){
                for (lab in params){
                    if (params[lab].email_univalle !== "No disponible") {
                        cacheEemails.set(params[lab].email_univalle);
                    }                    
                  
                $('#tablabody').append('<tr>' +
                '<td >' + params[lab].nombre_de_laboratorio + '</td>' +
                '<td >' + params[lab].nombre_responsable + '</td>' +
                '<td >' + params[lab].email_univalle + '</td>' +
                '<td >' + params[lab].estado + '</td>' +
                '</tr>');
                csvContent +=    params[lab].nombre_de_laboratorio.replace(/,/g, "-")+","
                                +params[lab].nombre_responsable+","
                                +params[lab].email_univalle+"\n" ;
                i++;
                if (i==cantObj) {
                $("#cant-laboratorios").text(cantObj);
                resolve(csvContent);
                }
         }
                
            });
            
        }).then(function (csvContent) {
            var tablausuarios = $('#tablausuarios').DataTable();
               
            $(".overlay").remove();

            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "my_data.csv");
            document.body.appendChild(link); // Required for FF

            link.click(); 
            });
        });
//*************************************fin labortorios inoperantes************************ */


//*************************************inicio laboratorios activos************************ */
       $('#menu-generar-listado-laboratorios-activos').on('click', function (event) {// crea la lista de laboratorios inoperantes
        event.preventDefault();
        
        $("#boxtitle").text("Listado laboratorios activos");

        $('#container').html(
            
            '<div class="overlay">'+
                '<i class="fa fa-refresh fa-spin"></i>'+
                '</div>'+
             '<div class="row">'+
                '<div class="col-md-8">'+
                '<div id="tabla"><table id="tablausuarios" class="table table-bordered table-hover" >' +
            '<thead>' +
            '<tr>' +
            '<th>Laboratorio</th>' +
            '<th>Nombre director</th>' +
            '<th>Correo director</th>' +
            '<th>Estado Laboratorio</th>' +
            '<th>Cant ensayos</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody id="tablabody" ></tbody>' +
            '</table></div>'+
                '</div>'+
                '<div class="col-md-4">'+
                    '<div class="row">'+
                        '<div class="col-md-9 col-md-offset-3">'+
                            '<div class="small-box bg-yellow">'+
                            '<div class="inner">'+
                            '<h3 id="cant-laboratorios" ></h3>'+

                            '<p>Laboratorios activos</p>'+
                            '</div>'+
                            '<div class="icon">'+
                            '<i class="ion ion-stats-bars"></i>'+
                            '</div>'+
                            '<a href="#" class="small-box-footer'+
                            ' data-toggle="popover" title="Información" data-content= "Listado de laboratorios activos (tareas completas ) ">'+
                            'Más información <i class="fa fa-arrow-circle-right"></i>'+
                            '</a>'+
                            '</div>'+
                        '</div>'+
                        '<div class="col-md-9 col-md-offset-3">'+
                            '<div class="small-box bg-yellow">'+
                                '<div class="inner">'+
                                '<h3 id="cant-ensayos" ></h3>'+

                                '<p>Ensayos activos en total</p>'+
                                '</div>'+
                                '<div class="icon">'+
                                '<i class="ion ion-stats-bars"></i>'+
                                '</div>'+
                                '<a href="#" class="small-box-footer'+
                                ' data-toggle="popover" title="Información" data-content= "Total de ensayos activos ">'+
                                'Más información <i class="fa fa-arrow-circle-right"></i>'+
                                '</a>'+
                                '</div>'+
                        '</div>'+
                    '</div>'+
                
            
                '</div>'+
            '</div>'
            
            );
        $('#myModal .modal-body').html('<form class="form-horizontal"></form>');


           var refEnsayos = db.ref("/ensayos/");
            var reflaboratorios = db.ref("/informacion_laboratorios/");

            objCompletas = {};

            
            
            reflaboratorios
                .once("value").then(function(laboratorios) {//DEUDA TECNICA, ESTE CODIGO SE PUEDE MEJORAR
                var i = 0,
                    children = laboratorios.numChildren();
                return new Promise(function(resolve){
                laboratorios.forEach(function(laboratorio) {

                    if (laboratorio.val().estado=== "activo") {
                        refEnsayos
                        .orderByChild('nombre_laboratorio')
                        .equalTo(laboratorio.val().nombre_de_laboratorio)
                        .once('value').then(function (ensayoslab) {
                            var cantEnsayosLab = ensayoslab.numChildren();
                            objCompletas[laboratorio.key] = {} ;

                            objCompletas[laboratorio.key].email_univalle = laboratorio.val().email_univalle ||"No disponible" ;
                            objCompletas[laboratorio.key].estado = laboratorio.val().estado ||"No disponible" ; 
                            objCompletas[laboratorio.key].nombre_de_laboratorio = laboratorio.val().nombre_de_laboratorio ||"No disponible" ;
                            objCompletas[laboratorio.key].nombre_responsable = laboratorio.val().nombre_responsable ||"No disponible" ;
                            objCompletas[laboratorio.key].cantEnsayos = cantEnsayosLab ||0 ;

                            i++;
                            //console.log(i,children);
                            if (i==children) {
                            resolve(objCompletas);
                            }
                        });
                            
                            

                    }else{
                        i++;
                            //console.log(i,children);
                            if (i==children) {
                            resolve(objCompletas);
                            }
                    }
                                    



                
                
                
            });

            });

        }).then(function (params) {
            //console.log(params);
            
            var i = 0,
                cantObj = Object.size(params),
                csvContent = "data:text/csv;charset=utf-8,";
            return new Promise(function(resolve){
                for (lab in params){
                                    
                  
                $('#tablabody').append('<tr>' +
                '<td >' + params[lab].nombre_de_laboratorio + '</td>' +
                '<td >' + params[lab].nombre_responsable + '</td>' +
                '<td >' + params[lab].email_univalle + '</td>' +
                '<td >' + params[lab].estado + '</td>' +
                '<td >' + params[lab].cantEnsayos + '</td>' +
                '</tr>');
                csvContent +=    params[lab].nombre_de_laboratorio.replace(/,/g, "-")+","
                                +params[lab].nombre_responsable+","
                                +params[lab].email_univalle+"\n" ;
                i++;
                if (i==cantObj) {
                $("#cant-laboratorios").text(cantObj);
                resolve(csvContent);
                }
         }
                
            });
            
        }).then(function (csvContent) {
             var tablausuarios = $('#tablausuarios').DataTable();
               
            

            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "my_data.csv");
            document.body.appendChild(link); // Required for FF

            link.click(); 

            var refEnsayos = db.ref("/ensayos/");

            objEnsayos = {};

            
            
            refEnsayos
                .orderByChild('estado').equalTo('activo').once("value").then(function(ensayos) {
                var i = 0,
                    children = ensayos.numChildren();
               $("#cant-ensayos").text(children);
               $(".overlay").remove();

            });
        });
});
    // scripts actualizar datos**********************************************************************************




    $(document).on('click', '.btn-actualiza-laboratorio', function (event) {//actualiza informacion de laboratorio
      event.preventDefault();
        var key = $(this).attr('key');
        var selcodigoescuela = parseInt($("[class='" + key + "']").find('#ncodigoescuela').val());
        var selcodigogeografico = parseInt($("[class='" + key + "']").find('#ncod_georef').val());
        var estudiantes = parseInt($("[class='" + key + "']").find('#ncapacidadestudiantes').val());
        var maxestudiantes = parseInt($("[class='" + key + "']").find('#ncapacidadmaxestudiantes').val());
        var espacio = parseInt($("[class='" + key + "']").find('#nespacio').val());
        if (isNaN(selcodigoescuela)) {
        swal("Alerta!","el edificio debe ser un numero.","error");
        $("#ncodigoescuela").focus();
        }else if (isNaN(selcodigogeografico)) {
        swal("Alerta!","El objeto geografico debe ser un numero.","error");
        $("#ncod_georef").focus();
        }else if (isNaN(estudiantes)) {
        swal("Alerta!","La cantida de estudiantes debe ser un numero.","error");
        $("#ncapacidadestudiantes").focus();
        }else if (isNaN(maxestudiantes)) {
        swal("Alerta!","La cantida maxima de estudiantes debe ser un numero.","error");
        $("#ncapacidadmaxestudiantes").focus();
        }else if (isNaN(espacio)) {
        swal("Alerta!","El espacio debe ser un numero.","error");
        $("#nespacio").focus();
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
                    updates['/informacion_laboratorios/' + key + '/telefono_lab/'] = $("[class='" + key + "']").find('#ntelefonolab').val();

                            return firebase.database().ref().update(updates, function(error) {
                              if (error) {
                                swal("Error!",
                                "Error al guardar los datos, intentelo mas tarde",
                                "error");
                              } else {
                                swal("Guardados!",
                                "Datos guardados correctamente",
                                "success");
                              }
                            });

        }


    



    });


    $(document).on('click', '.btn-actualiza-usuario', function (event) {//actualiza informacion de laboratorio
      event.preventDefault();
      var key = $(this).attr('key');

       

        var updates = {};
        updates['/usuarios/' + key + '/displayname/'] = $("[class='" + key + "']").find('#ndisplayname').val();
        updates['/usuarios/' + key + '/empresa/'] = $("[class='" + key + "']").find('#nempresa').val();
        updates['/usuarios/' + key + '/telefono/'] = $("[class='" + key + "']").find('#ntelefono').val();
        updates['/usuarios/' + key + '/direccion/'] = $("[class='" + key + "']").find('#ndireccion').val();
        updates['/usuarios/' + key + '/url/'] = $("[class='" + key + "']").find('#nrol').val();
        
                return firebase.database().ref().update(updates, function(error) {
                    if (error) {
                    swal("Error!",
                                "Error al guardar los datos, intentelo mas tarde",
                                "error");
                    } else {
                    swal("Guardados!",
                                "Datos guardados correctamente",
                                "success");
                    }
                });
             });
            });

$('#container').on('click','.small-box-footer', function () {
    console.log("click");
		$(this).popover({ placement: "bottom",trigger: "fixed"});
		$(this).popover('show');
});
//$('[data-toggle="popover"]').popover();