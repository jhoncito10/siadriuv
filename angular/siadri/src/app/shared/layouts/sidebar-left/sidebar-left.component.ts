import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar-left',
  templateUrl: './sidebar-left.component.html',
  styleUrls: ['./sidebar-left.component.css']
})
export class SidebarLeftComponent implements OnInit {
  datosUser = null;
  constructor() {
    if (localStorage.getItem('usuario')) {
      this.datosUser = JSON.parse(localStorage.getItem('usuario'));
    }
     }

  ngOnInit() {
  }

}
