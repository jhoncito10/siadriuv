
      // inicia el pedido
      $("#btn-enviar-pedido").click(function (event) {//click en boton enviar pedido

        event.preventDefault();
        $("#btn-enviar-pedido").attr("disabled", "disabled");
        $("#btn-enviar-pedido").text("Procesando...");
        // actualiza los datos de usuario
        return refusuario.update({
          empresa: $("#empresa_u").val(),
          telefono: $("#telefono_u").val(),
          direccion: $("#direccion_u").val(),
          displayname: $("#nombre_u").val()

        }, function (error) {
          if (error) {

            //error al actualizar los datos de usuario
            $("#btn-enviar-pedido").removeAttr("disabled");
            $("#btn-enviar-pedido").text("Solicitar");

            alert("Error al gaurdas los datos, verifique los campos e intentelo de nuevo.");
          } else {

          }
        }).then(function (error) {// actualizacion exito sa de datos de usuario
          console.log($("#Observaciones_e").val());
          //variables
          var newPostKey,
            costo = parseInt($("#costo_prueba_e").val());//convierte a entero el valor de costo
          if (isNaN(costo)) {
            costo = 0;// asigna a 0 el valor de costo si la variable costo no es un numero
          }

          var datosPedido = {//genera un nuevo nodo de pedido en el nodo pedidios y asigna la key a la variable newPostKey 
            //datos de usuario para la solicitud
            email_solicitante: $("#email_u").val(),
            empresa: $("#empresa_u").val(),
            telefono: $("#telefono_u").val(),
            direccion: $("#direccion_u").val(),
            displayname: $("#nombre_u").val(),
            //datos de la empresa para el pedido en especifico
            nit_empresa: $("#nit_empresa_e").val(),
            telefono_fijo: $("#nit_empresa_e").val(),
            tipo_empresa: $("#catidad_pruebas_e").val(),//publica, privada, mixta, educativa, industria
            catidad_pruebas: $("#catidad_pruebas_e").val(),
            observaciones: $("#Observaciones_e").val(),

            // datos de prueba para la vinculacion
            prueba_ensayo: $("#prueba_ensayo_e").val(),
            cod_ensayo: $("#cod_ensayo_e").val(),
            cod_lab: $("#cod_lab_e").val(),
            costo_prueba: costo,
            descripcion: $("#descripcion_e").val(),
            nombre_laboratorio: $("#nombre_laboratorio_e").val(),
            normas_prueba: $("#normas_prueba_e").val(),
            palabras_clave: $("#palabras_clave_e").val(),
            servicios_fuerauv: $("#servicios_fuerauv_e").val()
          }
          newPostKey = firebase.database().ref("pedidos").push(datosPedido).then(function (done) {
            var objEmail = {};
            objEmail.email = $("#email_u").val();
            objEmail.asunto = "Solicitud: "+$("#prueba_ensayo_e").val();
            console.log(objEmail);

            $.ajax({
                method: "POST",
                //url: "https://us-central1-prueba-e74c0.cloudfunctions.net/testEmail",
                //url: "https://us-central1-prueba-e74c0.cloudfunctions.net/enviarCorreo",
                url: "https://us-central1-develop-univalle.cloudfunctions.net/enviarCorreo",
                data: {
                  para: objEmail.email,
                  asunto: objEmail.asunto,
                  mensaje: 'Hola, <br>  El usuario "'+datosPedido.displayname+'" ha solicitado el servicio con el nombre de : "'+datosPedido.prueba_ensayo+'" con el codigo de servicio : "'+datosPedido.cod_ensayo+'". <br> ' +
                            'Estos son los datos de contacto : <br> '+
                            'Email: '+datosPedido.email_solicitante+' <br> '+ 
                            'Empresa: '+datosPedido.empresa+' <br> '+ 
                            'Telefono: '+datosPedido.telefono+' <br> '+ 
                            'Direccion: '+datosPedido.direccion+ '<br> '+ 
                            'Nombre del solicitante: '+datosPedido.displayname+'<br> '+ 
                            'Estos son los datos de la empresa solicitante :<br> '+
                            'NIT: '+datosPedido.nit_empresa+'<br> '+
                            'Telefono: '+datosPedido.telefono_fijo+'<br> '+
                            'Tipo de empresa: '+datosPedido.tipo_empresa+'<br> '+
                            'Cantidad: '+datosPedido.catidad_pruebas+'<br> '+
                            'Observaciones: '+datosPedido.observaciones+'<br> '+
                            'Informacion de la prueba :<br> '+
                            'Nombre de la prueba: '+datosPedido.prueba_ensayo+'<br> '+
                            'Codigo de la prueba: '+datosPedido.cod_ensayo+'<br> '+
                            'Costo unitario: '+datosPedido.costo_prueba+'<br> '+
                            'Descripcion: '+datosPedido.descripcion+'<br> '+
                            'Laboratorio que realiza la prueba: '+datosPedido.nombre_laboratorio+'<br> '+
                            'Normas de la prueba: '+datosPedido.normas_prueba+'<br>'
                            
                          }
            })
            .done(function(msg) {
                console.log("Correo Enviado: " + msg);
            })
            .fail(function(error) {
                console.log("Error Enviando Correo: " + error);
            });


            
 
            $("#btn-enviar-pedido").removeAttr("disabled");
            $("#btn-enviar-pedido").text("Solicitar");
            swal({
              title: "Completado",
              text: 'Datos guardados correctamente.',
              html: true,
              type: "success",
            });

          }, function (error_prueba) {
            console.log(error_prueba);
            alert("00");
            swal({
              title: "Error en conexion",
              text: 'Error al gaurdas los datos, verifique los campos e intentelo de nuevo.',
              html: true,
              type: "error",
            });

          }).key;

        });

      });// fin de boton enviar pedido