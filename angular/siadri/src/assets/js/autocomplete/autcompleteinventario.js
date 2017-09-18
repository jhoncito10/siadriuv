<<<<<<< HEAD

 var optionsAutoCompl= {state:false},
    optionsPruebaEnsayo = {state:false},
    optionsescuelas = {state:false},
    optiongruposinvestigacion = {state:false},
    optionsdirectores = {state:false};


function obtieneAutocompletar(){// inicio funcion atuocompletar
  return new Promise(function(resolve){ // inicio promesa autocompletar
              
              

    var autocompletedb = firebase.database(); // referencia inicial de la DB firebase




    Array.prototype.unique=function(a){ // funcion para eliminar los valores duplicados en un array
      return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
    });

    var array_nombreslab = [];// declara arreglo en el cual se alojaran el listado de nombres de laboratorio 
    autocompletedb.ref("informacion_laboratorios")
    .orderByChild('estado') 
    .equalTo("activo")
    .once("value")
    .then(function (laboratorios) {// se ejecuta al terminar la consulta nombres
      
      laboratorios.forEach( function( lab ) {// agrega cada valor al arreglo
              array_nombreslab.push(lab.val().cod_lab + ' - ' + lab.val().nombre_de_laboratorio);
              
        });
      return(array_nombreslab.unique() );// elimina los duplicados

    }).then(function(array){
      
      optionsAutoCompl = {// objeto de configuracion de autocompletar

      data: array,
      list: {
        match: {
          enabled: true
        },
        maxNumberOfElements: 6,

        showAnimation: {
          type: "slide",
          time: 300
        },
        hideAnimation: {
          type: "slide",
          time: 300
        }
      },

      theme: "",
      state: true

    };
    if (optionsAutoCompl.state=== true) {

          $('#input-autocompletar').html('');
          $('#input-autocompletar').html('<input type="text" class="form-control" id="inputNombreLab" placeholder="Nombre de Laboratorio">');
          $("#inputNombreLab").easyAutocomplete(optionsAutoCompl);
          $(".easy-autocomplete").width('100%');

          resolve();// resuleve promesa
        }
    });

  });// fin promesa autocompletar
}// fin funcion atuocompletar


obtieneAutocompletar().then(function(result) {
  }, function(err) {
    console.log(err); // Error: "It broke"
  });
=======

 var optionsAutoCompl= {state:false},
    optionsPruebaEnsayo = {state:false},
    optionsescuelas = {state:false},
    optiongruposinvestigacion = {state:false},
    optionsdirectores = {state:false};


function obtieneAutocompletar(){// inicio funcion atuocompletar
  return new Promise(function(resolve){ // inicio promesa autocompletar
              
              

    var autocompletedb = firebase.database(); // referencia inicial de la DB firebase




    Array.prototype.unique=function(a){ // funcion para eliminar los valores duplicados en un array
      return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
    });

    var array_nombreslab = [];// declara arreglo en el cual se alojaran el listado de nombres de laboratorio 
    autocompletedb.ref("informacion_laboratorios")
    .orderByChild('estado') 
    .equalTo("activo")
    .once("value")
    .then(function (laboratorios) {// se ejecuta al terminar la consulta nombres
      
      laboratorios.forEach( function( lab ) {// agrega cada valor al arreglo
              array_nombreslab.push(lab.val().cod_lab + ' - ' + lab.val().nombre_de_laboratorio);
              
        });
      return(array_nombreslab.unique() );// elimina los duplicados

    }).then(function(array){
      
      optionsAutoCompl = {// objeto de configuracion de autocompletar

      data: array,
      list: {
        match: {
          enabled: true
        },
        maxNumberOfElements: 6,

        showAnimation: {
          type: "slide",
          time: 300
        },
        hideAnimation: {
          type: "slide",
          time: 300
        }
      },

      theme: "",
      state: true

    };
    if (optionsAutoCompl.state=== true) {

          $('#input-autocompletar').html('');
          $('#input-autocompletar').html('<input type="text" class="form-control" id="inputNombreLab" placeholder="Nombre de Laboratorio">');
          $("#inputNombreLab").easyAutocomplete(optionsAutoCompl);
          $(".easy-autocomplete").width('100%');

          resolve();// resuleve promesa
        }
    });

  });// fin promesa autocompletar
}// fin funcion atuocompletar


obtieneAutocompletar().then(function(result) {
  }, function(err) {
    console.log(err); // Error: "It broke"
  });
>>>>>>> 42ca7d2ea14e3cd9df2b6208a68bbe259a0cdc4a
