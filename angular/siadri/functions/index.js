'use strict';
const functions = require('firebase-functions');
const moment = require('moment');
const cors = require('cors')({ origin: true });
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
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

}


exports.enviarCorreo = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        sendMail(req.body, res);
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
        .once('value');
    snap.forEach(childSnap => {
        const email = childSnap.val().email;
        const key = childSnap.key;
        usuarios.emails.push(email);
        usuarios.keys.push(key);
    });
    const usuarios_1 = usuarios;
    console.log('emails ' + usuarios_1.emails.join());
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
                }
                else {
                    mensaje = `El convenio con la institucion "${child.val().institucion}" vencera en menos de 6 meses, en la fecha ${child.val().fecha_de_vencimiento}`;
                    notificacion = {
                        "estado": "sin leer",
                        "icon": "fa fa-users text-aqua",
                        "info": mensaje,
                        "fecha_creacion:": horaactual,
                        "fecha_modificacion:": horaactual
                    };
                }
                for (const key_1 in usuarios_1.keys) {
                    if (usuarios_1.keys.hasOwnProperty(key_1)) {
                        const usuariokey = usuarios_1.keys[key_1];
                        let newNotification = refUsuarios.child(`/${usuariokey}/notificacion/${child.key}/`);
                        newNotification.set(notificacion);
                    }
                }
                let mailData = {
                    from: '"SIADRI" <sistema.siadri@correounivalle.edu.co>',
                    bcc: usuarios_1.emails.join(),
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
        });

    });

};

exports.weeklyEmail = functions.https.onRequest((req, res) => {
    verificaFechas().then(() => {
        res.send('email enviado');
    }).catch(error => {
        res.send(error);
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


exports.createLetter = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        correoPrograma(req.body.areaDestino).then(function (correPro) {
            correPro.forEach(function (programaSnap) {
                var correoPrograma = programaSnap.val()['correo']
                var correos = ''
                if (isEmail(correoPrograma)) {
                    correos = `${req.body.email},${correoPrograma}`
                } else {
                    correos = `${req.body.email}`

                }
                console.log(correos)
                var cuerpoPDF = `${req.body.nombre} tu solicitud a sido aprovada.
                Estos son los datos de tu solicitud
                ${req.body.fechaNacimiento}
                ${req.body.nacionalidad}
                ${req.body.numeroDocumento}
                ${req.body.genero}
                ${req.body.areaDestino}`;

                var mailsolicitante = {
                    from: 'SIADRI <sistema.siadri@correounivalle.edu.co>',
                    bcc: `${correos}`,
                    subject: `Carta de aceptacion "${req.body.nombre}"`,
                    html: cuerpoPDF
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

        })

    });
});