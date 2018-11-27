'use strict';

const functions = require('firebase-functions');
const moment = require('moment');
const cors = require('cors')({ origin: true });
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const CUT_OFF_TIME = 6 * 30 * 24 * 60 * 60 * 1000; // 6 months in milliseconds.
//const INTERVAL_TIME = 24 * 24 * 60 * 60 * 1000; // 24 days in milliseconds.
const INTERVAL_TIME = 1000 * 60 * 60; // 1 hour in milliseconds.
admin.initializeApp(functions.config().firebase);

const mailTrasport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        type: 'OAuth2',
        user: 'sistema.siadri@correounivalle.edu.co',
        clientId: '275977166524-j6d3duj2sjad0relljnnhe602so63oe3.apps.googleusercontent.com',
        clientSecret: 'OLcqQJkutDFJp0QYDjp8hnoi',
        refreshToken: '1/ByCgMX5es351WxKldwgoPr_dU4N9cYe4Rq1Cqq2Nswk'
    }
});



const ref = admin.database().ref();

exports.CreateUser = functions.auth.user().onCreate(event => {

    console.log("FUNCIONO");
    crearUsuario(event);

});

function crearUsuario(event) {
    const uid = event.data.uid;
    const displayName = event.data.displayName || "";
    console.log(event);
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
    }).then(exito => {
        console.log('EL USUARIO SE CREO CON EXITO', exito);
    }).catch(error => {
        console.log('SE GENERO UN ERROR AL INTENTAR CREAR USUARIO');
        crearUsuario(event);
    });
}

exports.consFecha = functions.https.onRequest((req, res) => {
    cors(req, res, () => {

        if (res) {
            res.status(200).send(moment().format('YYYY-MM-DD'));
        }


    });

});


let sendMail = (req, res) => {

    var mailsolicitante = {
        from: 'SIADRI <sistema.siadri@correounivalle.edu.co>',
        bcc: `${req.para}`,
        subject: req.asunto,
        html: req.mensaje
    };
    return mailTrasport.sendMail(mailsolicitante).then(() => {
        if (res) {
            res.status(200).json({ status: 200, mensaje: 'correo enviado correctamente' });

        } else {
            console.log("exito al enviar correo");
        }
    }).catch(error => {

        console.log(`${error}`);

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
        sendMail(req.body, res);

    });
});


var verificaFechas = (req, res) => {

    const usuarios = {
        keys: [],
        emails: []
    };
    return ref.child('usuarios')
        .orderByChild('roles')
        .equalTo('NIVEL3')
        .once('value').then(snap => {
            snap.forEach(childSnap => {
                const email = childSnap.val().email;
                const key = childSnap.key;
                usuarios.emails.push(email);
                usuarios.keys.push(key);
            });
            return usuarios;
        }).then(usuarios => {
            console.log('emails ' + usuarios.emails.join());


            const convenios = ref.child(`/convenios_inicio/`);
            const refUsuarios = ref.child(`/usuarios/`);
            const now = Date.now();
            console.log(moment().utcOffset("-05:00"));
            const oldItemsQuery = convenios.orderByChild('fecha_de_vencimiento');
            convenios.once('value').then(snapshot => {
                // create a map with all children that need to be removed

                snapshot.forEach(child => {

                    let fechaFormat = moment(child.val().fecha_de_vencimiento, 'M/D/YYYY', true).format('x');
                    let cutoff = fechaFormat - now;
                    if (cutoff <= CUT_OFF_TIME) {
                        let mensaje = "";
                        let horaactual = moment().utcOffset("-05:00").format("DD/MM/YYYY HH:mm:ss") + "";
                        let notificacion = {};
                        if (cutoff < 0) {
                            mensaje = `El convenio con la institucion "${child.val().institucion}" vencio, en la fecha ${child.val().fecha_de_vencimiento}`;
                            notificacion = {
                                "estado": "sin leer",
                                "icon": "fa fa-users text-aqua",
                                "info": mensaje,
                                "fecha_creacion:": horaactual,
                                "fecha_modificacion:": horaactual
                            };

                        } else {
                            mensaje = `El convenio con la institucion "${child.val().institucion}" vencera en menos de 6 meses, en la fecha ${child.val().fecha_de_vencimiento}`;
                            notificacion = {
                                "estado": "sin leer",
                                "icon": "fa fa-users text-aqua",
                                "info": mensaje,
                                "fecha_creacion:": horaactual,
                                "fecha_modificacion:": horaactual
                            };
                        }
                        for (const key in usuarios.keys) {
                            if (usuarios.keys.hasOwnProperty(key)) {
                                const usuariokey = usuarios.keys[key];



                                let newNotification = refUsuarios.child(`/${usuariokey}/notificacion/${child.key}/`);

                                newNotification.set(notificacion);

                            }
                        }
                        let mailData = {
                            from: '"SIADRI" <sistema.siadri@correounivalle.edu.co>',
                            bcc: usuarios.emails.join(),
                            subject: 'convenio apunto de vencer',
                            html: mensaje

                        };


                        // sendMail(mailData);
                        mailTrasport.sendMail(mailData).then(() => {
                            console.log('email enviado');
                        }).catch(error => {
                            console.log(error);
                        });


                        // We've appended a new message to the message_list location.
                    }

                });
                // execute all updates in one go and return the result to end the function
                // return ref.update(updates);
            });
        });

};
console.log(moment().utcOffset("-05:00"));
// setInterval(verificaFechas, INTERVAL_TIME);




exports.weeklyEmail = functions.https.onRequest((req, res) => {

    verificaFechas().then(() => {
        res.send('email enviado');
    }).catch(error => {
        res.send(error);
    });







    // const currentTime = new Date().getTime();
    // const lastWeek = currentTime - 604800000;
    // const emails = [];
    // ref.child('usuarios')
    // .orderByChild('roles')
    // .equalTo('NIVEL3')
    // .once('value').then(snap=>{
    //     snap.forEach(childSnap=>{
    //         const email = childSnap.val().email;
    //         emails.push(email);
    //     });
    //     return emails;
    // }).then(emails=>{
    //     console.log('emails '+emails.join() );
    //     const mailOptions = {
    //         from:'"SIADRI" <sistema.siadri@correounivalle.edu.co>',
    //         bcc:emails.join(),
    //         subject:'convenio apunto de vencer',
    //         text:'el convenio xxx esta por vencer'
    //     };
    //     return mailTrasport.sendMail(mailOptions).then(()=>{
    //         res.send('email enviado');
    //     }).catch(error=>{
    //         res.send(error);
    //     });
    // });
});

exports.createNotification = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        console.log(req.body)
        if (req.body.hasOwnProperty('email')) {
            return ref.child('usuarios')
                .orderByChild('email')
                .equalTo(req.body.email)
                .once('value').then(usuariosSnap => {
                    usuariosSnap.forEach(function (userSnap) {
                        console.log(userSnap)
                        var fecha = moment().format('DD/MM/YYYY HH:mm')
                        // key will be "ada" the first time and "alan" the second time
                        var key = userSnap.key;
                        // childData will be the actual contents of the child
                        var childData = userSnap.val();
                        var notificationRef = ref.child(`usuarios/${key}/notificacion/`).push()
                        return notificationRef.set(
                            {
                                "estado": "sin leer",
                                "fecha_creacion:": fecha,
                                "fecha_modificacion:": fecha,
                                "icon": "fa fa-users text-aqua",
                                "info": `${req.body.info}`
                            }
                        ).then(() => {
                            return res.status(200).json({ status: 200, mensaje: 'Notificacion creada correctamente' });

                        }).catch(error => {
                            return res.status(204).json({ status: 204, mensaje: 'error creando la notifiacion' });

                        })
                    });
                    // return ref.child(`usuarios/${}`)
                })
        } else {
            return res.status(204).json({ status: 204, mensaje: 'error creando la notifiacion' });
        }

    });

});

exports.createNotificationPrograma = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        console.log(req.body)
        if (req.body.hasOwnProperty('programa')) {
            return ref.child('programasAcademicos')
                .orderByChild('NOMBRE PROGRAMA ACADEMICO')
                .equalTo(req.body.programa)
                .once('value')
                .then(programasSnap => {
                    programasSnap.forEach(function (programaSnap) {
                        return ref.child('usuarios')
                            .orderByChild('email')
                            .equalTo(programaSnap.val()['correo'])
                            .once('value').then(usuariosSnap => {
                                usuariosSnap.forEach(function (userSnap) {
                                    console.log(userSnap)
                                    var fecha = moment().format('DD/MM/YYYY HH:mm')
                                    // key will be "ada" the first time and "alan" the second time
                                    var key = userSnap.key;
                                    // childData will be the actual contents of the child
                                    var childData = userSnap.val();
                                    var notificationRef = ref.child(`usuarios/${key}/notificacion/`).push()
                                    return notificationRef.set(
                                        {
                                            "estado": "sin leer",
                                            "fecha_creacion:": fecha,
                                            "fecha_modificacion:": fecha,
                                            "icon": "fa fa-users text-aqua",
                                            "info": `${req.body.info}`
                                        }
                                    ).then(() => {
                                        return res.status(200).json({ status: 200, mensaje: 'Notificacion creada correctamente' });

                                    }).catch(error => {
                                        return res.status(204).json({ status: 204, mensaje: 'error creando la notifiacion' });

                                    })
                                });
                                // return ref.child(`usuarios/${}`)
                            })
                    });
                })
        } else {
            return res.status(204).json({ status: 204, mensaje: 'error creando la notifiacion' });
        }

    });

});

exports.createLetter = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        console.log(req.body)       
    });
});