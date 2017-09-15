$.blockUI({ message: '<h1><img src="../images/load11.gif" alt="Load icon" height="160" width="160"/> Cargando...</h1>' }); 
var optionsAutoComplConvenios = { state: false };
var optionsAutoComplTipos = { state: false };
var optionsProgramaAcademicos = { state: false };


function obtieneAutocompletar() {// inicio funcion atuocompletar
  return new Promise(function (resolve) { // inicio promesa autocompletar



    var autocompletedb = firebase.database(); // referencia inicial de la DB firebase

    var refConvenios = autocompletedb.ref("/convenios/");
    



    Array.prototype.unique = function (a) { // funcion para eliminar los valores duplicados en un array
      return function () { return this.filter(a) }
    }(function (a, b, c) {
      return c.indexOf(a, b + 1) < 0
    });

    var array_paises = [];// declara arreglo en el cual se alojaran el listado de nombres de laboratorio 
    var array_tipos = [];
    var array_programasAcademicos = [];

    autocompletedb.ref("convenios")
      .orderByChild('country')
      .once("value")
      .then(function (laboratorios) {// se ejecuta al terminar la consulta nombres
        laboratorios.forEach(function (lab) {// agrega cada valor al arreglo
          array_paises.push(lab.val().country);

        });
        console.log(array_paises.unique());
        return (array_paises.unique());// elimina los duplicados

      }).then(function (array) {
        optionsAutoComplConvenios = {// objeto de configuracion de autocompletar

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
        if (
          optionsAutoComplConvenios.state === true && 
          optionsAutoComplTipos.state === true &&
          optionsProgramaAcademicos.state === true
        ) {
          resolve();// resuleve promesa
        }
      });


    autocompletedb.ref("convenios")
      .orderByChild('type')

      .once("value")
      .then(function (laboratorios) {// se ejecuta al terminar la consulta nombres
        laboratorios.forEach(function (lab) {// agrega cada valor al arreglo
          array_tipos.push(lab.val().type);

        });
        return (array_tipos.unique());// elimina los duplicados

      }).then(function (array) {
        optionsAutoComplTipos = {// objeto de configuracion de autocompletar

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
        if (
          optionsAutoComplConvenios.state === true && 
          optionsAutoComplTipos.state === true &&
          optionsProgramaAcademicos.state === true

        ) {
          resolve();// resuleve promesa
        }
      });

      refConvenios
      .once('value')
      .then(function (convenios) {
        var array_programasAcademicos = [];
        convenios.forEach(function(convenio) {
          object = convenio.val().programas_escuelas;
          for (var key in object) {
            if (object.hasOwnProperty(key)) {
              var element = object[key];
              element = element.replace(/\, \b/ig, ",");
              element = element.replace(".", "");
              //console.log(element);
              element = element.split(",");
              for (x=0;x<element.length;x++){
                    //console.log(element[x]);
                    array_programasAcademicos.push(element[x]);
                  }
             //console.log(element);
              
            }
          }

         
        });
        //console.log(element);
        return (array_programasAcademicos.unique());// elimina los duplicados
        
      }).then(function (array) {
        optionsProgramaAcademicos = {// objeto de configuracion de autocompletar

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
        if (optionsAutoComplConvenios.state === true && 
          optionsAutoComplTipos.state === true &&
          optionsProgramaAcademicos.state === true
        ) {
          resolve();// resuleve promesa
        }
      });









  });// fin promesa autocompletar
}// fin funcion atuocompletar


obtieneAutocompletar().then(function (result) {
  $.unblockUI();
}, function (err) {
  console.log(err); // Error: "It broke"
});
