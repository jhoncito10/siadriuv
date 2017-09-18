$(document).ready(function () {

  //verifica el estado de autenticacion


  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      if (user.emailVerified) {
      // si hay un usuario logeado
      $("#login-modal").modal("hide");

      $("#login-li-button").hide();

      $buttonCompra = true;
       refusuario = firebase.database().ref("/usuarios/" + user.uid);

      // descarga los datos del usuario y los asigna al formulario del pedido 
      refusuario
        .once('value')
        .then(function (usersnapshot) {
         


          $("#nombre_u").val(usersnapshot.val().displayname);
          $("#email_u").val(user.email);
          $("#uid_u").val(usersnapshot.key);
          $("#empresa_u").val(usersnapshot.val().empresa);
          $("#telefono_u").val(usersnapshot.val().telefono);
          $("#direccion_u").val(usersnapshot.val().direccion);

        });



    }
    }
     else {
      msgChange($('#div-login-msg'),
        $('#icon-login-msg'),
        $('#text-login-msg'),
        "error", "glyphicon-remove", "Email sin verificar");
      $("#login-li-button").show();
      $buttonCompra = false;

      // limpia formulario de pedido
      $("#nombre_u").val("");
      $("#email_u").val("");
      $("#uid_u").val("");
      $("#empresa_u").val("");
      $("#telefono_u").val("");
      $("#direccion_u").val("");

      $("#prueba_ensayo_e").val("");
      $("#cod_ensayo_e").val("");
      $("#cod_lab_e").val("");
      $("#costo_prueba_e").val("");
      $("#descripcion_e").val("");
      $("#nombre_laboratorio_e").val("");
      $("#normas_prueba_e").val("");
      $("#palabras_clave_e").val("");
      $("#servicios_fuerauv_e").val("");
    }
  });
});