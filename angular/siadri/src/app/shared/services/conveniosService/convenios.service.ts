import { Injectable } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { AngularFireDatabase } from 'angularfire2/database';


@Injectable()
export class ConveniosService {

  constructor(private _angularfire: AngularFireDatabase, private storage: LocalStorageService) {

  }
  getConvenios() {
    return this._angularfire.list('/convenios', {
      query: {
        orderByChild: 'Pais'
      }
    })
    // .take(1)
    .subscribe(data => {
      console.log(data);

      this.storage.store('convenios', data);

    });
  }

}
