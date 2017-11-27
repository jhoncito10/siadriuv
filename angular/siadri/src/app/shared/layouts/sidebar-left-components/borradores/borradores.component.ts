import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-borradores',
  templateUrl: './borradores.component.html',
  styleUrls: ['./borradores.component.css']
})
export class BorradoresComponent implements OnInit {
  
  borradores:any;
  user =  JSON.parse(localStorage.getItem('usuario'));

  constructor(private ad:AngularFireDatabase) { 
    
    this.cargarBorradores(this.user.uid);
  }

  ngOnInit() {
  }

  cargarBorradores(uid:any){
    this.ad.list('/borradores', {
      query: {
        orderByChild: 'uid_diligenciado',
        equalTo:uid
      }
    }).subscribe(data=>{
      this.borradores = data;
      console.log(this.borradores);
  });

  }

  mostrarBorrador(key:any){

    console.log(key);

    for (let index = 0; index < this.borradores.length; index++) {
      if (this.borradores[index]['$key'] === key) {
       
       }
    }

    
  }
}
