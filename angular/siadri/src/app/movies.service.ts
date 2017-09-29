/* import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
@Injectable()
export class MoviesService {
  constructor(private db: AngularFireDatabase) { }
  getMovies(start, end): FirebaseListObservable<any> {
    return this.db.list('/movies', {
      query: {
        orderByChild: 'Title',
        limitToFirst: 10,
        startAt: start,
        endAt: end
      }
    });
  }
} */
