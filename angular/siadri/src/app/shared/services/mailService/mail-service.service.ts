import { Injectable } from '@angular/core';
import { environment } from "../../../../environments/environment";
import { HttpClient } from '@angular/common/http';


@Injectable()
export class MailServiceService {

  constructor(private _http:HttpClient) { }


  send(email,asunto,mensaje,cc ='',cco='') {
    const url = `${environment.cloudUrl}/enviarCorreo`;
    const mailData = {
      para:email,
      cc:cc,
      cco:cco,
      asunto:asunto,
      mensaje:mensaje
    };
    return this._http.post(url,mailData)
  }

  crearNotification(email,info=''){
    const url = `${environment.cloudUrl}/createNotification`;
    const bodyNotification = {
      email:email,
     info:info
    };
    return this._http.post(url,bodyNotification)
  }
  createNotificationPrograma(programa,info=''){
    const url = `${environment.cloudUrl}/createNotificationPrograma`;
    const bodyNotification = {
      programa:programa,
     info:info
    };
    return this._http.post(url,bodyNotification)
  }
}
