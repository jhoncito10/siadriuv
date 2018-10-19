import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';



@Component({
  selector: 'app-tabla-consultas',
  templateUrl: './tabla-consultas.component.html',
  styleUrls: ['./tabla-consultas.component.css']
})
export class TablaConsultasComponent implements OnInit {

  convenios=[];


  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering

  constructor(private _angularfire: AngularFireDatabase) {
    
  }

  ngOnInit(): void {
    this._angularfire.list('/convenios', {
      query: {
        orderByChild: 'country'
      }
    }).take(1).subscribe(data => {
      console.log(data);
      

      for (const key in data) {

        if (data.hasOwnProperty(key)) {
          const element = data[key];
          this.convenios.push(element);

        }
      }

      

    });
   

  }
}
