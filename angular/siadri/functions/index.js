'use strict';

const functions = require('firebase-functions');
const moment = require('moment');
const cors = require('cors')({ origin: true });
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const CUT_OFF_TIME = 6 * 30 * 24 * 60 * 60 * 1000; // 6 months in milliseconds.
//const INTERVAL_TIME = 24 * 24 * 60 * 60 * 1000; // 24 days in milliseconds.
const INTERVAL_TIME = 1000 * 60 * 60 * 6 ; // 1 hour in milliseconds.
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


let sendMail = (req, res) => {
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
        bcc: `${req.para}`,
        subject: req.asunto,
        html: req.mensaje
    };
    transporter.sendMail(mailsolicitante, function (error, success) {
        if (error) {
            console.log("error");
            if (res) {
                    res.status(500).send("Error al enviar Email desde Firebase Functions [ERROR::Nodemailer]");

            } else {
                console.log("error, al enviar correo");
            }
        } else {
            if (res) {
                res.status(200).send("Exito al enviar Email desde Firebase Functions.");

            } else {
                console.log("exito al enviar correo");
            }
        }
    });
    // send mail with defined transport object
    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //         return console.log(error);
    //     }
    //     console.log('Message sent: %s', info.messageId);
    //     // Preview only available when sending through an Ethereal account
    //     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    //     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
    //     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    // });
}


exports.enviarCorreo = functions.https.onRequest((req, res) => {
    //res.send('Inicia enviarCorreo');
    //res.status(200).send('Para: ' + req.body.para + ' Asunto: ' + req.body.asunto + ' Mensaje: ' + req.body.mensaje);
    // Enable CORS using the `cors` express middleware.
    cors(req, res, () => {
        //res.status(200).send('Para: ' + req.body.para + ' Asunto: ' + req.body.asunto + ' Mensaje: ' + req.body.mensaje);
        // FUNCIONA OK
        // Nodemailer req.body
        console.log(req.body);
        sendMail(req.body, res);

    });
});


var verificaFechas = (req, res) => {
    const convenios = ref.child(`/convenios_inicio/`);
    // const ref = event.data.ref.parent; // reference to the items
    const now = Date.now();
    console.log(moment().subtract(5, 'hours'));
    const oldItemsQuery = convenios.orderByChild('fecha_de_vencimiento');
    convenios.once('value').then(snapshot => {
        // create a map with all children that need to be removed

        snapshot.forEach(child => {

            let fechaFormat = moment(child.val().fecha_de_vencimiento, 'M/D/YYYY', true).format('x');
            let cutoff = fechaFormat - now;
            let prueba = moment('11/19/2010', 'M/D/YYYY', false).format('x');
            if (cutoff <= CUT_OFF_TIME) {
                let refUsuarios = ref.child(`/usuarios/`);
                let path = refUsuarios.toString();
                refUsuarios
                    .orderByChild('roles')
                    .equalTo('NIVEL3')
                    .once('value').then(usuarios => {

                        usuarios.forEach(usuario => {
                            let horaactual = moment().utcOffset("-05:00").format("DD/MM/YYYY hh:mm:ss")+"";
                            let notificacion = {};
                            if (cutoff < 0) {
                                notificacion = {
                                    "estado": "sin leer",
                                    "icon": "fa fa-users text-aqua",
                                    "info": `El convenio con la institucion "${child.val().institucion}" vencio, en la fecha ${child.val().fecha_de_vencimiento}`,
                                    "fecha_creacion:":horaactual,
                                    "fecha_modificacion:":horaactual
                                };

                            } else {
                                notificacion = {
                                    "estado": "sin leer",
                                    "icon": "fa fa-users text-aqua",
                                    "info": `El convenio con la institucion "${child.val().institucion}" vencera en menos de 6 meses, en la fecha ${child.val().fecha_de_vencimiento}`,
                                    "fecha_creacion:":horaactual,
                                    "fecha_modificacion:":horaactual
                                };
                            }
                            let newNotification = refUsuarios.child(`/${usuario.key}/notificacion/${child.key}/`);

                            newNotification.set(notificacion).then(res => {
                                let mailData = {
                                    para: `${usuario.val().email}`,
                                    asunto: 'Notificacion convenio',
                                    mensaje: `${notificacion.info}
                                              `
                                }
                                sendMail(mailData);
                            });
                            // We've appended a new message to the message_list location.
                        });
                    });
            }

        });
        // execute all updates in one go and return the result to end the function
        // return ref.update(updates);
    });
};

setInterval(verificaFechas, INTERVAL_TIME);