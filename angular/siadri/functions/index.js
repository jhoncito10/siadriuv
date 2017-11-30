'use strict';

const functions = require('firebase-functions');
const moment = require('moment');
const cors = require('cors')({origin: true});
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);





const ref = admin.database().ref();


    exports.createUserAccount = functions.auth.user().onCreate(event => {
        const uid = event.data.uid;
        const email = event.data.email;
        const dominio = email.split("@");
        const displayName = event.data.displayName || "Nombre Usuario";
        if (dominio[1]=== 'correounivalle.edu.co') {
            const newUserRef = ref.child(`/usuarios/${uid}`);
            newUserRef.set({
                direccion: "",
                displayname: displayName,
                email:email,
                empresa:"",                            
                telefono:"",
                url:"nivel2/index.html"
                });
            }
        });

        exports.enviarCorreo = functions.https.onRequest((req, res) => {
            //res.send('Inicia enviarCorreo');
            //res.status(200).send('Para: ' + req.body.para + ' Asunto: ' + req.body.asunto + ' Mensaje: ' + req.body.mensaje);
            // Enable CORS using the `cors` express middleware.
            cors(req, res, () => {
                //res.status(200).send('Para: ' + req.body.para + ' Asunto: ' + req.body.asunto + ' Mensaje: ' + req.body.mensaje);
                // FUNCIONA OK
                // Nodemailer
                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        type: 'OAuth2',
                        user: 'sistema.siadri@correounivalle.edu.co',
                        clientId: '275977166524-j6d3duj2sjad0relljnnhe602so63oe3.apps.googleusercontent.com',
                        clientSecret: 'OLcqQJkutDFJp0QYDjp8hnoi',
                        refreshToken: '1/ByCgMX5es351WxKldwgoPr_dU4N9cYe4Rq1Cqq2Nswk'
                    }
                });
                var mailsolicitante = {
                    from: 'SIADRI <sistema.siadri@correounivalle.edu.co>',
                    bcc: req.body.para,
                    subject: req.body.asunto,
                    html: req.body.mensaje
                };
                transporter.sendMail(mailsolicitante, function (error, success) {
                    if(error) {
                        res.status(500).send("Error al enviar Email desde Firebase Functions [ERROR::Nodemailer]");
                    } else {
                        res.status(200).send("Exito al enviar Email desde Firebase Functions.");
                    }
                });
        
            });
        });
        
        
        