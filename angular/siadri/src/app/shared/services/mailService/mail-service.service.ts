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

}
