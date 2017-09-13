"use strict";
$(document).ready(function () {

        window.estadoCordenaas = false;
        window.key = null;
        $('#menu-modificar-posicion-laboratorio').on('click', function () {// genera formularios para actualizar informacion general
        $('.modal-body').html('');
        $('.modal-body')
                        .append(       // spiner 
                        '<div class="overlay">'+
                            '<i class="fa fa-refresh fa-spin"></i>'+
                        '</div>' );
        $("img").remove(".leaflet-marker-icon");
        $(".leaflet-marker-shadow").remove();
        $(".leaflet-popup").remove();
        db.ref("informacion_laboratorios")
        .orderByChild('colaborador')
        .equalTo(email).once("value").then( function (laboratorios) {
            laboratorios.forEach(function(lab) {
                console.log(lab.val().cod_georef ,isNaN(lab.val().cod_georef));
               if (!isNaN(lab.val().cod_georef)) {// es un numero
                   console.log("entra");
                   db.ref("edificios")
                    .orderByChild("cod_georef")
                    .equalTo(parseInt(lab.val().cod_georef))
                    .once("child_added").then(function (edificio) {
                        $(".overlay").remove();
                        
                        $('.modal-body')
                        .append(
                            "<div class='" + edificio.key + "'><h4> Edificio " + lab.val().cod_escuela + "  " + lab.val().nombre_de_laboratorio + "</h4>" +
                            "<form class='form-horizontal'>" +

                                "<div class='form-group'>" +
                                "<label class='control-label col-sm-2' for='nlat'>Latitud:</label>" +
                                "<div class='col-sm-10'>" +
                                "<input type='number' step='0.000001' class='actualizar-datos form-control' id='nlat' value='" + edificio.val().Latitud + "' >" +
                                "</div>" +
                                "</div>" +

                                "<div class='form-group'>" +
                                "<label class='control-label col-sm-2' for='nlong'>Longitud:</label>" +
                                "<div class='col-sm-10'>" +
                                " <input type='number' step='0.000001' class='actualizar-datos form-control' id='nlong' value='" + edificio.val().Longitud + "' >" +
                                "</div>" +
                                "</div>" +

                                "<div class='form-group'>" +
                                "<div class='col-sm-offset-2 col-sm-10'>" +
                                "<button class='btn-seleccionar-edificio btn btn-default' key='" + edificio.key + "'>Seleccionar</button>"+
                                "</div>" +
                                "</div>" +

                                "<div class='form-group'>" +
                                "<div class='col-sm-offset-2 col-sm-10'>" +
                                "<button class='btn-actualizar-edificio btn btn-primary' id='" + edificio.key + "'>Actualizar</button>"+
                                "</div>" +
                                "</div>" +
                            "</form>"+
                            "</div>"


                        );
                    
                    });

               } else {
                   console.log("salida");
                    var edificiosRef = firebase.database().ref("edificios");
                        edificiosRef.orderByChild("cod_georef").limitToLast(1).once("value", function(snapshot) {
                        snapshot.forEach(function(data) {
                            console.log("The " + data.key + " score is ", data.val());
                        });
                    });
               }
                
            });



            //console.log(snapshot.val());
            $('.modal-title').text("Actualiza  ubicación de laboratorio");
                
                  


        });
        $('#myModal').modal();
    });




$('.modal-body').on('click',".btn-seleccionar-edificio", function (event) {
    event.preventDefault();
    console.log("entra");
    window.key = $(this).attr("key");
    window.estadoCordenaas = true;
    $('#myModal').modal('hide');
    swal("informacion!",
        "Haz click en el mapa donde desees que quede la georeferencia de tu laboratorio y luego confirmalo",
        "info");
});
    $('#map').on('click',".btn-confirmar-edificio", function (event) {
    event.preventDefault();
    
    console.log("entra");
    $("[class='" + window.key + "']").find('#nlat').val($(this).attr('lat'));
    $("[class='" + window.key + "']").find('#nlong').val($(this).attr('lng'));
    $('#myModal').modal();
    window.estadoCordenaas = false;
    window.key = null;
 
});

    $('.modal-body').on('click',".btn-actualizar-edificio", function (event) {
        event.preventDefault();
        var key = $(this).attr('id');

        var edificioRef = db.ref('/edificios/'+key);
        var longitud = parseFloat($("[class='" + key + "']").find('#nlat').val()),
            latitud = parseFloat($("[class='" + key + "']").find('#nlong').val());
        
        var updateCoordenadas = {Latitud : latitud,
                Longitud : longitud}
            console.log(updateCoordenadas);

            edificioRef.update(updateCoordenadas).then(function (params) {
                swal("Guardados!",
                                "Datos guardados correctamente",
                                "success");
            }).catch(function (error) {
                swal("Error!",
                                "Error al guardar los datos, intentelo mas tarde",
                                "error");
            });
        
       
    
    });



    var popup = L.popup();

    var onMapClick =	function (e) {
    
        if (window.estadoCordenaas) {
            popup
                .setLatLng(e.latlng)
                .setContent("Posicicon ( latitud, longitud ) " +e.latlng.lat+", "+e.latlng.lng+
                
                "<div class = 'row ' >"+
                "<br><button class = 'btn-confirmar-edificio btn btn-primary btn-block' lat = '"+e.latlng.lat+"' lng = '"+e.latlng.lng+"'>Confirmar</button>"+
                
                "</div>")
                .openOn(map);
            console.log(e.latlng);
        }
    }

    
    map.on('click', onMapClick);


 
});