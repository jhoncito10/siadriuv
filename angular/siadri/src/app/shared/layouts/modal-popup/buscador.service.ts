import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireDatabaseModule } from 'angularfire2/database';
import { HttpService } from './../../services/http.service';


@Injectable()
export class BuscadorService {


  convenios: any;
  constructor(private ad:AngularFireDatabase, private _http:HttpService){
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
    this.ad.app.database().ref('/solicitudes').push(solicitud).then(data=>{
      const url = `https://us-central1-siadriuv.cloudfunctions.net/enviarCorreo`;
      console.log('solicitud exitosa');
          return this._http.post(url, {
            para: 'francisco.hurtado@geoprocess.com.co',
            asunto: 'prueba SIADRI',
            mensaje: 'Hola, <br>  El usuario "+datosPedido.displayname+" ha solicitado el servicio con el nombre de :  con el codigo de servicio : . <br> ' +
                      'Estos son los datos de contacto : <br> '+
                      'Email: +datosPedido.email_solicitante+ <br> '+ 
                      'Empresa: +datosPedido.empresa+ <br> '+ 
                      'Telefono: +datosPedido.telefono+ <br> '+ 
                      'Direccion: +datosPedido.direccion+ <br> '+ 
                      'Nombre del solicitante: +datosPedido.displayname+<br> '+ 
                      'Estos son los datos de la empresa solicitante :<br> '+
                      'NIT: +datosPedido.nit_empresa+<br> '+
                      'Telefono: +datosPedido.telefono_fijo+<br> '+
                      'Tipo de empresa: +datosPedido.tipo_empresa+<br> '+
                      'Cantidad: +datosPedido.catidad_pruebas+<br> '+
                      'Observaciones: +datosPedido.observaci<br> '+
                      'Informacion de la prueba :<br> '+
                      'Nombre de la prueba: +datosPedido.prueba_ensayo+<br> '+
                      'Codigo de la prueba: +datosPedido.cod_ensayo+<br> '+
                      'Costo unitario: +datosPedido.costo_prueba+<br> '+
                      'Descripcion: +datosPedido.descripcion+<br> '+
                      'Laboratorio que realiza la prueba: +datosPedido.nombre_laboratorio+<br> '+
                      'Normas de la prueba: +datosPedido.normas_prueba+<br>'
                      
                    });
      
    });
  }

  crearBorrador(formulario:any, nombreBorr:any){
    this.ad.app.database().ref('/borradores').push(formulario).then(data=>{
      console.log(data.path.o[1]);
      this.ad.app.database().ref('/borradores/'+data.path.o[1]+'/nombreBorrador').set(nombreBorr).then(()=>{
        console.log('borrador ingresado');
      });
    });
  }

  EliminarBorrador(key:any){
    this.ad.app.database().ref('borradores/'+key).remove();
  }

 


  

}
