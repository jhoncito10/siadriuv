'use strict';

const functions = require('firebase-functions');
const moment = require('moment');
const cors = require('cors')({ origin: true });
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const CUT_OFF_TIME = 6 * 30 * 24 * 60 * 60 * 1000; // 6 months in milliseconds.
const INTERVAL_TIME = 24 * 24 * 60 * 60 * 1000; // 30 days in milliseconds.

admin.initializeApp(functions.config().firebase);





const ref = admin.database().ref();

exports.CreateUser = functions.auth.user().onCreate(event => {

    const uid = event.data.uid;
    const displayName = event.data.displayName || "";
    //  console.log(event);
    const email = event.data.email;
    const newUser = ref.child(`/usuarios/${uid}`);
    newUser.set({
        direccion: "",
        displayname: displayName,
        email: email,
        roles: "NIVEL2",
        empresa: "",
        telefono: "",
        estado: ""
    });

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
            if (error) {
                res.status(500).send("Error al enviar Email desde Firebase Functions [ERROR::Nodemailer]");
            } else {
                res.status(200).send("Exito al enviar Email desde Firebase Functions.");
            }
        });

    });
});


var verificaFechas = (req, res) => {
    const convenios = ref.child(`/convenios_inicio/`);
    // const ref = event.data.ref.parent; // reference to the items
    const now = Date.now();

    const oldItemsQuery = convenios.orderByChild('fecha_de_vencimiento');
    convenios.once('value').then(snapshot => {
        // create a map with all children that need to be removed

        snapshot.forEach(child => {

            let fechaFormat = moment(child.val().fecha_de_vencimiento, 'M/D/YYYY', true).format('x');
            let cutoff = fechaFormat - now;
            let prueba = moment('11/19/2010', 'M/D/YYYY', false).format('x');
            let cutoffPrueba = prueba - now;
            if (cutoff <= CUT_OFF_TIME) {
                let refUsuarios = ref.child(`/usuarios/`);
                refUsuarios
                    .orderByChild('roles')
                    .equalTo('NIVEL3')
                    .once('value').then(usuariossnapshot => {
                        let notificacion = {
                            "estado" : "sin leer",
                            "icon" : "fa fa-users text-aqua",
                            "info" : "se concreto el convenio con paris"
                          };
                        let pushref =  refUsuarios.child(`/usuarios/${usuariossnapshot.key}`);
                        pushref.set(notificacion);
                          // We've appended a new message to the message_list location.
                        let path = newMessageRef.toString();
                        console.log(path);
                          

                    });
                console.log(child.key);
            }

            //updates[child.key] = null;
        });
        // execute all updates in one go and return the result to end the function
        // return ref.update(updates);
    });
};

setInterval(verificaFechas, 10000);