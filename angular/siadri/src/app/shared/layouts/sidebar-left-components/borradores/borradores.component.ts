import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { ModalService } from 'app/shared/modal.service';

@Component({
  selector: 'app-borradores',
  templateUrl: './borradores.component.html',
  styleUrls: ['./borradores.component.css']
})
export class BorradoresComponent implements OnInit {
  
  borradores:any;
  user =  JSON.parse(localStorage.getItem('usuario'));

  constructor(private ad:AngularFireDatabase, private data:ModalService) {
  }

  ngOnInit() {
    this.cargarBorradores(this.user.uid);
  }

  //METODO QUE CARGA LOS BORRADORES DE EL USUARIO QUE ESTA AUTENTICADO EN ESE MOMENTO
  cargarBorradores(uid:any){
    this.ad.list('/borradores', {
      query: {
        orderByChild: 'uid_diligenciado',
        equalTo:uid
      }
    }).subscribe(data=>{
      this.borradores = data;
  });

  }

  //METODO QUE PERMITE MOSTRAR LOS BORRADORES DE EL USUARIO DEPENDIENDO EL BORRADOR AL QUE LE DE CLICK
  mostrarBorrador(key:any,origen:any){
    for (let index = 0; index < this.borradores.length; index++) {
      if (this.borradores[index]['$key'] === key) {
        if(origen == "Sol"){
          this.data.changeformulario(this.borradores[index]);
        }else{
          this.data.changeformularioRenovacion(this.borradores[index]);
        }
        this.data.changeImprimir(false);
       }
    }
  }

  origen(item){
    if(item != undefined){
      return item.substring(0, 3);
    }
    
  }

}
