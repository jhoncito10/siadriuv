import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

@Injectable()
export class ModalService {
  private messageSource = new BehaviorSubject<any>('default message');
  currentMessage = this.messageSource.asObservable();
  constructor() { }
  changeMessage(message: any) {
    this.messageSource.next(message);
  }

  private object = new BehaviorSubject<any>([]);
  currentObject = this.object.asObservable();
  changeObject(object:any){
    this.object.next(object);
  }

}
