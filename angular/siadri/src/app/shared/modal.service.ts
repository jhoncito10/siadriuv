import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';


//esta clase es la encargada de contener todas las variables observables que van
//cambiando en tiempo real
@Injectable()
export class ModalService {

  //variable que contiene el mensaje que se muestra en el Modal-Popup
  private messageSource = new BehaviorSubject<any>('default message');
  currentMessage = this.messageSource.asObservable();
  constructor() { }
  changeMessage(message: any) {
    this.messageSource.next(message);
  }

  //variable que contiene las consultas de los convenios
  private object = new BehaviorSubject<any>([]);
  currentObject = this.object.asObservable();
  changeObject(object:any){
    this.object.next(object);
  }

  //variable que contiene el objecto json que corresponde a los datos del formulario
  private formulario = new BehaviorSubject<any>([]);
  currentformulario = this.formulario.asObservable();
  changeformulario(form:any){
    this.formulario.next(form);
  }

  //variable que permite controlar la aparicion o desaparicion del boton imprimir de la interfaz
  //de solicitudes
  private imprimir = new BehaviorSubject<any>([]);
  currentImprimir = this.imprimir.asObservable();
  changeImprimir(imp:any){
    this.imprimir.next(imp);
  }

  //variable que contiene el usuario 
  private UserSource = new BehaviorSubject<any>('default message');
  currentUser = this.UserSource.asObservable();
  changeUser(user: any) {
    this.UserSource.next(user);
  }

    //variable que contiene el mensaje que se muestra en el Modal-Popup
    private  conveniosGraficos = new BehaviorSubject<any>([]);
    currentGraficos = this.conveniosGraficos.asObservable();
    changeConveniosGraficos(convenios: any) {
      this.conveniosGraficos.next(convenios);
    }


      //variable que contiene el mensaje que se muestra en el Modal-Popup
      private  prueba = new BehaviorSubject<any>([]);
      currentPrueba = this.prueba.asObservable();
      changePrueba(pru: any) {
        this.prueba.next(pru);
      }
}
