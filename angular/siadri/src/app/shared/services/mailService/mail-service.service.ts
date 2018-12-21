import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class MailServiceService {

  constructor(private _http: HttpClient) { }


  send(email, asunto, mensaje, cc = '', cco = '') {
    const url = `${environment.cloudUrl}/enviarCorreo`;
    const mailData = {
      para: email,
      cc: cc,
      cco: cco,
      asunto: asunto,
      mensaje: mensaje
    };
    return this._http.post(url, mailData)
  }
  sendMailprograma(programa, asunto, mensaje, cc = '', cco = '') {
    const url = `${environment.cloudUrl}/enviarCorreoPrograma`;
    const mailData = {
      programa: programa,
      cc: cc,
      cco: cco,
      asunto: asunto,
      mensaje: mensaje
    };
    return this._http.post(url, mailData)
  }
  sendMailNivel3(asunto, mensaje, cc = '', cco = '') {
    const url = `${environment.cloudUrl}/enviarCorreoNivel3`;
    const mailData = {
      cc: cc,
      cco: cco,
      asunto: asunto,
      mensaje: mensaje
    };
    return this._http.post(url, mailData)
  }

  crearNotification(email, info = '') {
    const url = `${environment.cloudUrl}/createNotification`;
    const bodyNotification = {
      email: email,
      info: info
    };
    return this._http.post(url, bodyNotification)
  }

  AnycrearNotifications(email, info = '') {
    const url = `${environment.cloudUrl}/AnycreateNotifications`;
    const bodyNotification = {
      email: email,
      info: info
    };
    return this._http.post(url, bodyNotification)
  }


  createNotificationPrograma(programa, info = '') {
    const url = `${environment.cloudUrl}/createNotificationPrograma`;
    const bodyNotification = {
      programa: programa,
      info: info
    };
    return this._http.post(url, bodyNotification)
  }
  createNotificationNivel3( info = '') {
    const url = `${environment.cloudUrl}/createNotificationNivel3`;
    const bodyNotification = {
      info: info
    };
    return this._http.post(url, bodyNotification)
  }

  enviarCarta(solicitud, dirDRI, estadod) {
    const url = `${environment.cloudUrl}/createLetter`;
    const email = `${solicitud['Correo electrónico']},${dirDRI}`;
    const  nombre = `${solicitud['NOMBRE']}`;
    const  fechaNacimiento = `${solicitud['FECHA_NACIMIENTO']}`;
    const  nacionalidad = `${solicitud['PAÍS DE ORIGEN']}`;
    const numeroDocumento = `${solicitud['NÚMERO DE IDENTIFICACIÓN']}`;
    const  genero = `${solicitud['ID_SEXO_BIOLOGICO']}`;
    const areaDestino = `${solicitud['PROGRAMA ACADÉMICO DE DESTINO (1)']}`;
    const estado = estadod;

      console.log(email)

    const bodyNotification = {
      email, nombre, fechaNacimiento, nacionalidad, numeroDocumento, genero, areaDestino, estado
    };
    return this._http.post(url, bodyNotification)
  }


  metodo(asunto, message, messageEngli, nombre, correo, link?) {
    const mensaje = '<html>' +
    '<head></head><body> <h2>Estimado(a) ' + nombre + '</h2> <br><br>' +
    '<p>' + message + '</p><br><br> Saludos Cordiales, <br><br>Coordinación de movilidad internacional<br>'
    + '*************************************************************************************************************<br><br><br>' +
    '<h2>Dear ' + nombre + '</h2><br><br>' +
    '<p>' + messageEngli + '</p><br><br> Best regards, <br><br>International mobility coordination<br>'
    + '</body>' +
    '</html>';

    this.send(correo, asunto, mensaje).subscribe(data => {
      console.log(data);
    });
  }


  prueba() {
    const as = 'UNIVALLE Online application approval / Nominacion en linea UNIVALLE';
    const message = 'Hemos recibido la nominacion del estudiante Jhon Jairo a quien contactaremos'
                  + 'para que complete su solicitud en linea';
    const messageEng = 'We have received the nomination of your student Jhon Jairo '
    + 'we will contact in order to complete her/his application online.';
    const cor = 'jhondiaz077@gmail.com'
    this.metodo(as, message, messageEng, 'Jhon Jairo', cor);
  }
}
