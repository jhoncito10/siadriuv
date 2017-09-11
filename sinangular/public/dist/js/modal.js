/* #####################################################################
   #
   #   Project       : Modal Login with jQuery Effects
   #   Author        : Rodrigo Amarante (rodrigockamarante)
   #   Version       : 1.0
   #   Created       : 07/29/2015
   #   Last Change   : 08/04/2015
   #
   ##################################################################### */
$(document).ready(function () {


    var $formLogin = $('#login-form');
    var $formLost = $('#lost-form');
    var $formRegister = $('#register-form');
    var $divForms = $('#div-forms');
    var $modalAnimateTime = 300;
    var $msgAnimateTime = 150;
    var $msgShowTime = 2000;

    $("form").submit(function (event) {
        event.preventDefault();
        switch (this.id) {
            case "login-form":
                var $lg_username = $('#login_username').val();
                var $lg_password = $('#login_password').val();
                var val_univalle = $lg_username.split("@");
                if (val_univalle[1] === "correounivalle.edu.co") {
                    msgChange($('#div-login-msg'),
                     $('#icon-login-msg'),
                      $('#text-login-msg'),
                       "error", "glyphicon-remove", "Ingresa con el boton de correo univalle");

                } else {
                    firebase.auth().signInWithEmailAndPassword($lg_username, $lg_password).catch(function (error) {
                        console.log(error);
                        // Handle Errors here.
                        // Q {code: "auth/user-not-found", message: "There is no user record corresponding to this identifier. The user may have been deleted."}
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        if (errorCode == "auth/wrong-password") {
                            msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), "error", "glyphicon-remove", "Verifique su usuario y password");
                        }else if (errorCode == "auth/user-not-found") {
                            msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), "error", "glyphicon-remove", "Usuario no se encuentra registrado");

                        }
                         else {
                            msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), "success", "glyphicon-ok", "Login OK");
                        }
                        // ...
                    });


                }

                return false;
                break;
            case "lost-form":
                var $ls_email = $('#lost_email').val();

                firebase.auth().sendPasswordResetEmail($ls_email).then(function (done) {
                    msgChange($('#div-lost-msg'), $('#icon-lost-msg'), $('#text-lost-msg'), "success", "glyphicon-ok", "Link para actualizar password enviado");
                    // Email sent.
                }, function (error) {
                    console.log(error);
                    if (error.code === "auth/user-not-found") {
                        msgChange($('#div-lost-msg'), $('#icon-lost-msg'), $('#text-lost-msg'), "error", "glyphicon-remove", "El correo no se encuentra registrado");

                    }
                });



                return false;
                break;
            case "register-form":
                var $rg_email = $('#register_email').val();
                var $rg_password = $('#register_password').val();
                var $rg_passwordv = $('#register_passwordv').val();
                var val_univalle = $rg_email.split("@");
                if (val_univalle[1] === "correounivalle.edu.co") {
                    msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), "error", "glyphicon-remove", "Ingresa con el boton de correo univalle");

                } else {
                    if ($rg_password === $rg_passwordv) {
                        firebase.auth().createUserWithEmailAndPassword($rg_email, $rg_password).then(function (done) {
                            done.sendEmailVerification(); 
                                  //  });
                                msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), "success", "glyphicon-ok", "Registro OK");
                           
                        }).catch(function (error) {
                            // Handle Errors here.
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            // ...
                            if (errorCode == "auth/email-already-in-use") {
                                msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), "error", "glyphicon-remove", "El email ya se encuentra en uso");
                            } else {
                               // firebase.auth().onAuthStateChanged(function(user) {
                                    error.sendEmailVerification(); 
                                  //  });
                                msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), "success", "glyphicon-ok", "Registro OK, por favor reviza tu correo");
                            }
                        });

                    } else {

                        msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), "error", "glyphicon-remove", "Las contraseñas no concuerdan");

                    }
                }


                return false;
                break;
            default:
                return false;
        }
        return false;
    });

    $('#login_register_btn').click(function () { modalAnimate($formLogin, $formRegister) });
    $('#register_login_btn').click(function () { modalAnimate($formRegister, $formLogin); });
    $('#login_lost_btn').click(function () { modalAnimate($formLogin, $formLost); });
    $('#lost_login_btn').click(function () { modalAnimate($formLost, $formLogin); });
    $('#lost_register_btn').click(function () { modalAnimate($formLost, $formRegister); });
    $('#register_lost_btn').click(function () { modalAnimate($formRegister, $formLost); });

    function modalAnimate($oldForm, $newForm) {
        var $oldH = $oldForm.height();
        var $newH = $newForm.height();
        $divForms.css("height", $oldH);
        $oldForm.fadeToggle($modalAnimateTime, function () {
            $divForms.animate({ height: $newH }, $modalAnimateTime, function () {
                $newForm.fadeToggle($modalAnimateTime);
            });
        });
    }

    function msgFade($msgId, $msgText) {
        $msgId.fadeOut($msgAnimateTime, function () {
            $(this).text($msgText).fadeIn($msgAnimateTime);
        });
    }

    msgChange = function ($divTag, $iconTag, $textTag, $divClass, $iconClass, $msgText) {
        var $msgOld = $divTag.text();
        msgFade($textTag, $msgText);
        $divTag.addClass($divClass);
        $iconTag.removeClass("glyphicon-chevron-right");
        $iconTag.addClass($iconClass + " " + $divClass);
        setTimeout(function () {
            msgFade($textTag, $msgOld);
            $divTag.removeClass($divClass);
            $iconTag.addClass("glyphicon-chevron-right");
            $iconTag.removeClass($iconClass + " " + $divClass);
        }, $msgShowTime);
    }

    $('#btn-interno').click(function () {
        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;


            // ...
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    });


});