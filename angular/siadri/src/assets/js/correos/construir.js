/**
 * Filtro de Envio de Correos por:
 * Facultades
 * Escuelas
 * Sedes
 */
$(document).ready(function () {


    // Firebase
    var db = firebase.database();

    Array.prototype.unique=function(a){ // funcion para eliminar los valores duplicados en un array
      return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
    });



    //*******************************************Genera Lista de Sedes Para El Select***************************************
    db.ref("informacion_laboratorios").once("value").then(function (laboratorio) {
        var labs = [];
        var keys = [];
        var counter = [];
        laboratorio.forEach(function (value) {
            labs.push(value.val().sede);
        });
        for (var i = 0; i < labs.length; i++) {
        if (!counter[labs[i]]) {
            counter[labs[i]] = 0;
        }
        counter[labs[i]]++;
        }
        keys = Object.getOwnPropertyNames(counter).sort();
        $(keys).each(function (index, value) {
            if(value != 'N/A' && value != undefined && value != 'length' && value != '')
                $('#selectsedes').append(`<option value='${value}'>${value}</option>`);
        });
        $('#selectsedes').multiSelect({
            selectableHeader: '<button id="btn-all-sedes" type="button" class="custom-header btn btn-block btn-primary btn-xs">TODAS</button>',
            selectionHeader: '<button id="btn-none-sedes" type="button" class="custom-header btn btn-block btn-primary btn-xs">NINGUNA</button>',
            selectableFooter: '<div class="input-group"><input type="text" id="selectable-sedes-search" class="search-input form-control" autocomplete="off" placeholder="Buscar \'MELENDEZ\'"><span class="input-group-addon"><i class="fa fa-search"></i></span></div>',
            selectionFooter: '<div class="input-group"><input type="text" id="selection-sedes-search" class="search-input form-control" autocomplete="off" placeholder="Buscar \'HUV\'"><span class="input-group-addon"><i class="fa fa-search"></i></span></div>',
            afterInit: function(ms){
                var selectableSearchString = '#'+this.$container.attr('id')+' .ms-elem-selectable:not(.ms-selected)';
                this.qs1 = $('#selectable-sedes-search').quicksearch(selectableSearchString).on('keydown', function(e){
                    if (e.which === 40){
                        this.$selectableUl.focus();
                        return false;
                    }
                });
                var selectionSearchString = '#'+this.$container.attr('id')+' .ms-elem-selection.ms-selected';
                this.qs2 = $('#selection-sedes-search').quicksearch(selectionSearchString).on('keydown', function(e){
                    if (e.which == 40){
                        this.$selectionUl.focus();
                        return false;
                    }
                });
            },
            afterSelect: function(values){
                this.qs1.cache();
                this.qs2.cache();
            },
            afterDeselect: function(values){
                this.qs1.cache();
                this.qs2.cache();
            }
        });
        $('#btn-all-sedes').on('click', function(event){
            $('#selectsedes').multiSelect('select_all');
        });
        $('#btn-none-sedes').on('click', function(event){
            $('#selectsedes').multiSelect('deselect_all');
        });
    });
    //*******************************************FIN***************************************



    //*******************************************Genera Lista de Escuelas Para El Select***************************************
    db.ref("informacion_laboratorios").orderByChild('escuela_o_departamento').once("value").then(function (laboratorio) {
        var labs = [];
        var keys = [];
        var counter = [];
        laboratorio.forEach(function (value) {
            labs.push(value.val().escuela_o_departamento);
        });
        for (var i = 0; i < labs.length; i++) {
            if (!counter[labs[i]]) {
                counter[labs[i]] = 0;
            }
            counter[labs[i]]++;
        }
        keys = Object.getOwnPropertyNames(counter).sort();
        $(keys).each(function (index, value) {
            if(value != 'N/A' && value != undefined && value != 'length' && value != '')
                $('#selectescuelas').append(`<option value='${value}'>${value}</option>`);
        });
        $('#selectescuelas').multiSelect({
            selectableHeader: '<button id="btn-all-escuelas" type="button" class="custom-header btn btn-block btn-primary btn-xs">TODAS</button>',
            selectionHeader: '<button id="btn-none-escuelas" type="button" class="custom-header btn btn-block btn-primary btn-xs">NINGUNA</button>',
            selectableFooter: '<div class="input-group"><input type="text" id="selectable-escuelas-search" class="search-input form-control" autocomplete="off" placeholder="Buscar \'QUIMICA\'"><span class="input-group-addon"><i class="fa fa-search"></i></span></div>',
            selectionFooter: '<div class="input-group"><input type="text" id="selection-escuelas-search" class="search-input form-control" autocomplete="off" placeholder="Buscar \'INGENIERIA\'"><span class="input-group-addon"><i class="fa fa-search"></i></span></div>',
            afterInit: function(ms){
                var selectableSearchString = '#'+this.$container.attr('id')+' .ms-elem-selectable:not(.ms-selected)';
                this.qs1 = $('#selectable-escuelas-search').quicksearch(selectableSearchString).on('keydown', function(e){
                    if (e.which === 40){
                        this.$selectableUl.focus();
                        return false;
                    }
                });
                var selectionSearchString = '#'+this.$container.attr('id')+' .ms-elem-selection.ms-selected';
                this.qs2 = $('#selection-escuelas-search').quicksearch(selectionSearchString).on('keydown', function(e){
                    if (e.which == 40){
                        this.$selectionUl.focus();
                        return false;
                    }
                });
            },
            afterSelect: function(){
                this.qs1.cache();
                this.qs2.cache();
            },
            afterDeselect: function(){
                this.qs1.cache();
                this.qs2.cache();
            }
        });
        $('#btn-all-escuelas').on('click', function(event){
            $('#selectescuelas').multiSelect('select_all');
        });
        $('#btn-none-escuelas').on('click', function(event){
            $('#selectescuelas').multiSelect('deselect_all');
        });
    });
    //*******************************************FIN***************************************




    //******************Genera Lista de Laboratorios Inoperantes***************************
    db.ref("/informacion_laboratorios/").once("value").then(function(laboratorios) {
        var labs = [];
        var keys = [];
        var counter = [];
        laboratorios.forEach(function (value) {
            labs.push(value.val().nombre_de_laboratorio);
        });
        for (var i = 0; i < labs.length; i++) {
            if (!counter[labs[i]]) {
                counter[labs[i]] = 0;
            }
            counter[labs[i]]++;
        }
        keys = Object.getOwnPropertyNames(counter).sort();
        $(keys).each(function (index, value) {
            if(value != 'N/A' && value != undefined && value != 'length' && value != '')
                $('#selectlabinoperante').append(`<option value='${value}'>${value}</option>`);
        });
        $('#selectlabinoperante').multiSelect({
            selectableHeader: '<button id="btn-all-inoperantes" type="button" class="custom-header btn btn-block btn-primary btn-xs">TODOS</button>',
            selectionHeader: '<button id="btn-none-inoperantes" type="button" class="custom-header btn btn-block btn-primary btn-xs">NINGUNO</button>',
            selectableFooter: '<div class="input-group"><input type="text" id="selectable-inoperantes-search" class="search-input form-control" autocomplete="off" placeholder="Buscar \'GEOMATICA\'"><span class="input-group-addon"><i class="fa fa-search"></i></span></div>',
            selectionFooter: '<div class="input-group"><input type="text" id="selection-inoperantes-search" class="search-input form-control" autocomplete="off" placeholder="Buscar \'AVISPA\'"><span class="input-group-addon"><i class="fa fa-search"></i></span></div>',
            afterInit: function(ms){
                var selectableSearchString = '#'+this.$container.attr('id')+' .ms-elem-selectable:not(.ms-selected)';
                this.qs1 = $('#selectable-inoperantes-search').quicksearch(selectableSearchString).on('keydown', function(e){
                    if (e.which === 40){
                        this.$selectableUl.focus();
                        return false;
                    }
                });
                var selectionSearchString = '#'+this.$container.attr('id')+' .ms-elem-selection.ms-selected';
                this.qs2 = $('#selection-inoperantes-search').quicksearch(selectionSearchString).on('keydown', function(e){
                    if (e.which == 40){
                        this.$selectionUl.focus();
                        return false;
                    }
                });
            },
            afterSelect: function(){
                this.qs1.cache();
                this.qs2.cache();
            },
            afterDeselect: function(){
                this.qs1.cache();
                this.qs2.cache();
            }
        });
        $('#btn-all-inoperantes').on('click', function(event){
            $('#selectlabinoperante').multiSelect('select_all');
        });
        $('#btn-none-inoperantes').on('click', function(event){
            $('#selectlabinoperante').multiSelect('deselect_all');
        });
    });
    //*******************************************FIN***************************************



    //******************Genera Lista de Laboratorios con Tareas Pendientes***************************
    db.ref("/usuariostareasCompletadas/").once("value").then(function(tareas) {
        var tasks = [];
        var keys = [];
        var counter = [];
        // Usuarios con Tareas Pendientes
        tareas.forEach(function(usuario) {
            //console.log('Usuario: ' + JSON.stringify(usuario.val()));
            usuario.forEach(function(tarea) {
                //console.log('Tarea: ' + JSON.stringify(tarea.val()));
                if(tarea.val().estado == 'pendiente')
                    tasks.push(tarea.val().usuario);
            });
        });
        //console.log('Usuarios con Tareas Pendientes: ' + tasks.toString());

        // Laboratorios que tiene a cargo cada Usuario con Tareas Pendientes
        // Laboratorios
        var labs = [];
        // Contador para promesa
        var contBusqueda = 0;
        // Promesa
        var promesa = new Promise(
            // La función resolvedora es llamada con la
            // habilidad de resolver o rechazar la promesa
            function(resolve, reject) {
                for(var i = 0; i < tasks.length; i++) {
                    db.ref("/informacion_laboratorios/").orderByChild('email_univalle')
                        .equalTo(tasks[i])
                        .limitToFirst(1)
                        .once("value").then(function(laboratorios) {
                            laboratorios.forEach(function(element) {
                                if(element.val().nombre_de_laboratorio != '' && element.val().nombre_de_laboratorio != undefined)
                                    labs.push(element.val().nombre_de_laboratorio);
                            });
                            // Contador de sedes resueltas
                            contBusqueda++;
                            if(contBusqueda == tasks.length) {
                                resolve(labs);
                            }
                        });
                }
            }
        );
        // Cuando la promesa se resuelve
        promesa.then(function(laboratorios) {
            //console.log('Laboratorios: ' + laboratorios);
            for (var i = 0; i < laboratorios.length; i++) {
                if (!counter[laboratorios[i]]) {
                    counter[laboratorios[i]] = 0;
                }
                counter[laboratorios[i]]++;
            }
            keys = Object.getOwnPropertyNames(counter).sort();
            $(keys).each(function (index, value) {
                if(value != 'N/A' && value != undefined && value != 'length' && value != '')
                    $('#selectlabtareaspendientes').append(`<option value='${value}'>${value}</option>`);
            });
            $('#selectlabtareaspendientes').multiSelect({
                selectableHeader: '<button id="btn-all-tareaspendientes" type="button" class="custom-header btn btn-block btn-primary btn-xs">TODOS</button>',
                selectionHeader: '<button id="btn-none-tareaspendientes" type="button" class="custom-header btn btn-block btn-primary btn-xs">NINGUNO</button>',
                selectableFooter: '<div class="input-group"><input type="text" id="selectable-tareaspendientes-search" class="search-input form-control" autocomplete="off" placeholder="Buscar \'CEDESOFT\'"><span class="input-group-addon"><i class="fa fa-search"></i></span></div>',
                selectionFooter: '<div class="input-group"><input type="text" id="selection-tareaspendientes-search" class="search-input form-control" autocomplete="off" placeholder="Buscar \'AVISPA\'"><span class="input-group-addon"><i class="fa fa-search"></i></span></div>',
                afterInit: function(ms){
                    var selectableSearchString = '#'+this.$container.attr('id')+' .ms-elem-selectable:not(.ms-selected)';
                    this.qs1 = $('#selectable-tareaspendientes-search').quicksearch(selectableSearchString).on('keydown', function(e){
                        if (e.which === 40){
                            this.$selectableUl.focus();
                            return false;
                        }
                    });
                    var selectionSearchString = '#'+this.$container.attr('id')+' .ms-elem-selection.ms-selected';
                    this.qs2 = $('#selection-tareaspendientes-search').quicksearch(selectionSearchString).on('keydown', function(e){
                        if (e.which == 40){
                            this.$selectionUl.focus();
                            return false;
                        }
                    });
                },
                afterSelect: function(){
                    this.qs1.cache();
                    this.qs2.cache();
                },
                afterDeselect: function(){
                    this.qs1.cache();
                    this.qs2.cache();
                }
            });
            $('#btn-all-tareaspendientes').on('click', function(event){
                $('#selectlabtareaspendientes').multiSelect('select_all');
            });
            $('#btn-none-tareaspendientes').on('click', function(event){
                $('#selectlabtareaspendientes').multiSelect('deselect_all');
            });
        });
    });
    //*******************************************FIN***************************************





    $('#menu-construir-correo').on('click', function (event) {
        event.preventDefault();

        tinymce.remove();
        $('#container').html('');
        $('#container').html('<h2>Construción de Correo</h2>' +
                                '<form method="post">' +
                                    '<textarea id="emailtextarea">' +
                                    '</textarea>' +
                                '</form>');
        tinymce.init({
            selector: '#emailtextarea',
            language: 'es',
            height: 400,
            plugins : 'image link textcolor lists preview print save template insertdatetime',
            statusbar: false,
            menubar: false,
            toolbar: [
                'save | template | preview | print | undo redo | cut copy paste | styleselect | fontselect | fontsizeselect',
                'removeformat | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | forecolor backcolor | image | link | insertdatetime',
            ],
            templates: [
                {title: 'Plantilla 1', description: 'Plantilla General', url: '../dist/js/correos/templates/general.html'}
            ],
            save_onsavecallback: function (event) {
                event.preventDefault();
                //console.log('Saved');
                //console.log($( "#emailtextarea" ).val());
                $("#myModalCorreos").modal();
            },
            insertdatetime_formats: ["%A, %B %d de %Y", "%a, %b %d de %Y", "%B %d de %Y", "%b %d de %Y", "%d/%m/%Y", "%r", "%H:%M:%S %p"]
        });
    });



    $("#filtros-destino input").on( "click", function() {
        //console.log($( "input:checked" ).val() + " is checked!");
        if($("input:checked").val() == 'opcionSedes') {
            $('#filtroSede').show();
            $('#filtroEscuela').hide();
            $('#filtroLabInoperante').hide();
            $('#filtroLabTareasPendientes').hide();
        } else if($("input:checked").val() == 'opcionEscuelas') {
            $('#filtroSede').hide();
            $('#filtroLabInoperante').hide();
            $('#filtroLabTareasPendientes').hide();
            $('#filtroEscuela').show();
        } else if($("input:checked").val() == 'opcionLabsInoperantes') {
            $('#filtroLabInoperante').show();
            $('#filtroEscuela').hide();
            $('#filtroSede').hide();
            $('#filtroLabTareasPendientes').hide();
        } else if($("input:checked").val() == 'opcionLabsTareasPendientes') {
            $('#filtroLabTareasPendientes').show();
            $('#filtroLabInoperante').hide();
            $('#filtroEscuela').hide();
            $('#filtroSede').hide();
        }
    });



    $('#btn-enviar-email').on('click', function (event) {
        // Criterios de busqueda
        var filtro = 'sede';
        var busqueda = $('#selectsedes').val();
        if($("input:checked").val() == 'opcionEscuelas') {
            filtro = 'escuela_o_departamento';
            busqueda = $('#selectescuelas').val();
        } else if($("input:checked").val() == 'opcionLabsInoperantes') {
            filtro = 'nombre_de_laboratorio';
            busqueda = $('#selectlabinoperante').val();
        } else if($("input:checked").val() == 'opcionLabsTareasPendientes') {
            filtro = 'nombre_de_laboratorio';
            busqueda = $('#selectlabtareaspendientes').val();
        }
        //console.log('Busqueda: ' + busqueda);
        // Destinatarios
        var correos = [];
        // Contador para promesa
        var contBusqueda = 0;
        // Promesa
        var promesa = new Promise(
            // La función resolvedora es llamada con la
            // habilidad de resolver o rechazar la promesa
            function(resolve, reject) {
                for(var i = 0; i < busqueda.length; i++) {
                    db.ref("informacion_laboratorios").orderByChild(filtro).equalTo(busqueda[i]).once("value").then(function (respuesta) {
                        //console.log(sede.val());
                        respuesta.forEach(function(element) {
                            if(element.val().email_univalle != '' && element.val().email_univalle != undefined)
                                correos.push(element.val().email_univalle);
                        });
                        // Contador de sedes resueltas
                        contBusqueda++;
                        if(contBusqueda == busqueda.length) {
                            resolve(correos);
                        }
                    });
                }
            }
        );
        // Cuando la promesa se resuelve
        promesa.then(function(correos) {
            // Obtiene los atributos para enviar Correo
            console.log('Correos: ' + correos);
            // SOLO para Pruebas
            //var correosDestino = [/*'julien.wist@correounivalle.edu.co','jhon.barona@correounivalle.edu.co',*/ 'danielosorio@geoprocess.com.co', 'francisco.hurtado@geoprocess.com.co', 'monica.musse@geoprocess.com.co', 'miguelidrobo@geoprocess.com.co', 'sebastian.rios@geoprocess.com.co'];
            // PRODUCCION
            var correosDestino = correos;
            correosDestino = correosDestino.toString();
            var correoAsunto = $('#asunto-correo').val();
            var correoMensaje = $('#emailtextarea').val();
            //console.log('Destino: ' + correosDestino + ' Asunto: ' + correoAsunto + ' Mensaje: ' + correoMensaje);
            // Llamado al API de Emails usando AJAX
            $.ajax({
                method: "POST",
                //url: "https://us-central1-prueba-e74c0.cloudfunctions.net/testEmail",
                // SOLO para Pruebas
                //url: "https://us-central1-prueba-e74c0.cloudfunctions.net/enviarCorreo",
                url: "https://us-central1-develop-univalle.cloudfunctions.net/enviarCorreo",
                // PRODUCCION
                
                data: {para: correosDestino, asunto: correoAsunto, mensaje: correoMensaje}
            })
            .done(function(msg) {
                console.log("Correo Enviado: " + msg);
            })
            .fail(function(error) {
                console.log("Error Enviando Correo: " + error);
            });
        });
    });
    






});
