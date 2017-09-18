$.blockUI({ message: '<h1><img src="../images/load11.gif" alt="Load icon" height="160" width="160"/> Cargando...</h1>' }); 
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
              array_nombreslab.push(lab.val().nombre_de_laboratorio);
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

      theme: "round",
      state: true

    };
    if (optionsAutoCompl.state=== true &&
        optionsPruebaEnsayo.state === true &&
        optionsescuelas.state === true &&
        optiongruposinvestigacion.state === true &&
        optionsdirectores.state === true ) {
          resolve();// resuleve promesa
        }
    });


    var array_ensayos = [];// declara arreglo en el cual se alojaran el listado de ensayos 
    autocompletedb.ref("ensayos")
    .orderByChild('prueba_ensayo')
    .once("value")
    .then(function (snapshot) {// se ejecuta al terminar la consulta ensayos

        snapshot.forEach(function (snap) {// agrega cada valor al arreglo
          if (snap.val().estado === "activo") {
           array_ensayos.push(snap.val().prueba_ensayo);
          }
        });
    return(array_ensayos.unique() );// elimina los duplicados


  }).then(function(array){
      optionsPruebaEnsayo = {// objeto de configuracion de autocompletar
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

      theme: "round",
      state: true
    };
    if (optionsAutoCompl.state=== true &&
        optionsPruebaEnsayo.state === true &&
        optionsescuelas.state === true &&
        optiongruposinvestigacion.state === true &&
        optionsdirectores.state === true ) {
          resolve();// resuleve promesa
        }
    });



    var array_escuelas = [];// declara arreglo en el cual se alojaran el listado de nombres de las ecuelas 
    autocompletedb.ref("informacion_laboratorios")
    .orderByChild('estado') 
    .equalTo("activo")
    .once("value")
    .then(function (snapshot) {// se ejecuta al terminar la consulta escuelas

      snapshot.forEach( function( value ) {// agrega cada valor al arreglo
          array_escuelas.push(value.val().escuela_o_departamento);

        });
    return(array_escuelas.unique() );// elimina los duplicados


    }).then(function(array){
      optionsescuelas = {// objeto de configuracion de autocompletar
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

      theme: "round",
      state: true
    };
    if (optionsAutoCompl.state=== true &&
        optionsPruebaEnsayo.state === true &&
        optionsescuelas.state === true &&
        optiongruposinvestigacion.state === true &&
        optionsdirectores.state === true ) {
          resolve();// resuleve promesa
        }
    });

    var array_groupinvestigacion = [];// declara arreglo en el cual se alojaran el listado de nombres de grupos de investigacion 
    autocompletedb.ref("informacion_laboratorios")
    .orderByChild('estado') 
    .equalTo("activo")
    .once("value")
    .then(function (snapshot) {// se ejecuta al terminar la consulta grupos de investigacion

      snapshot.forEach( function( value ) {// agrega cada valor al arreglo
          array_groupinvestigacion.push(value.val().grupo_de_investigacion);
          

        });
    return(array_groupinvestigacion.unique() );// elimina los duplicados


    }).then(function(array){
      optiongruposinvestigacion = {// objeto de configuracion de autocompletar

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

          theme: "round",
      state: true

    };
    if (optionsAutoCompl.state=== true &&
        optionsPruebaEnsayo.state === true &&
        optionsescuelas.state === true &&
        optiongruposinvestigacion.state === true &&
        optionsdirectores.state === true ) {
          resolve();// resuleve promesa
        }
    });



    var array_directores = [];// declara arreglo en el cual se alojaran el listado de nombres de los directores de laboratorio 
    autocompletedb.ref("informacion_laboratorios")
    .orderByChild('estado') 
    .equalTo("activo")
    .once("value")
    .then(function (snapshot) { // se ejecuta al terminar la consulta directores

      snapshot.forEach( function(  value ) {// agrega cada valor al arreglo
           array_directores.push(value.val().nombre_responsable);


        });
    return(array_directores.unique() );// elimina los duplicados


    }).then(function(array){
      optionsdirectores = {// objeto de configuracion de autocompletar

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

          theme: "round",
      state: true

    };
    if (optionsAutoCompl.state=== true &&
        optionsPruebaEnsayo.state === true &&
        optionsescuelas.state === true &&
        optiongruposinvestigacion.state === true &&
        optionsdirectores.state === true ) {
          resolve();// resuleve promesa
        }
    });


  });// fin promesa autocompletar
}// fin funcion atuocompletar


obtieneAutocompletar().then(function(result) {
    $.unblockUI();
  }, function(err) {
    console.log(err); // Error: "It broke"
  });
