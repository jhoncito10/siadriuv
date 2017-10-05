import { query } from '@angular/core/src/animation/dsl';
import { any } from 'codelyzer/util/function';
import { FirebaseObjectObservable, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Injectable } from '@angular/core';

@Injectable()
export class ServiceService {

  constructor(private af: AngularFireDatabase) {}

getConvenios(start, end): FirebaseListObservable<any> {
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
