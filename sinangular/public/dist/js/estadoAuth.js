$(document).ready(function () {

firebase.auth().onAuthStateChanged(function(user) {
          
          if (user) {
            $('#spinner').html(`<div class="spinner">
                                  <div class="bounce1"></div>
                                  <div class="bounce2"></div>
                                  <div class="bounce3"></div>
                                </div>`);
            
            if (user.emailVerified) {
              // User is signed in.
              var email = user.email;
              var domain = email.split("@");
              if (domain[1] === 'correounivalle.edu.co') {
                var refUser = ref.ref("/usuarios/"+user.uid+"/url");
                
                refUser.on('value', function(dataSnapshot) {

                  if (dataSnapshot.val() != undefined ) {
                    window.location = dataSnapshot.val();
                  }else{
                    location.reload();
                  }

                });


              } else {

                $(".spinner").remove();

                swal("Error!",
                "Debes ingresar con un correo institucional (@correounivalle.edu.co)",
                "error");
                
              }
               

             
            }else {
              $(".spinner").remove();
              swal("Error!",
              "Debes verificar tu cuenta, ve a la bandeja de tu correo",
              "error");

              }
          } 

	  });
});