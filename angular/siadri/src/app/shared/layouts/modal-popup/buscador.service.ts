import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireDatabaseModule } from 'angularfire2/database';
import { HttpService } from './../../services/http.service';
import { environment } from "../../../../environments/environment";

declare var $: any;

@Injectable()
export class BuscadorService {

  convenios: any;
  constructor(private ad: AngularFireDatabase, private _http: HttpService) {
    this.getdataConvenio();
  }

  getdataConvenio() {
    this.ad.list('/convenios', {
      query: {
        orderByChild: 'Pais'
      }
    }).subscribe(data => {
      this.convenios = data;
    });

  }

  getConvenio() {
    return this.convenios;
  }


  crearSolicitud(solicitud: any, nombreSol: any) {
    this.ad.app.database().ref('/solicitudes').push(solicitud).then(data => {
      this.ad.app.database().ref('/solicitudes/' + data.path.o[1] + '/nombreSolicitud').set(nombreSol).then(() => {
        const url = `${environment.cloudUrl}/enviarCorreo`;
        let mailData = {
          para: solicitud.correo_solicitante,
          asunto: 'Solicitud de convenio',
          mensaje: `El usuario ${solicitud.solicitante.nombre} con el correo ${solicitud.correo_solicitante}
                    realizo subscripcion al estudio  de convenio o contrato
                    `

        }
        // return this._http.post(url, mailData);

        $.ajax(
          {
            type: 'POST',
            url: url,
            data: JSON.stringify(mailData),
            success: function (result) {
              $('#modal3').modal('hide');
              alert('solicitud exitosa');

            },
            contentType: 'application/json'
          });

      });


    });
  }

  crearRenovacion(renovacion: any, nombreRen: any){
    this.ad.app.database().ref('/renovaciones').push(renovacion).then(data => {
      this.ad.app.database().ref('/renovaciones/' + data.path.o[1] + '/nombreRenov').set(nombreRen).then(() => {
        const url = `${environment.cloudUrl}/enviarCorreo`;
        let mailData = {
          para: renovacion.correo_solicitante,
          asunto: 'Solicitud de convenio',
          mensaje: `El usuario ${renovacion.solicitante.nombre} con el correo ${renovacion.correo_solicitante}
                    realizo subscripcion al estudio  de convenio o contrato
                    `

        }
        // return this._http.post(url, mailData);

        $.ajax(
          {
            type: 'POST',
            url: url,
            data: JSON.stringify(mailData),
            success: function (result) {
              $('#modal3').modal('hide');
              alert('solicitud exitosa');

            },
            contentType: 'application/json'
          });

      });


    });
  }

  crearBorrador(formulario: any, nombreBorr: any) {
    this.ad.app.database().ref('/borradores').push(formulario).then(data => {
      this.ad.app.database().ref('/borradores/' + data.path.o[1] + '/nombreBorrador').set(nombreBorr).then(() => {
        $('#modal3').modal('hide');
        alert('borrador ingresado');
      });
    });
  }

  EliminarBorrador(key: any) {
    this.ad.app.database().ref('borradores/' + key).remove();
  }

  getConv() {
    return this.ad.list('/convenios_inicio', {
      query: {
        orderByChild: 'pais'
      }
    });

  }

  getNotificaciones(userkey: any) {
    return this.ad.list('/usuarios/' + userkey + '/notificacion', {
      query: {
        orderByChild: 'estado',
        equalTo: 'sin leer'
      }
    });
  }

  setNotificacion(userkey: any, notkey) {

    return this.ad.app.database().ref('/usuarios/' + userkey + '/notificacion/' + notkey + '/estado').set('leido');
  }

  // setEstadoFormInvestigacion(userkey:any){
  //   return this.ad.app.database().ref('/investigaciones' + userkey + '/estado').set('DILIGENCIADO');
  // }

  crearFormInvestigacion(userkey:any,form){
    return this.ad.app.database().ref('/investigaciones').push({form, uid_diligenciado: userkey});
  }



  getInvestigaciones(){
    return this.ad.list('/investigaciones', {
      query: {
        orderByChild: 'comite'
      }
    });
  }





}
/*

solicitante: {…}
alcance: ""
beneficios: ""
coordinador: ""
correo: ""
fax: ""
institucion: ""
justificacion: ""
nombre: "francisco hurtado velasco"
objetivo: ""
programa: "desarroolllo"
replegal: ""


conveniocontrato: {…}
clasificacion: Object { internacional: false, nacional: false, departamental: false, … }
duracion: ""
resolucion: ""
tipo: Object { convenio: {…}, contrato: false }
valor: ""
__proto__: Object { … }
correo_diligenciado: "sistema.siadri@correounivalle.edu.co"
correo_solicitante: "francisco.hurtado@geoprocess.com"
fecha: {…}
ano: "2017"
dia: "19"
mes: "12"
__proto__: Object { … }
observaciones: ""
presupuesto: {…}
cap: 0
conciu: 0
cper: 0
ctp17: 0
dif: 0
disr: 0
eqac: 0
fc: 0
foi: 0
gali: 0
galoj: 0
gas: 0
gasg: 0
gtran: 0
idp: 0
iif: 0
imp: 0
ing: 0
mys: 0
ops: 0
per30: 0
peu: 0
pnu: 0
rendf: 0
repu: 0
sala: 0
ti: 0
totalrec: 0
totcos: 0
valemi: 0
viu: 0
__proto__: Object { … }
solicitante: {…}
alcance: ""
beneficios: ""
coordinador: ""
correo: ""
fax: ""
institucion: ""
justificacion: ""
nombre: ""
objetivo: ""
programa: ""
replegal: ""
telefono: ""
__proto__: Object { … }
tipoconvcont: {…}
academico: Object { mov: false, ies: false, act: false, … }
bienestar: Object { abu: false }
interna: Object { mi: false, pci: false }
investigacion: Object { pdi: false, oai: false }
__proto__: Object { … }
uid_diligenciado: "QUfOa24U0Yck12bjtP9IewIF1Mo2"
vicerectoria: ""*/
