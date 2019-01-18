'use strict';
const functions = require('firebase-functions');
const moment = require('moment');
const cors = require('cors')({ origin: true });
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
global.window = { document: { createElementNS: () => { return {} } } };
global.navigator = {};
global.btoa = () => { };


const PDFDocument = require('pdfkit');



const CUT_OFF_TIME = 6 * 30 * 24 * 60 * 60 * 1000; // 6 months in milliseconds.
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


let sendMail = (para, asunto, mensaje, res) => {

    const mailsolicitante = {
        from: 'SIADRI <sistema.siadri@correounivalle.edu.co>',
        bcc: `${para}`,
        subject: asunto,
        html: mensaje
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

}


exports.enviarCorreo = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        sendMail(req.body.para, req.body.asunto, req.body.mensaje, res);
    });
});


var verificaFechas = (req, res) => {

    const usuarios = {
        keys: [],
        emails: []
    };
    const snap = ref.child('usuarios')
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

                                conven.update({ 'Estado': 'Vencido', 'Vencidos': 'Si' });

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

    const fechaActual = moment();

    return ref.child('postulaciones')
        .orderByChild('estado')
        .equalTo('Aprobada por DRI UV')
        .once('value').then(conv => {
            conv.forEach(doc => {
                const aux2 = doc.val()['fechaActualizado'].split(' ')[0];

                const comparacion = moment(aux2, 'DD/M/YYYY');

                const diferencia = fechaActual.diff(comparacion, 'days');

                const email = doc.val()['Correo electrónico'];

                console.log('Se encontro este objeto' + doc.key, diferencia);

                if (diferencia == 30 || diferencia == 15 || diferencia == 60) {

                    const refUsuarios = ref.child('usuarios');
                    let mensaje = "";
                    let horaactual = moment().utcOffset("-05:00").format("DD/MM/YYYY HH:mm:ss") + "";
                    let notificacion = {};
                    if (diferencia == 60) {
                        mensaje = `La postulacion con ID: "${doc.key}", y codigo de convenio: "${doc.val()['CODIGO_CONVENIO']}", realizada por "${email}" vencio y sera cancelada, en la fecha ${fechaActual.format('DD-MM-YYYY')}`;
                        notificacion = {
                            "estado": "sin leer",
                            "icon": "fa fa-users text-aqua",
                            "info": mensaje,
                            "fecha_creacion:": horaactual,
                            "fecha_modificacion:": horaactual
                        };

                        let conven = ref.child(`postulaciones/${doc.key}`);

                        conven.update({ 'estado': 'Cancelada' });

                    } else {
                        mensaje = `La postulacion con ID: "${doc.key}", y codigo de convenio: "${doc.val()['CODIGO_CONVENIO']}", realizada por "${email}" vencera en ${60 - diferencia} dias, en la fecha ${comparacion.format('DD-MM-YYYY')}`;

                        notificacion = {
                            "estado": "sin leer",
                            "icon": "fa fa-users text-aqua",
                            "info": mensaje,
                            "fecha_creacion:": horaactual,
                            "fecha_modificacion:": horaactual
                        };
                    }

                    console.log(email);

                    ref.child('usuarios')
                        .orderByChild('email')
                        .equalTo(email)
                        .once('value').then(conv => {
                            conv.forEach(doc => {
                                const usuariokey = doc.key;
                                console.log('array: ', usuariokey);
                                let newNotification = refUsuarios.child(`${usuariokey}/notificacion/${doc.key}`);
                                newNotification.set(notificacion);
                            });
                        });




                    let mailData = {
                        from: '"SIADRI" <sistema.siadri@correounivalle.edu.co>',
                        bcc: email,
                        subject: 'convenio apunto de vencer',
                        html: mensaje
                    };


                    console.log(mailData);
                    mailTrasport.sendMail(mailData).then(() => {
                        console.log('email enviado');
                    }).catch(error => {
                        console.log(error);
                    });
                }

            });

            console.log(comparacion, fechaActual, diferencia);
        });

};

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

var crearNotificacionFuncion = (email, info) => {
    return ref.child('usuarios')
        .orderByChild('email')
        .equalTo(email)
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
                        "info": `${info}`
                    }
                )
            });
            // return ref.child(`usuarios/${}`)
        })
}


exports.createNotification = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        console.log(req.body)
        if (req.body.hasOwnProperty('email')) {
            crearNotificacionFuncion(req.body.email, req.body.info)
                .then(() => {
                    return res.status(200).json({ status: 200, mensaje: 'Notificacion creada correctamente' });

                }).catch(error => {
                    return res.status(204).json({ status: 204, mensaje: 'error creando la notifiacion' });

                })

        } else {
            return res.status(204).json({ status: 204, mensaje: 'error creando la notifiacion' });
        }

    });

});

exports.AnycreateNotifications = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        console.log(req.body)
        if (req.body.hasOwnProperty('email')) {
            for (let i = 0; i < req.body.email.length; i++) {
                const element = req.body.email[i];
                console.log(element)

                crearNotificacionFuncion(element, req.body.info).then(() => {
                    if (i === req.body.email.length - 1) {
                        return res.status(200).json({ status: 200, mensaje: 'Notificaciones creadas correctamente' });
                    }
                }).catch(error => {
                    return res.status(204).json({ status: 204, mensaje: 'error creando la notifiacion' });

                })


            }


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
                        crearNotificacionFuncion(programaSnap.val()['correo'], req.body.info)
                            .then(() => {
                                return res.status(200).json({ status: 200, mensaje: 'Notificacion creada correctamente' });

                            }).catch(error => {
                                return res.status(204).json({ status: 204, mensaje: 'error creando la notifiacion' });

                            })
                    });
                });
        } else {
            return res.status(204).json({ status: 204, mensaje: 'error creando la notifiacion' });
        }

    });

});

exports.createNotificationNivel3 = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        console.log(req.body)
        return ref.child('usuarios')
            .orderByChild('roles')
            .equalTo('NIVEL3')
            .once('value')
            .then(snapusuariosnivel3 => {
                snapusuariosnivel3.forEach(function (snapUsuario) {
                    crearNotificacionFuncion(snapUsuario.val()['email'], req.body.info)
                        .then(() => {
                            return res.status(200).json({ status: 200, mensaje: 'Notificacion creada correctamente' });

                        }).catch(error => {
                            return res.status(204).json({ status: 204, mensaje: 'error creando la notifiacion' });

                        })
                });
            })


    });

});

exports.enviarCorreoNivel3 = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        console.log(req.body)
        return ref.child('usuarios')
            .orderByChild('roles')
            .equalTo('NIVEL3')
            .once('value')
            .then(snapusuariosnivel3 => {
                snapusuariosnivel3.forEach(function (snapUsuario) {
                    var correoPrograma = snapUsuario.val()['email']

                    sendMail(correoPrograma, req.body.asunto, req.body.mensaje, res);

                });
            })


    });

});

var isEmail = (email) => {
    var response;
    var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    response = regexp.test(email);
    if (response) {
        return {
            state: response,
            msg: ""
        }
    } else {
        return {
            state: response,
            msg: `Correo no válido!
            `
        }
    }

}


var correoPrograma = (programa) => {
    return ref.child('programasAcademicos')
        .orderByChild('NOMBRE PROGRAMA ACADEMICO')
        .equalTo(programa)
        .limitToFirst(1)
        .once('value')
}

// 


exports.enviarCorreoPrograma = functions.https.onRequest((req, res) => {
    cors(req, res, () => {

        correoPrograma(req.body.programa).then(function (correPro) {
            correPro.forEach(function (programaSnap) {
                var correoPrograma = programaSnap.val()['correo']

                sendMail(correoPrograma, req.body.asunto, req.body.mensaje, res);

            });

        })

    });
});

exports.createLetter = functions.https.onRequest((req, res) => {
    cors(req, res, () => {

        correoPrograma(req.body.areaDestino).then(function (correPro) {
            console.log('488', correPro.val())

            correPro.forEach(function (programaSnap) {
                console.log('491', programaSnap)

                var correoPrograma = programaSnap.val()['correo']
                var correos = ''
                if (isEmail(correoPrograma)) {
                    correos = `${req.body.email},${correoPrograma}`
                } else {
                    correos = `${req.body.email}`

                }
                var stringSubjk = (req.body.estado == 'aceptada') ? 'aceptacion' : 'denegacion';

                let pdf = new PDFDocument();

                let buffers = [];
                pdf.on('data', buffers.push.bind(buffers));
                pdf.on('end', () => {

                    let pdfData = Buffer.concat(buffers);

                    const mailsolicitante = {
                        from: 'SIADRI <sistema.siadri@correounivalle.edu.co>',
                        bcc: `${correos}`,
                        subject: `Carta de ${stringSubjk} "${req.body.nombre}"`,
                        attachments: [{
                            filename: 'solicitud.pdf',
                            content: pdfData
                        }]
                    };


                    try {
                        mailTrasport.sendMail(mailsolicitante);
                        if (res) {
                            res.status(200).json({ status: 200, mensaje: 'correo enviado correctamente' });
                        }
                    }
                    catch (error) {
                        console.log(`${error}`);
                        res.status(204).json({ status: 204, mensaje: 'Error en el correo' });

                    }


                });
                pdf.fontSize(16);

                pdf.text(`Detalles de la solicitud `, 100, 20).moveDown()

                .fontSize(14)
                .text(`${req.body.nombre} tu solicitud ha sido ${req.body.estado}`, 20, 60).moveDown()
                .text(`Fecha de nacimiento: ${req.body.fechaNacimiento} `, 20, 80).moveDown()
                .text(`Nacionalidad: ${req.body.nacionalidad}`, 20, 100).moveDown()
                .text(`Numero de documento: ${req.body.numeroDocumento}`, 20, 120).moveDown()
                .text(`Genero: ${req.body.genero}`, 20, 140).moveDown()
                .text(`Area de destino: ${req.body.areaDestino}`, 20, 160).moveDown()
                // .text('And here is some wrapped text...', 100, 300)
                //     .font('Times-Roman', 13)
                //     .moveDown()
                //     .text(lorem, {
                //         width: 412,
                //         align: 'justify',
                //         indent: 30,
                //         columns: 2,
                //         height: 300,
                //         ellipsis: true
                //     });


                pdf.end()



                // let doc = new PDFDocument
                // doc.addPage()

                // const pdf = doc.pipe();
                // console.log('datos del pdf', doc);






                /************************* */
            });

        })

    });
});
