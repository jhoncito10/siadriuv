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
    console.log('constructor');
    
    
  }

  ngOnInit() {
    this.cargarBorradores(this.user.uid);
  }

  cargarBorradores(uid:any){

  console.log(uid);
    this.ad.list('/borradores', {
      query: {
        orderByChild: 'uid_diligenciado',
        equalTo:uid
      }
    }).subscribe(data=>{
      this.borradores = data;
      console.log(data);
  });

  }

  mostrarBorrador(key:any){
    for (let index = 0; index < this.borradores.length; index++) {
      if (this.borradores[index]['$key'] === key) {
        this.data.changeformulario(this.borradores[index]);
       }
    }
  }

}
