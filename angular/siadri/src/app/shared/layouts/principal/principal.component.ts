import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  constructor(private route:Router) { }

  ngOnInit() {
  }


  enrutar(){
    this.route.navigate(['dash']);
  }

}
