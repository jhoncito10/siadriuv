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

            const fechaActual = moment();

            ref.child('convenios')
                .orderByChild('Vencimiento')
                .equalTo(true)
                .once('value').then(conv => {
                    conv.forEach(doc => {
                        const aux2 = doc.val()['Fecha de vencimiento'];
       
                        const comparacion = moment(aux2, 'DD/M/YYYY');

                        const diferencia = comparacion.diff(fechaActual, 'days');


                        if (diferencia == 90 || diferencia == 30 || diferencia == 15 || diferencia == -1) {

                            const refUsuarios = ref.child('usuarios');
                            let mensaje = "";
                            let horaactual = moment().utcOffset("-05:00").format("DD/MM/YYYY HH:mm:ss") + "";
                            let notificacion = {};
                            if (diferencia == -1) {
                                mensaje = `El convenio ID: "${doc.key}", con la institucion "${doc.val()['Institucion']}" vencio, en la fecha ${fechaActual.format('DD-MM-YYYY')}`;
                                notificacion = {
                                    "estado": "sin leer",
                                    "icon": "fa fa-users text-aqua",
                                    "info": mensaje,
                                    "fecha_creacion:": horaactual,
                                    "fecha_modificacion:": horaactual
                                };

                                let conven = ref.child(`convenios/${doc.key}`);

                                conven.update({'Estado': 'Vencido', 'Vencidos': 'Si'});

                            } else {
                                mensaje = `El convenio ID: "${doc.key}", con la institucion "${doc.val()['Institucion']}" vencera en ${diferencia} dias, en la fecha ${comparacion.format('DD-MM-YYYY')}`;
                                notificacion = {
                                    "estado": "sin leer",
                                    "icon": "fa fa-users text-aqua",
                                    "info": mensaje,
                                    "fecha_creacion:": horaactual,
                                    "fecha_modificacion:": horaactual
                                };
                            }


                            for (let i = 0; i < usuarios.keys.length; i++) {
                                const usuariokey = usuarios.keys[i];
                                console.log('array: ', usuariokey, doc.key);
                                let newNotification = refUsuarios.child(`${usuariokey}/notificacion/${doc.key}`);

                                newNotification.set(notificacion);
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
                        }

                        console.log(comparacion, fechaActual, diferencia);

                    });
                });


        });

};
console.log(moment().utcOffset("-05:00"));
// setInterval(verificaFechas, INTERVAL_TIME);

exports.validarConvenios = functions.https.onRequest((req, res) => {
    console.log('ENTRANDO');
    cors(req, res, () => {
        console.log('EJECUTANDO');

        verificaFechas().then(() => {
            res.send('email enviado');
        }).catch(error => {
            res.send(error);
        });
    
    });

});

var verificaFechasPostulaciones = (req, res) => {

    const usuarios = {
        keys: [],
        emails: []
    };
    return ref.child('usuarios')
        .orderByChild('roles')
        .equalTo('NIVEL6')
        .once('value').then(snap => {
            snap.forEach(childSnap => {
                const email = childSnap.val().email;
                const key = childSnap.key;
                usuarios.emails.push(email);
                usuarios.keys.push(key);
            });
            return usuarios;
        }).then(usuarios => {

            const fechaActual = moment();

            ref.child('postulaciones')
                .orderByChild('estado')
                .equalTo('Aprobado por DRI UV')
                .once('value').then(conv => {
                    conv.forEach(doc => {
                        const aux2 = doc.val()['fechaActualizado'].split(' ')[0];
       
                        const comparacion = moment(aux2, 'DD/M/YYYY');

                        const diferencia = fechaActual.diff(comparacion, 'days');

                        moment()
                        if (diferencia == 30 || diferencia == 15 || diferencia == 60) {

                            const refUsuarios = ref.child('usuarios');
                            let mensaje = "";
                            let horaactual = moment().utcOffset("-05:00").format("DD/MM/YYYY HH:mm:ss") + "";
                            let notificacion = {};
                            if (diferencia == 60) {
                                mensaje = `La postulacion con ID: "${doc.key}", y codigo de convenio: "${doc.val()['CODIGO_CONVENIO']}", realizada por "${doc.val()['Correo electónico']}" vencio y sera cancelada, en la fecha ${fechaActual.format('DD-MM-YYYY')}`;
                                notificacion = {
                                    "estado": "sin leer",
                                    "icon": "fa fa-users text-aqua",
                                    "info": mensaje,
                                    "fecha_creacion:": horaactual,
                                    "fecha_modificacion:": horaactual
                                };

                                let conven = ref.child(`postulaciones/${doc.key}`);

                                conven.update({'estado': 'Cancelada'});

                            } else {
                                mensaje = `La postulacion con ID: "${doc.key}", y codigo de convenio: "${doc.val()['CODIGO_CONVENIO']}", realizada por "${doc.val()['Correo electónico']}" vencera en ${diferencia} dias, en la fecha ${comparacion.format('DD-MM-YYYY')}`;
                             
                                notificacion = {
                                    "estado": "sin leer",
                                    "icon": "fa fa-users text-aqua",
                                    "info": mensaje,
                                    "fecha_creacion:": horaactual,
                                    "fecha_modificacion:": horaactual
                                };
                            }


                            for (let i = 0; i < usuarios.keys.length; i++) {
                                const usuariokey = usuarios.keys[i];
                                console.log('array: ', usuariokey, doc.key);
                                let newNotification = refUsuarios.child(`${usuariokey}/notificacion/${doc.key}`);

                                newNotification.set(notificacion);
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
                        }

                        console.log(comparacion, fechaActual, diferencia);

                    });
                });


        });

};
console.log(moment().utcOffset("-05:00"));
// setInterval(verificaFechas, INTERVAL_TIME);

exports.validarPostulaciones = functions.https.onRequest((req, res) => {
    console.log('ENTRANDO');
    cors(req, res, () => {
        console.log('EJECUTANDO');

        verificaFechasPostulaciones().then(() => {
            res.send('email enviado');
        }).catch(error => {
            res.send(error);
        });
    
    });

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