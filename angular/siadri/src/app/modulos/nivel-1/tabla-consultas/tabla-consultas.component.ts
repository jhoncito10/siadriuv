import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';


@Component({
  selector: 'app-tabla-consultas',
  templateUrl: './tabla-consultas.component.html',
  styleUrls: ['./tabla-consultas.component.css']
})
export class TablaConsultasComponent implements OnInit {

  constructor(private _angularfire:AngularFireDatabase) { }

  ngOnInit() {
  }

}
