import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';

@Injectable()
export class BuscadorService {


  convenios: any;
  constructor(private ad:AngularFireDatabase) {
    this.getdataConvenio();
  }

  getdataConvenio(){
      this.ad.list('/convenios', {
        query: {
          orderByChild: 'country'
        }
      }).subscribe(data=>{
        this.convenios = data;
    });
  }


  getConvenio(){
    return this.convenios;
  }

}
