import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Injectable } from '@angular/core';

@Injectable()
export class AutocompleteService {

  constructor(private af: AngularFireDatabase) {}
  getConvenios(start, end): FirebaseListObservable<any> {
    console.log('PRUEBA')
    return this.af.list('/convenios', {
      query: {
        orderByChild: 'country',
        limitToFirst: 10,
        startAt: start,
        endAt: end
      }
    })
  }

}
