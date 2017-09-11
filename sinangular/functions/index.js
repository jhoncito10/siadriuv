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