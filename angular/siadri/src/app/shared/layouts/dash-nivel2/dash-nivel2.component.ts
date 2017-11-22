import { Component, OnInit } from '@angular/core';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';

declare var $:any;

@Component({
  selector: 'app-dash-nivel2',
  templateUrl: './dash-nivel2.component.html',
  styleUrls: ['./dash-nivel2.component.css']
})
export class DashNivel2Component implements OnInit {

  constructor() { }

  ngOnInit() {
 
  }

  download() { 
    var printDoc = new jsPDF();

    var specialElementHandlers = {
      '#div1': function(element, renderer){
       return true;
      }
     };
     
     // All units are in the set measurement for the document
     // This can be changed to "pt" (points), "mm" (Default), "cm", "in"
     printDoc.fromHTML($('#table').get(0), 15, 15, {
      'width': 500, 
      'elementHandlers': specialElementHandlers
     });
     printDoc.autoPrint();
     printDoc.output("dataurlnewwindow");

    // Save the PDF
    //doc.save('Test.pdf');
  }

  test() {
  // html2canvas($('#form'),{
  //   onrendered: function(canvas){
  //     $('#box').html("");
  //     $('#box').append(canvas);
  //   }
  // });

  // html2canvas($('#form'),{
  //   onrendered: function(canvas) {         
  //       var imgData = canvas.toDataURL(
  //           'image/png');              
  //       var doc = new jsPDF('p', 'mm');
  //       doc.addImage(imgData, 'PNG', 10, 10);
  //       doc.save('sample-file.pdf');
  //   }
  // });

  $('#form').animate({
    scrollTop:$('#form')[0].scrollHeight}, 1000);
 
  }

}
