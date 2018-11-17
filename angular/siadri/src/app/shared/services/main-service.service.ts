import { Injectable } from '@angular/core';

import { ConveniosService } from './conveniosService/convenios.service';
import { MailServiceService } from "./mailService/mail-service.service";

export {
  ConveniosService,
  MailServiceService
};
@Injectable()

export class MixedFunctions {

  constructor() {

  }
  removeDuplicadesArray(array){
    let unique = {};
    array.forEach(function(i) {
      if(!unique[i]) {
        unique[i] = true;
      }
    });
    return Object.keys(unique);
  }
  isEmail(email:string)
    {

        var  response:boolean;

        var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

        response = regexp.test(email);

        console.log(response)
        if (response) {
          return {
            state:response,
            msg:""
          }
        } else {
          return {
            state:response,
            msg:`Correo no válido!
            `
          }
        }
        
    }
    makePassword() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
      for (var i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    
      return text;
    }

}