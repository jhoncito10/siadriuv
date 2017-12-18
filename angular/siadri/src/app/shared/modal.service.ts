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

   //variable que contiene el grafico  que esta haciendo el llamado
   private GraficoSource = new BehaviorSubject<any>('Grafico1');
   currentGrafico = this.GraficoSource.asObservable();
   changeGrafico(grafico: any){
     this.GraficoSource.next(grafico);
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

    //variable que contiene el arreglo del grafico de barras horizontales
    private  conveniosGraficos = new BehaviorSubject<any>([]);
    currentGraficos = this.conveniosGraficos.asObservable();
    changeConveniosGraficos(convenios: any) {
      this.conveniosGraficos.next(convenios);
    }


    //variable que contiene el arreglo del grafico de barras horizontales del segundo nodo
    private  conveniosGraficos2 = new BehaviorSubject<any>([]);
    currentGraficos2 = this.conveniosGraficos2.asObservable();
    changeConveniosGraficos2(convenios2: any) {
      this.conveniosGraficos2.next(convenios2);
    }


      //variable que contiene el arreglo del grafico de barras verticales
      private  prueba = new BehaviorSubject<any>([{name:"",value:0,xlabel:"",ylabel:"",title:""}]);
      currentPrueba = this.prueba.asObservable();
      changePrueba(pru: any) {
        this.prueba.next(pru);
      }


       //variable que contiene el arreglo de las notificaciones del header
       private  notificacion = new BehaviorSubject<any>([]);
       currentNotificacion = this.notificacion.asObservable();
       changeNotifcacion(noti: any) {
         this.notificacion.next(noti);
       }
}
