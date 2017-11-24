import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireDatabaseModule } from 'angularfire2/database';

@Injectable()
export class BuscadorService {


  convenios: any;
  constructor(private ad:AngularFireDatabase){
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


  crearSolicitud(solicitud:any){
    this.ad.database.ref('/solicitudes').push(solicitud).then(()=>{
      console.log('solicitud exitosa');
    });
  }

  crearBorrador(formulario:any, nombreBorr:any){
    this.ad.database.ref('/borradores').push(formulario).then(data=>{
      console.log(data.path.o[1]);
      this.ad.database.ref('/borradores/'+data.path.o[1]+'/nombreBorrador').set(nombreBorr).then(()=>{
        console.log('borrador ingresado');
      });
    });
  }

 


  

}
