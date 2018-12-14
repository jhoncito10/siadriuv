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

      this.storage.store('convenios', data);

    });
  }


  getCollection(item) {
    return this._angularfire.list(item);
  }

  agregarHistorial(obj) {
    return this._angularfire.list('cfMailNotification').push(obj);
  }

  consultarHistorial() {
    return this._angularfire.list('cfMailNotification');
  }


  getProgramas() {
    return this._angularfire.list('/programasAcademicos');
  }


  getnodeGeneral(collection, node, value) {
    return this._angularfire.list(collection, {
      query: {
        orderByChild: node,
        equalTo: value
      }
    });
  }


}
