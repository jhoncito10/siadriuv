import { ModalService } from './../../../modal.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {

  solicitudes:any;
  user =  JSON.parse(localStorage.getItem('usuario'));

  constructor(private ad:AngularFireDatabase, private data:ModalService) {
    // console.log(this.user);
   }

  ngOnInit() {
    this.cargarSolicitudes(this.user.uid);
  }

  //METODO QUE CARGA LAS SOLICITUDES DE EL USUARIO QUE ESTA AUTENTICADO EN ESE MOMENTO
  cargarSolicitudes(uid:any){
        this.ad.list('/solicitudes', {
          query: {
            orderByChild: 'uid_diligenciado',
            equalTo:uid
          }
        }).subscribe(data=>{
          this.solicitudes = data;
      });
    
 }
    
 //METODO QUE PERMITE MOSTRAR LAS SOLICITUDES DE EL USUARIO DEPENDIENDO LA SOLICITUD QUE LE DE CLICK
      mostrarSolicitud(key:any){
        for (let index = 0; index < this.solicitudes.length; index++) {
          if (this.solicitudes[index]['$key'] === key) {
            this.data.changeformulario(this.solicitudes[index]);
            this.data.changeImprimir(true);
           }
        }
      }

}
