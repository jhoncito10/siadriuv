$(document).ready(function () {

firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            
            if (user.emailVerified) {
              // User is signed in.
              console.log(user);
               var refUser = ref.ref("/usuarios/"+user.uid+"/url");

                    refUser.on('value', function(dataSnapshot) {
                      console.log(dataSnapshot.val(),dataSnapshot.key);
                        if (dataSnapshot.val() !== undefined ) {
                          window.location = dataSnapshot.val();
                        }else{
                          //location.reload();
                        }
                        
                          });

             
            }else {
              msgChange($('#div-login-msg'),
              $('#icon-login-msg'), 
              $('#text-login-msg'), 
              "error", "glyphicon-remove", "Email sin verificar");

              }
          } 

	  });
});